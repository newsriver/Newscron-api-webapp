package ch.newscron.v3.rest;

import ch.newscron.data.article.v2.ArticleFactory;
import ch.newscron.data.publisher.PublisherServiceFactory;
import ch.newscron.extractor.StructuredArticle;
import ch.newscron.v3.data.Article;
import ch.newscron.v3.data.Category;
import ch.newscron.v3.data.CategoryPreference;
import ch.newscron.v3.data.Publisher;
import ch.newscron.v3.data.Section;
import org.apache.commons.dbutils.DbUtils;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by eliapalme on 09.12.16.
 */
@RestController
public class CategoryArticles {


    private static final Logger log = Logger.getLogger(Featured.class);


    @Autowired
    @Qualifier("dataSource")
    private DataSource dataSource;


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/v3/category", method = RequestMethod.POST)
    public Section featured(@RequestBody CategoryPreference category, @RequestParam(value = "limit", required = false, defaultValue = "20") int limit, @RequestParam(value = "before", required = false, defaultValue = "0") long timestamp) {
        return categoryArticles(category, limit, timestamp);
    }


    private Section categoryArticles(CategoryPreference categoryPreference, int limit, long timestamp) {

        Instant start = Instant.now();
        Section categoryArticles = new Section();
        Category category = new Category();
        category.setId(categoryPreference.getId());
        category.setName(categoryPreference.getName());
        categoryArticles.setCategory(category);

        Instant query_start = Instant.now();
        PublisherServiceFactory publisherServiceFactory = PublisherServiceFactory.getInstance();
        ArticleFactory articleFactory = ArticleFactory.getInstance();
        Set<Long> articlesId = categoryArticlesIds(categoryPreference, limit, timestamp);
        Instant query_end = Instant.now();

        Instant getArticles_start = Instant.now();
        ArrayList<StructuredArticle> articles = articleFactory.getArticles(articlesId);
        Instant getArticles_end = Instant.now();

        for (StructuredArticle strArticle : articles) {

            Article article = new Article();
            article.setId(strArticle.getArticleID());
            article.setTopicId(strArticle.getTopicID());
            article.setTitle(strArticle.getTitle());
            article.setSnippet(buildSnippet(strArticle.getText()));
            article.setImgUrl(strArticle.getImageSrc());
            article.setPublicationDate(strArticle.getPublicationDateGMT());
            article.setUrl(strArticle.getUrl());

            article.setCategory(category);

            Publisher publisher = new Publisher();
            publisher.setId(strArticle.getPublisherId());
            publisher.setName(strArticle.getPublisher());
            publisher.setRelevance(publisherServiceFactory.getPublisherRelevanceForCategory(strArticle.getPublisherId(), strArticle.getCategoryId()));
            article.setPublisher(publisher);

            categoryArticles.getArticles().add(article);
        }
        Instant end = Instant.now();

        System.out.println("Category timing total:" + Duration.between(start, end) + " query:" + Duration.between(query_start, query_end) + " fetch:" + Duration.between(getArticles_start, getArticles_end));


        return categoryArticles;
    }


    private Set<Long> categoryArticlesIds(CategoryPreference category, int limit, long timestamp) {

        HashSet<Long> articleIds = new HashSet<>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        String packagesIds = "";
        for (Integer packageId : category.getPackages()) {
            packagesIds += packageId + ",";
        }
        packagesIds += "-1";

        String publishersOptOut = "";
        if (category.getPublishersRelevance() != null) {
            for (Publisher publisher : category.getPublishersRelevance().values()) {
                if (publisher.getRelevance() <= -100) {
                    publishersOptOut += publisher.getId() + ",";
                }
            }
        }
        publishersOptOut += "-1";

        try {


            conn = this.dataSource.getConnection();
            conn.setReadOnly(true);

            String sql = "SELECT A.id, A.topicId FROM NewscronContent.article AS A \n" +
                    " WHERE A.publicationDateGMT > DATE_SUB(now(), Interval 7 DAY) AND A.categoryID=? AND A.packageID in (" + packagesIds + ") AND A.publisherId NOT in (" + publishersOptOut + ") AND A.cloneID is NULL\n";
            if (timestamp > 0) {
                sql += " AND A.publicationDateGMT < ? ";
            }
            sql += " ORDER BY A.publicationDateGMT DESC LIMIT ?;";


            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, category.getId());
            if (timestamp > 0) {
                stmt.setTimestamp(2, new Timestamp(timestamp));
                stmt.setInt(3, limit * 20);
            } else {
                stmt.setInt(2, limit * 20);
            }

            rs = stmt.executeQuery();

            HashSet<Long> topicIds = new HashSet<Long>();
            while (rs.next() && limit > 0) {
                if (!topicIds.add(rs.getLong("A.topicId"))) {
                    continue;
                }
                if (articleIds.add(rs.getLong("A.id"))) {
                    limit--;
                }
            }
        } catch (Exception e) {
            log.log(Level.ERROR, "Error unable to query top article ids for category", e);
        } finally {
            DbUtils.closeQuietly(rs);
            DbUtils.closeQuietly(stmt);
            DbUtils.closeQuietly(conn);
        }
        return articleIds;
    }

    private String buildSnippet(String text) {
        String snippet = text.substring(0, 340 > text.length() ? text.length() : 340);
        int index = snippet.lastIndexOf(" ");
        if (index > 340 / 2) {
            snippet = snippet.substring(0, index) + "...";
        }

        return snippet;
    }
}
