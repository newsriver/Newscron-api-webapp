package ch.newscron.v3.web;

import ch.newscron.data.article.v2.ArticleFactory;
import ch.newscron.data.article.v2.ArticleFactoryIFace;
import ch.newscron.extractor.StructuredArticle;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by eliapalme on 06.12.16.
 */

@Controller
public class Article {


    @RequestMapping(value = "/topic/{topicId}/article/{articleId}", method = RequestMethod.GET)
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
    }


}
