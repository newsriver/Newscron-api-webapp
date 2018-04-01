package ch.newscron.v3.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ErrorAttributes;
import org.springframework.boot.autoconfigure.web.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Created by eliapalme on 01.04.18.
 */
@Controller
public class AppErrorController implements ErrorController {


    @Autowired
    private ErrorAttributes errorAttributes;


    @RequestMapping("/error")
    @ResponseBody
    public String handleError(HttpServletRequest request) {

        Map<String, Object> attr = getErrorAttributes(request,false);
        return String.format("<html><head>\n" +
                "<title>Newscron - Error</title>\n"+
                "<link rel=\"icon\" type=\"image/x-icon\" href=\"/favicon.ico\">\n"+
                "<style>@import url('https://fonts.googleapis.com/css?family=Montserrat:100,300,400,700|PT+Serif');</style>\n" +
                "</head><body style=\"\n" +
                "    background-color: #252830;\n" +
                "    margin:5rem;\n" +
                "    color:  white;\n" +
                "    font-family: Montserrat, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;\n" +
                "\"><h1 style=\"\n" +
                "    font-weight: 300;\n" +
                "    font-size: 48px;\n" +
                "    margin-bottom: 0px;\n" +
                "\">Error Page</h1>\n" +
                "<hr style=\"\n" +
                "    margin-top: .5rem;\n" +
                "    margin-bottom: 2.5rem;\n" +
                "    border: 0;\n" +
                "    border-top: 1px solid #434857;\n" +
                "\">    \n" +
                "<div>Status code: <b>%s</b></div><div>Error Message: <b>%s</b></div>\n" +
                "\n" +
                "<a tabindex=\"-1\" href=\"/\" style=\"\n" +
                "    border-radius: .25rem;\n" +
                "    padding: .5rem 1rem;\n" +
                "    position: relative;\n" +
                "    display: block;\n" +
                "    color: #252830!important;\n" +
                "    background-color: #1ca8dd!important;\n" +
                "    text-decoration: none;\n" +
                "    font-weight: 300;\n" +
                "    max-width: 200px;\n" +
                "    margin: auto;\n" +
                "    margin-top: 3rem;\n" +
                "    text-align:  center;\n" +
                "\">Back to Newscron</a>\n" +
                "\n" +
                "</body></html>", attr.get("status"),attr.get("message"));



    }

    @Override
    public String getErrorPath() {
        return "/error";
    }

    private Map<String, Object> getErrorAttributes(HttpServletRequest request, boolean includeStackTrace) {
        RequestAttributes requestAttributes = new ServletRequestAttributes(request);
        return errorAttributes.getErrorAttributes(requestAttributes, includeStackTrace);
    }
}
