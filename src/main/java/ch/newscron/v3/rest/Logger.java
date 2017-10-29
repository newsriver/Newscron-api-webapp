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
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Timestamp;

/**
 * Created by eliapalme on 29.10.17.
 */

@RestController
public class Logger {


    private static final org.apache.log4j.Logger logger = org.apache.log4j.Logger.getLogger(Logger.class);
    private static ObjectMapper mapper = new ObjectMapper();
    @Autowired
    @Qualifier("dataSource")
    private DataSource dataSource;


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/v3/log", method = RequestMethod.POST)
    public void log(HttpServletRequest httpRequest, @RequestBody Log log) {
        for (Log.LogEntry entry : log.getLogs()) {
            if (entry instanceof Log.PublisherRelevanceLog) {
                logPublisherRelevance((Log.PublisherRelevanceLog) entry, log.getUuid());
            }
        }
    }

    private void logPublisherRelevance(Log.PublisherRelevanceLog log, String UDID) {

        final String sql = "REPLACE INTO NewscronConfiguration.publisherRelevance (publisherId, categoryId, relevance, UDID, timestamp) VALUES (?,?,?,?,?)";

        try (Connection conn = this.dataSource.getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            conn.setReadOnly(false);

            stmt.setInt(1, log.getPublisherId());
            stmt.setInt(2, log.getCategoryId());
            stmt.setInt(3, log.getRelevance());
            stmt.setString(4, UDID);
            stmt.setTimestamp(5, new Timestamp(log.getTimestamp()));

            stmt.executeUpdate();

        } catch (Exception e) {
            logger.error("Error unable to save publisher relevance", e);
        }
    }

}