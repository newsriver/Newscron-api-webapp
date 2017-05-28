package ch.newscron.v3.rest;

import ch.newscron.data.article.v2.ArticleFactory;
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
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
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
    public Section featured(@RequestBody CategoryPreference category) {

        return categoryArticles(category, 50);

    }


    private Section categoryArticles(CategoryPreference categoryPreference, int limit) {

        Section categoryArticles = new Section();
        Category category = new Category();
        category.setId(categoryPreference.getId());
        category.setName(categoryPreference.getName());
        categoryArticles.setCategory(category);


        ArticleFactory articleFactory = ArticleFactory.getInstance();
        Set<Long> articlesId = categoryArticlesIds(categoryPreference.getId(), categoryPreference.getPackages(), limit);

        ArrayList<StructuredArticle> articles = articleFactory.getArticles(articlesId);

        for (StructuredArticle strArticle : articles) {

            Article article = new Article();
            article.setTitle(strArticle.getTitle());
            article.setSnippet(buildSnippet(strArticle.getText()));
            article.setImgUrl(strArticle.getImageSrc());
            article.setPublicationDate(strArticle.getPublicationDateGMT());
            article.setUrl(strArticle.getUrl());

            article.setCategory(category);

            Publisher publisher = new Publisher();
            publisher.setId(strArticle.getPublisherId());
            publisher.setName(strArticle.getPublisher());
            article.setPublisher(publisher);

            categoryArticles.getArticles().add(article);
        }
        return categoryArticles;
    }


    private Set<Long> categoryArticlesIds(int categoryId, List<Integer> packages, int limit) {

        HashSet<Long> articleIds = new HashSet<>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        String packagesIds = "";
        for (Integer packageId : packages) {
            packagesIds += packageId + ",";
        }
        packagesIds += "-1";

        try {


            conn = this.dataSource.getConnection();
            conn.setReadOnly(true);

            String sql = "SELECT A.id, T.id, T.version FROM NewscronContent.article AS A \n" +
                    "            JOIN NewscronContent.topic as T ON T.id=A.topicId\n" +
                    "            WHERE A.categoryID=? AND A.packageID in (?) AND A.cloneID is NULL\n" +
                    "            ORDER BY A.publicationDateGMT DESC LIMIT ?;";


            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, categoryId);
            stmt.setString(2, packagesIds);
            stmt.setInt(3, limit * 20);

            rs = stmt.executeQuery();

            HashSet<Long> topicIds = new HashSet<Long>();
            while (rs.next() && limit > 0) {
                if (!topicIds.add(rs.getLong("T.id"))) {
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
