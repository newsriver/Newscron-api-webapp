package ch.newscron.v3.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

/**
 * Created by eliapalme on 09.12.16.
 */
@Controller
public class HTML5Mode {

    @RequestMapping(value = {"/news/category/**"})
    public String readabilityCategory(Map<String, Object> model) {
        return "forward:/";
    }

    @RequestMapping(value = {"/news/search/**"})
    public String readabilityCategory(Map<String, Object> model) {
        return "forward:/";
    }

    @RequestMapping(value = {"/news/digest"})
    public String readabilityStream(Map<String, Object> model) {
        return "forward:/";
    }

    @RequestMapping(value = {"/welcome/**"})
    public String readabilityWelcome(Map<String, Object> model) {
        return "forward:/";
    }

    @RequestMapping(value = {"/config/**"})
    public String readabilityConfig(Map<String, Object> model) {
        return "forward:/";
    }

}
