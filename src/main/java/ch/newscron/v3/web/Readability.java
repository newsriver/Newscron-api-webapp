package ch.newscron.v3.web;

import ch.newscron.data.article.v2.ArticleFactory;
import ch.newscron.extractor.StructuredArticle;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by eliapalme on 30.11.17.
 */


@Controller
public class Readability {

    private static final Logger log = Logger.getLogger(Readability.class);
    final DateFormat dateFormatDate = new SimpleDateFormat("dd MMMM ' | ' HH:mm a");


    @RequestMapping("/readability/{topicId}/{articleId}")
    public String readability(Model model, @PathVariable Long topicId, @PathVariable Long articleId) {

        String url = "";
        StructuredArticle article = ArticleFactory.getInstance().getArticle(articleId);

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


        return "readability";
    }
}