package ch.newscron.v3.rest;


import ch.newscron.v3.data.Category;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.dbutils.DbUtils;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by eliapalme on 19.11.16.
 */
@RestController
public class Settings {

    private static final Logger log = Logger.getLogger(Settings.class);
    private static ObjectMapper mapper = new ObjectMapper();
    @Autowired
    @Qualifier("dataSource")
    private DataSource dataSource;

    @CrossOrigin(origins = "*")
    @RequestMapping("/v3/categories")
    public List<Category> categories(@RequestParam(value = "countryId", defaultValue = "1") int countryId) {

        List<Category> categories = new LinkedList<>();

        PreparedStatement stmt = null;
        ResultSet rs = null;
        try (Connection conn = this.dataSource.getConnection()) {

            conn.setReadOnly(true);
            String sql = "SELECT * FROM NewscronConfiguration.category where (specificCountryID is NULL OR specificCountryID = ?) AND isActive=1 AND isHidden=0 AND id <> 12";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, countryId);

            rs = stmt.executeQuery();

            while (rs.next()) {
                Category category = new Category();
                category.setId(rs.getInt("id"));
                category.setName(rs.getString("name"));
                category.setDefaultAmount(rs.getInt("defaultAmount"));
                categories.add(category);
            }
        } catch (Exception e) {
            log.log(Level.ERROR, "Error unable to query available categories", e);
        } finally {
            DbUtils.closeQuietly(rs);
            DbUtils.closeQuietly(stmt);
        }

        return categories;

    }


    //Add this option to the marathond-lb "HAPROXY_0_BACKEND_HTTP_OPTIONS":"  option forwardfor\n"

    @CrossOrigin(origins = "*")
    @RequestMapping("/v3/boot")
    public List<Category> bootsrapConfig(HttpServletRequest httpRequest, @RequestParam(value = "countryCode", defaultValue = "us") String countryCode) {


        String requestIp = httpRequest.getHeader("x-forwarded-for");
        if (requestIp == null) {
            requestIp = httpRequest.getRemoteAddr();
        }

        UserLocation location = null;
        try {
            location = mapper.readValue(new URL("http://ip-api.com/json/" + requestIp), UserLocation.class);


        } catch (MalformedURLException e) {
            log.fatal("Unable to identify user location", e);
        } catch (IOException e) {
            log.fatal("Unable to identify user location", e);
        }


        return null;

    }


    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class UserLocation {
        private String status;
        private String country;
        private String countryCode;
        private String region;
        private String regionName;

        public UserLocation() {

        }


        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }

        public String getCountryCode() {
            return countryCode;
        }

        public void setCountryCode(String countryCode) {
            this.countryCode = countryCode;
        }

        public String getRegion() {
            return region;
        }

        public void setRegion(String region) {
            this.region = region;
        }

        public String getRegionName() {
            return regionName;
        }

        public void setRegionName(String regionName) {
            this.regionName = regionName;
        }
    }

}




