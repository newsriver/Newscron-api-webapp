package ch.newscron.v3.rest;

import ch.newscron.v3.data.Log;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;

/**
 * Created by eliapalme on 29.10.17.
 */

@RestController
public class Logger {


    private static final org.apache.log4j.Logger log = org.apache.log4j.Logger.getLogger(Logger.class);
    private static ObjectMapper mapper = new ObjectMapper();
    @Autowired
    @Qualifier("dataSource")
    private DataSource dataSource;


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/v3/log", method = RequestMethod.POST)
    public void log(HttpServletRequest httpRequest, @RequestBody Log log) {

        System.out.println();
    }
}