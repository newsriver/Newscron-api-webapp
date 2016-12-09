package ch.newscron.v3.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

/**
 * Created by eliapalme on 09.12.16.
 */
@Controller
public class HTML5Mode {

    @RequestMapping(value = {"/category/**"})
    public String readability(Map<String, Object> model) {
        return "forward:/";
    }
}




