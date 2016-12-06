package ch.newscron.v3.web;

import ch.newscron.data.article.v2.ArticleFactory;
import ch.newscron.extractor.StructuredArticle;
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
    public String article(@PathVariable Long articleId) {

        StructuredArticle article = ArticleFactory.getInstance().getArticle(articleId);

        return "redirect:" + article.getUrl();
    }


}
