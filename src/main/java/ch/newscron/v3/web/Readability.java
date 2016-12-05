package ch.newscron.v3.web;

/**
 * Created by eliapalme on 05.12.16.
 */

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.tuckey.web.filters.urlrewrite.UrlRewriteFilter;

import java.util.Map;

@Controller
public class Readability {

    @Bean
    public FilterRegistrationBean tuckeyRegistrationBean() {
        final FilterRegistrationBean registrationBean = new FilterRegistrationBean();

        registrationBean.setFilter(new UrlRewriteFilter());
        registrationBean.addInitParameter("confPath", "ch/newscron/v3/readability/urlrewrite.xml");

        return registrationBean;
    }


    @RequestMapping(value = {"/Readability/**"})
    public String readability(Map<String, Object> model) {

        return "readability";
    }


}