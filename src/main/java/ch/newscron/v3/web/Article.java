package ch.newscron.v3.web;

import ch.newscron.data.article.v2.ArticleFactory;
import ch.newscron.data.article.v2.ArticleFactoryIFace;
import ch.newscron.extractor.StructuredArticle;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.ModelAndView;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by eliapalme on 06.12.16.
 */

@Controller
public class Article {

    final DateFormat dateFormatDate = new SimpleDateFormat("dd MMMM ' | ' HH:mm a");

    @RequestMapping(value = "/topic/{topicId}/article/{articleId}", method = RequestMethod.GET)
    public ModelAndView article(ModelMap model, @PathVariable Long articleId, @CookieValue(value = "readbility", required = false) Long readbility) {

        ArticleFactory articleFactory = ArticleFactory.getInstance();
        StructuredArticle article = articleFactory.getArticle(articleId);

        if (article == null) {
            ArticleFactoryIFace.LongTermArticlesURLs articleURL = articleFactory.getLongtermArticleURL(articleId);
            if (articleURL != null) {
                //return ResponseEntity.status(HttpStatus.FOUND).header("Location", articleURL.url).body(null);
                model.addAttribute("attribute", "redirectWithRedirectPrefix");
                return new ModelAndView("redirect:" + articleURL, model);
            } else {
                //if the URL is not present in the LongTermArticleURL table, this Newscron URL is gone.
                //return ResponseEntity.status(HttpStatus.GONE).body(null);
                throw new HttpClientErrorException(HttpStatus.GONE);
            }
        } else if (readbility != null && readbility.equals(articleId)) {
            return readability(article, model);
        }
        model.addAttribute("attribute", "redirectWithRedirectPrefix");
        return new ModelAndView("redirect:" + article.getUrl(), model);
        //return ResponseEntity.status(HttpStatus.FOUND).header("Location", article.getUrl()).body(null);


    }

    /*    @RequestMapping(value = "/topic/{topicId}/article/{articleId}", method = RequestMethod.GET)
    public ResponseEntity<String> article(@PathVariable Long articleId) {

        ArticleFactory articleFactory = ArticleFactory.getInstance();
        StructuredArticle article = articleFactory.getArticle(articleId);

        if (article == null) {
            ArticleFactoryIFace.LongTermArticlesURLs articleURL = articleFactory.getLongtermArticleURL(articleId);
            if (articleURL != null) {
                return ResponseEntity.status(HttpStatus.FOUND).header("Location", articleURL.url).body(null);
            } else {
                //if the URL is not present in the LongTermArticleURL table, this Newscron URL is gone.
                return ResponseEntity.status(HttpStatus.GONE).body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.FOUND).header("Location", article.getUrl()).body(null);
        }


    }*/


    private ModelAndView readability(StructuredArticle article, ModelMap model) {
        String url = "";

        int imageHO = 0;
        int imageWO = 0;
        boolean hasImage = false;
        String text = null;
        if (article != null) {
            url = article.getUrl();
            text = article.getHtml();
            if (text == null || text.isEmpty()) {
                article = null;
            } else {
                if (article.getImageID() > 0 && article.getImageWidth() >= 320) {
                    imageWO = article.getImageWidth();
                    imageHO = article.getImageHeight();
                    hasImage = true;
                }
            }
        }

        model.addAttribute("url", url);
        model.addAttribute("title", article.getTitle());
        model.addAttribute("text", text);
        model.addAttribute("id", article.getArticleID());
        model.addAttribute("imageWO", imageWO);
        model.addAttribute("imageHO", imageHO);
        model.addAttribute("hasImage", hasImage);
        model.addAttribute("publicationDate", dateFormatDate.format(new Date(article.getPublicationDateGMT())));
        model.addAttribute("publisher", article.getPublisher());


        return new ModelAndView("readability", model);
    }

}
