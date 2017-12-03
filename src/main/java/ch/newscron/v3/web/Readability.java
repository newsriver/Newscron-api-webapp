package ch.newscron.v3.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by eliapalme on 30.11.17.
 */


@Controller
public class Readability {

    //To redability view is provided by the Article. The Article view typically redirects the user to the original URL.
    //However if a readbility cookie is set by the Readability request the Article view will display the redability mode.
    //This mechanism is set in place to allow users to share the readability url. In this case the URL will not show the
    //readability mode since the cookie is not present.
    @RequestMapping("/readability/{topicId}/{articleId}")
    public String article(@PathVariable Long topicId, @PathVariable Long articleId, HttpServletResponse response) {
        Cookie cookie = new Cookie("readbility", "" + articleId);
        cookie.setPath("/");
        cookie.setMaxAge(300);
        response.addCookie(cookie);

        return "redirect:" + "/topic/" + topicId + "/article/" + articleId;

    }
}