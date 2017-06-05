package ch.newscron.v3.rest;


import ch.newscron.data.article.v2.ArticleFactory;
import ch.newscron.extractor.StructuredArticle;
import ch.newscron.v3.data.Article;
import ch.newscron.v3.data.Category;
import ch.newscron.v3.data.CategoryPreference;
import ch.newscron.v3.data.Digest;
import ch.newscron.v3.data.Publisher;
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
 * Created by eliapalme on 29.05.17.
 */


@RestController
public class Search {

    private static final Logger log = Logger.getLogger(Search.class);


    @Autowired
    @Qualifier("dataSource")
    private DataSource dataSource;


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/v3/search", method = RequestMethod.POST)
    public ResponseEntity<Section> featured(@RequestBody List<CategoryPreference> categories, @RequestParam(value = "search", required = false, defaultValue = "") String searchPhrase) {

        Section section = new Section();

        int articles = 0;
        for (CategoryPreference category : categories) {
            Section section = featuredCategory(category, timestamp);
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
            return new ResponseEntity<section>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<section>(digest, HttpStatus.OK);

    }


    private Section search(CategoryPreference categoryPreference, String searchPhrase) {

        Section categoryArticles = new Section();

        Category category = new Category();
        category.setId(categoryPreference.getId());
        category.setName(categoryPreference.getName());

        categoryArticles.setCategory(category);

        ArticleFactory articleFactory = ArticleFactory.getInstance();
        HashMap<Long, Long> articlesId = featuredArticlesIdsPerCategory(categoryPreference, timestamp);

        ArrayList<StructuredArticle> articles = articleFactory.getArticles(articlesId.keySet());

        for (StructuredArticle strArticle : articles) {

            Article article = new Article();
            article.setTitle(strArticle.getTitle());
            article.setSnippet(buildSnippet(strArticle.getText()));
            article.setImgUrl(strArticle.getImageSrc());
            article.setPublicationDate(strArticle.getPublicationDateGMT());
            article.setUrl(strArticle.getUrl());
            article.setId(strArticle.getArticleID());
            article.setScore(articlesId.get(article.getId()));
            article.setCategory(category);

            Publisher publisher = new Publisher();
            publisher.setId(strArticle.getPublisherId());
            publisher.setName(strArticle.getPublisher());
            article.setPublisher(publisher);

            categoryArticles.getArticles().add(article);

        }
        return categoryArticles;
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

