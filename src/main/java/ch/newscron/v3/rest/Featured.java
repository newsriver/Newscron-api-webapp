package ch.newscron.v3.rest;


import ch.newscron.data.article.v2.ArticleFactory;
import ch.newscron.extractor.StructuredArticle;
import ch.newscron.v3.data.Article;
import ch.newscron.v3.data.Category;
import ch.newscron.v3.data.Section;
import org.apache.commons.dbutils.DbUtils;
import org.apache.commons.lang3.StringUtils;
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
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

/**
 * Created by eliapalme on 13.11.16.
 */


@RestController
public class Featured {

    private static final Logger log = Logger.getLogger(Featured.class);


    @Autowired
    @Qualifier("dataSource")
    private DataSource dataSource;


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/v3/featured", method = RequestMethod.POST)
    public List<Section> featured(@RequestBody List<Category> categories) {

        List<Section> sections = new LinkedList<>();


        for (Category category : categories) {

            Section section = featuredCategory(category, 10);
            section.setCategory(category);
            sections.add(section);
        }


        return sections;
    }


    private Section featuredCategory(Category category, int limit) {

        Section categoryArticles = new Section();
        ArticleFactory articleFactory = ArticleFactory.getInstance();
        Set<Long> articlesId = featuredArticlesIdsPerCategory(category.getId(), category.getPackages(), limit);

        ArrayList<StructuredArticle> articles = articleFactory.getArticles(articlesId);

        for (StructuredArticle strArticle : articles) {

            Article article = new Article();
            article.setTitle(strArticle.getTitle());
            article.setSnippet(buildSnippet(strArticle.getText()));
            article.setImgUrl(strArticle.getImageSrc());
            article.setPublicationDate(strArticle.getPublicationDateGMT());
            article.setUrl(strArticle.getUrl());
            article.setPublisher(strArticle.getPublisher());

            categoryArticles.getArticles().add(article);
        }
        return categoryArticles;
    }


    private Set<Long> featuredArticlesIdsPerCategory(int categoryId, List<Integer> packages, int limit) {

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

            /*String sql = "SELECT A.id, T.id, T.version FROM NewscronContent.articleFeature AS F " +
                    "JOIN NewscronContent.article AS A ON A.id=F.id " +
                    "JOIN NewscronContent.topic as T ON T.id=A.topicId " +
                    "WHERE F.categoryID=? AND F.packageID in (?)  " +
                    "AND cloneOf is NULL " +
                    "AND F.publicationDate > DATE_SUB(now(), Interval 16 Hour) " +
                    "ORDER BY F.rank DESC LIMIT ?;";*/


            String sql = "SELECT A.id, T.id, T.version,S.finalScore FROM NewscronContent.articleScore AS S\n" +
                    "            JOIN NewscronContent.article AS A ON A.id=S.articleId\n" +
                    "            JOIN NewscronContent.topic as T ON T.id=A.topicId\n" +
                    "            WHERE A.categoryID=? AND A.packageID in (?) AND A.cloneID is NULL\n" +
                    "            AND A.publicationDateGMT > DATE_SUB(now(), Interval 16 Hour)\n" +
                    "            ORDER BY S.finalScore DESC LIMIT ?;";


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
        String snippet = text.substring(0, 240 > text.length() ? text.length() : 240);
        int index = snippet.lastIndexOf(" ");
        if (index > 240 / 2) {
            snippet = StringUtils.strip(snippet.substring(0, index), ",.:;!?-_/()\\[]\"' \n\r\t") + "...";
        }
        return snippet;
    }

}




