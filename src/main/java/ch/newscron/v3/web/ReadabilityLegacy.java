package ch.newscron.v3.web;

/**
 * Created by eliapalme on 05.12.16.
 */

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@Controller
public class ReadabilityLegacy {


    @RequestMapping(value = {"/Readability/**"})
    public String readability(Map<String, Object> model) {

        return "readability-legacy";
    }


}