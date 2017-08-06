package ch.newscron.v3.rest;


import ch.newscron.v3.data.Article;
import ch.newscron.v3.data.Category;
import ch.newscron.v3.data.Publisher;
import ch.newscron.v3.data.Section;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.io.IOException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * Created by eliapalme on 29.05.17.
 */


@RestController
public class Search {

    private static final int HTTP_TIMEOUT_SHORT = 5000;
    private static final int SOKET_TIMEOUT_SHORT = 5000;
    private static final String NEWSRIVER_API_URL = "https://api.newsriver.io/v2/search?sortBy=discoverDate&sortOrder=DESC&limit=25&query=";
    private static final String NEWSRIVER_API_TOKEN = "sBBqsGXiYgF0Db5OV5tAw6DW7BpOpuMs5WCfGSNgf3xsm9_tCBPN-sUd129X9sh5";
    private static final SimpleDateFormat inputDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss.SSSZ");
    private static final Logger log = Logger.getLogger(Search.class);
    private static ObjectMapper mapper = new ObjectMapper();
    @Autowired
    @Qualifier("dataSource")
    private DataSource dataSource;


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/v3/search", method = RequestMethod.GET)
    public ResponseEntity<Section> featured(@RequestParam(value = "search", required = false, defaultValue = "") String search) {

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

        //only articles with a publisher and a category set
        search = search + " AND _exists_:website AND _exists_:metadata.category";

        List<NewsriverArticle> newsriverArticles = new LinkedList<>();
        try (CloseableHttpClient httpClient = HttpClientBuilder.create().setDefaultRequestConfig(defaultRequestConfig).build()) {
            HttpGet httpGetContentLoad = new HttpGet(NEWSRIVER_API_URL + URLEncoder.encode(search, "UTF-8"));
            httpGetContentLoad.addHeader("Authorization", NEWSRIVER_API_TOKEN);

            try (CloseableHttpResponse response = httpClient.execute(httpGetContentLoad)) {
                newsriverArticles = mapper.readValue(response.getEntity().getContent(), new TypeReference<List<NewsriverArticle>>() {
                });
            }
        } catch (IOException e) {
            log.fatal("Unable to identify user location", e);
        }

        for (NewsriverArticle strArticle : newsriverArticles) {

            if (strArticle.getWebsite() == null) continue;
            if (!strArticle.getMetadata().containsKey("category")) continue;

            Article article = new Article();
            article.setTitle(strArticle.getTitle());
            article.setSnippet(strArticle.getHighlight());
            if (strArticle.getElements() != null) {
                for (NewsriverElement element : strArticle.getElements()) {
                    if (element == null || !(element instanceof NewsriverImageElement)) {
                        continue;
                    }
                    if (!((NewsriverImageElement) element).isPrimary()) {
                        continue;
                    }
                    article.setImgUrl(((NewsriverImageElement) element).getUrl());
                    break;
                }
            }


            Category articleCategory = new Category();
            articleCategory.setName(((NewsriverCategoryMetaData) strArticle.getMetadata().get("category")).getCategory());
            article.setCategory(articleCategory);
            article.setUrl(strArticle.getUrl());

            Date publishDate = null;
            try {
                publishDate = inputDateFormat.parse(strArticle.getDiscoverDate());
                article.setPublicationDate(publishDate.getTime());
            } catch (Exception e) {
                log.error("Unable to parse article date", e);
                article.setPublicationDate(new Date().getTime());
            }
            

            //article.setId(strArticle.getArticleID());
            //article.setScore(articlesId.get(article.getId()));
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
        private Map<String, NewsriverMetaData> metadata;
        private List<NewsriverElement> elements;

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

        public Map<String, NewsriverMetaData> getMetadata() {
            return metadata;
        }

        public void setMetadata(Map<String, NewsriverMetaData> metadata) {
            this.metadata = metadata;
        }

        public List<NewsriverElement> getElements() {
            return elements;
        }

        public void setElements(List<NewsriverElement> elements) {
            this.elements = elements;
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

    @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type", defaultImpl = Void.class)
    @JsonSubTypes({
            @JsonSubTypes.Type(value = NewsriverCategoryMetaData.class, name = "category"),
    })
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class NewsriverMetaData {


    }


    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class NewsriverCategoryMetaData extends NewsriverMetaData {

        private String type;
        private String country;
        private String region;
        private String category;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }

        public String getRegion() {
            return region;
        }

        public void setRegion(String region) {
            this.region = region;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }
    }

    @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type", defaultImpl = Void.class)
    @JsonSubTypes({
            @JsonSubTypes.Type(value = NewsriverImageElement.class, name = "Image"),
    })
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class NewsriverElement {


    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class NewsriverImageElement extends NewsriverElement {
        private String type;
        private boolean primary;
        private String url;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public boolean isPrimary() {
            return primary;
        }

        public void setPrimary(boolean primary) {
            this.primary = primary;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }
}

