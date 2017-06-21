package ch.newscron.v3.rest;


import ch.newscron.data.article.v2.ArticleFactory;
import ch.newscron.extractor.StructuredArticle;
import ch.newscron.v3.data.Article;
import ch.newscron.v3.data.Category;
import ch.newscron.v3.data.CategoryPreference;
import ch.newscron.v3.data.Digest;
import ch.newscron.v3.data.Publisher;
import ch.newscron.v3.data.Section;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.dbutils.DbUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
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
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
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

    private static final int HTTP_TIMEOUT_SHORT = 5000;
    private static final int SOKET_TIMEOUT_SHORT = 5000;
    private static final String NEWSRIVER_API_URL = "https://api.newsriver.io/v2/search?sortBy=discoverDate&sortOrder=DESC&limit=15&query=";
    private static final String NEWSRIVER_API_TOKEN = "sBBqsGXiYgF0Db5OV5tAw6DW7BpOpuMs5WCfGSNgf3xsm9_tCBPN-sUd129X9sh5";
    private static ObjectMapper mapper = new ObjectMapper();
    private static final Logger log = Logger.getLogger(Search.class);


    @Autowired
    @Qualifier("dataSource")
    private DataSource dataSource;


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/v3/search", method = RequestMethod.POST)
    public ResponseEntity<Section> featured(@RequestBody List<CategoryPreference> categories, @RequestParam(value = "search", required = false, defaultValue = "") String search) {

        Section section = search(search);

        //empty response
        if (section.getArticles().isEmpty()) {
            return new ResponseEntity<Section>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<Section>(section, HttpStatus.OK);

    }


    private Section search(String search) {

        Section searchArticles = new Section();


        RequestConfig defaultRequestConfig = RequestConfig.custom()
                .setExpectContinueEnabled(true)
                .setConnectTimeout(HTTP_TIMEOUT_SHORT)
                .setSocketTimeout(new Integer(SOKET_TIMEOUT_SHORT))
                .setMaxRedirects(3)
                .build();

        List<NewsriverArticle> newsriverArticles = new LinkedList<>();
        try (CloseableHttpClient httpClient = HttpClientBuilder.create().setDefaultRequestConfig(defaultRequestConfig).build()) {
            HttpGet httpGetContentLoad = new HttpGet(NEWSRIVER_API_URL + search);
            httpGetContentLoad.addHeader("Authorization",NEWSRIVER_API_TOKEN);

            try (CloseableHttpResponse response = httpClient.execute(httpGetContentLoad)) {
                newsriverArticles = mapper.readValue(response.getEntity().getContent(), new TypeReference<List<NewsriverArticle>>() { });
            }
        } catch (IOException e) {
            log.fatal("Unable to identify user location", e);
        }

        for (NewsriverArticle strArticle : newsriverArticles) {

            Article article = new Article();
            article.setTitle(strArticle.getTitle());
            article.setSnippet(strArticle.getHighlight());
            //article.setImgUrl(strArticle.getImageSrc());
            //article.setPublicationDate(strArticle.getPublicationDateGMT());
            article.setUrl(strArticle.getUrl());
            //article.setId(strArticle.getArticleID());
            //article.setScore(articlesId.get(article.getId()));
            //article.setCategory(category);

            Publisher publisher = new Publisher();
            //publisher.setId(strArticle.getPublisherId());
            publisher.setName(strArticle.getWebsite().getName());
            article.setPublisher(publisher);

            searchArticles.getArticles().add(article);

        }


        return searchArticles;
    }




    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class NewsriverArticle {
        private String publishDate;
        private String discoverDate;
        private String title;
        private String language;
        private String url;
        private String highlight;
        private NewsriverWebsite website;

        public String getPublishDate() {
            return publishDate;
        }

        public void setPublishDate(String publishDate) {
            this.publishDate = publishDate;
        }

        public String getDiscoverDate() {
            return discoverDate;
        }

        public void setDiscoverDate(String discoverDate) {
            this.discoverDate = discoverDate;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getLanguage() {
            return language;
        }

        public void setLanguage(String language) {
            this.language = language;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getHighlight() {
            return highlight;
        }

        public void setHighlight(String highlight) {
            this.highlight = highlight;
        }

        public NewsriverWebsite getWebsite() {
            return website;
        }

        public void setWebsite(NewsriverWebsite website) {
            this.website = website;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class NewsriverWebsite {
        private String name;
        private String iconURL;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getIconURL() {
            return iconURL;
        }

        public void setIconURL(String iconURL) {
            this.iconURL = iconURL;
        }
    }


}

