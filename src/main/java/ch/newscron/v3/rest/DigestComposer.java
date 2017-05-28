package ch.newscron.v3.rest;


import ch.newscron.data.article.v2.ArticleFactory;
import ch.newscron.extractor.StructuredArticle;
import ch.newscron.v3.data.Article;
import ch.newscron.v3.data.Category;
import ch.newscron.v3.data.Digest;
import ch.newscron.v3.data.Section;
import org.apache.commons.dbutils.DbUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by eliapalme on 13.11.16.
 */


@RestController
public class DigestComposer {

    private static final Logger log = Logger.getLogger(DigestComposer.class);


    @Autowired
    @Qualifier("dataSource")
    private DataSource dataSource;


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/v3/digest", method = RequestMethod.POST)
    public ResponseEntity<ch.newscron.v3.data.Digest> featured(@RequestBody List<Category> categories, @RequestParam(value = "after", required = false, defaultValue = "0") long timestamp) {

        Digest digest = new Digest();
        digest.setTimestamp(System.currentTimeMillis());
        List<Section> sections = new LinkedList<>();
        int articles = 0;
        for (Category category : categories) {
            Section section = featuredCategory(category, category.getAmount(), timestamp);
            Collections.sort(section.getArticles(), new Comparator<Article>() {
                @Override
                public int compare(Article o1, Article o2) {
                    return o2.getScore().compareTo(o1.getScore());
                }
            });

            sections.add(section);
            articles += section.getArticles().size();
        }
        digest.setSections(sections);

        //empty response
        if (articles == 0) {
            return new ResponseEntity<ch.newscron.v3.data.Digest>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<ch.newscron.v3.data.Digest>(digest, HttpStatus.OK);

    }


    private Section featuredCategory(Category category, int limit, long timestamp) {

        Section categoryArticles = new Section();
        categoryArticles.setCategory(category);
        ArticleFactory articleFactory = ArticleFactory.getInstance();
        HashMap<Long, Long> articlesId = featuredArticlesIdsPerCategory(category.getId(), category.getPackages(), limit, timestamp);

        ArrayList<StructuredArticle> articles = articleFactory.getArticles(articlesId.keySet());

        for (StructuredArticle strArticle : articles) {

            Article article = new Article();
            article.setTitle(strArticle.getTitle());
            article.setSnippet(buildSnippet(strArticle.getText()));
            article.setImgUrl(strArticle.getImageSrc());
            article.setPublicationDate(strArticle.getPublicationDateGMT());
            article.setUrl(strArticle.getUrl());
            article.setPublisher(strArticle.getPublisher());
            article.setId(strArticle.getArticleID());
            article.setScore(articlesId.get(article.getId()));
            article.setCategory(category.getName());
            categoryArticles.getArticles().add(article);
        }
        return categoryArticles;
    }


    private HashMap<Long, Long> featuredArticlesIdsPerCategory(int categoryId, List<Integer> packages, int limit, long timestamp) {

        HashMap<Long, Long> articleIds = new HashMap<>();
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

            String sql = "SELECT A.id,A.topicId,F.rank as rank FROM NewscronContent.articleFeature AS F " +
                    "JOIN NewscronContent.article AS A ON A.id=F.id " +
                    /*"JOIN NewscronContent.topic as T ON T.id=A.topicId " + not needed */
                    "WHERE F.categoryID=? AND F.packageID in (?)  " +
                    "AND F.cloneOf is NULL " +
                    "AND F.publicationDate > ? " +
                    "AND F.publicationDate > DATE_SUB(now(), Interval 24 Hour) " +
                    "ORDER BY F.rank DESC LIMIT ?;";


            /*
            OLD RANKING
            String sql = "SELECT A.id, T.id, T.version,S.finalScore as rank FROM NewscronContent.articleScore AS S\n" +
                    "            JOIN NewscronContent.article AS A ON A.id=S.articleId\n" +
                    "            JOIN NewscronContent.topic as T ON T.id=A.topicId\n" +
                    "            WHERE A.categoryID=? AND A.packageID in (?) AND A.cloneID is NULL\n" +
                    "            AND A.publicationDateGMT >?\n" +
                    "            AND A.publicationDateGMT > DATE_SUB(now(), Interval 24 Hour)\n" +
                    "            ORDER BY S.finalScore DESC LIMIT ?;";*/


            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, categoryId);
            stmt.setString(2, packagesIds);
            stmt.setTimestamp(3, new Timestamp(timestamp));
            stmt.setInt(4, limit * 20);

            rs = stmt.executeQuery();

            HashSet<Long> topicIds = new HashSet<Long>();
            while (rs.next() && limit > 0) {
                if (!topicIds.add(rs.getLong("A.topicId"))) {
                    continue;
                }
                if (articleIds.putIfAbsent(rs.getLong("A.id"), rs.getLong("rank")) == null) {
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




