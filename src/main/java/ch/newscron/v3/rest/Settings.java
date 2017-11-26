package ch.newscron.v3.rest;


import ch.newscron.v3.data.BootstrapConfiguration;
import ch.newscron.v3.data.CategoryPreference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.dbutils.DbUtils;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by eliapalme on 19.11.16.
 */
@RestController
public class Settings {


    private static final int HTTP_TIMEOUT_SHORT = 500;
    private static final int SOKET_TIMEOUT_SHORT = 500;

    private static final Logger log = Logger.getLogger(Settings.class);
    private static ObjectMapper mapper = new ObjectMapper();
    @Autowired
    @Qualifier("dataSource")
    private DataSource dataSource;

    /*@CrossOrigin(origins = "*")
    @RequestMapping(value = "/v3/categories", method = RequestMethod.POST)
    public List<CategoryArticles> categories(@RequestBody List<Integer> packagesIds) {

        return getCategories(packagesIds);

    }*/


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/v3/boot", method = RequestMethod.POST)
    public BootstrapConfiguration bootsrapConfig(HttpServletRequest httpRequest, @RequestBody(required = false) List<Integer> packagesIds) {


        BootstrapConfiguration configuration = new BootstrapConfiguration();


        if (packagesIds == null) {
            UserLocation location = null;

            String requestIp = httpRequest.getHeader("x-forwarded-for");
            if (requestIp == null) {
                requestIp = httpRequest.getRemoteAddr();
            }
            location = ipLocation(requestIp);
            if (location != null) {
                Integer countryId = fittingCountryId(location.countryCode);
                packagesIds = fittingPackagesId(countryId);
            }
        }

        //Add use packages if location was not established
        if (packagesIds == null || packagesIds.size() == 0) {
            packagesIds = new LinkedList<>(Arrays.asList(42, 43, 44, 45, 46, 47, 48));
        }


        configuration.setPackagesIds(packagesIds);
        configuration.setLocalPackagesIds(fittingSubPackagesId(configuration.getPackagesIds()));

        List<Integer> categoryPackages = new LinkedList<>();
        categoryPackages.addAll(configuration.getPackagesIds());
        categoryPackages.addAll(configuration.getLocalPackagesIds());

        configuration.setSearchLanguage(searchLanguage(packagesIds));

        List<CategoryPreference> categories = getCategories(categoryPackages);
        for (CategoryPreference category : categories) {
            category.setPackages(categoryPackages);
        }
        configuration.setCategories(categories);
        return configuration;
    }


    private UserLocation ipLocation(String requestIp) {


        RequestConfig defaultRequestConfig = RequestConfig.custom()
                .setExpectContinueEnabled(true)
                .setConnectTimeout(HTTP_TIMEOUT_SHORT)
                .setSocketTimeout(new Integer(SOKET_TIMEOUT_SHORT))
                .setMaxRedirects(10)
                .build();
        UserLocation location = null;

        try (CloseableHttpClient httpClient = HttpClientBuilder.create().setDefaultRequestConfig(defaultRequestConfig).build()) {
            HttpGet httpGetContentLoad = new HttpGet("http://ip-api.com/json/" + requestIp);
            try (CloseableHttpResponse response = httpClient.execute(httpGetContentLoad)) {
                location = mapper.readValue(response.getEntity().getContent(), UserLocation.class);
            }
        } catch (IOException e) {
            log.fatal("Unable to identify user location", e);
        }

        return location;
    }

    private List<Integer> fittingPackagesId(int countryId) {

        List<Integer> packages = new LinkedList<>();
        ResultSet rs = null;
        try (Connection conn = this.dataSource.getConnection()) {

            conn.setReadOnly(true);
            try (PreparedStatement stmt = conn.prepareStatement("SELECT * FROM NewscronConfiguration.package WHERE countryID=? AND rootPackage is NULL")) {

                stmt.setInt(1, countryId);

                rs = stmt.executeQuery();

                while (rs.next()) {
                    packages.add(rs.getInt("id"));
                }
            }
        } catch (Exception e) {
            log.log(Level.ERROR, "Error unable find country id", e);
        } finally {
            DbUtils.closeQuietly(rs);
        }
        return packages;
    }

    private List<Integer> fittingSubPackagesId(List<Integer> packagesIds) {

        String packagesIdsStr = "";
        for (Integer packageId : packagesIds) {
            packagesIdsStr += packageId + ",";
        }
        packagesIdsStr += "-1";

        List<Integer> packages = new LinkedList<>();
        ResultSet rs = null;
        try (Connection conn = this.dataSource.getConnection()) {

            conn.setReadOnly(true);
            try (PreparedStatement stmt = conn.prepareStatement("SELECT * FROM NewscronConfiguration.package WHERE rootPackage in (" + packagesIdsStr + ")")) {
                rs = stmt.executeQuery();
                while (rs.next()) {
                    packages.add(rs.getInt("id"));
                }
            }
        } catch (Exception e) {
            log.log(Level.ERROR, "Error unable find country id", e);
        } finally {
            DbUtils.closeQuietly(rs);
        }
        return packages;
    }

    private int fittingCountryId(String countryCode) {
        ResultSet rs = null;
        try (Connection conn = this.dataSource.getConnection()) {
            conn.setReadOnly(true);
            try (PreparedStatement stmt = conn.prepareStatement("SELECT * FROM NewscronConfiguration.country where ISOCode like ?")) {
                if (countryCode != null) {
                    stmt.setString(1, countryCode.toUpperCase());
                } else {
                    stmt.setString(1, "Unknown");
                }
                rs = stmt.executeQuery();
                if (rs.next()) {
                    return rs.getInt("id");
                }
            }
        } catch (Exception e) {
            log.log(Level.ERROR, "Error unable find country id", e);
        } finally {
            DbUtils.closeQuietly(rs);
        }
        //as defatuld return us country id
        return 33;
    }

    protected List<CategoryPreference> getCategories(List<Integer> packages) {

        List<CategoryPreference> categories = new LinkedList<>();

        String packagesIds = "";
        for (Integer packageId : packages) {
            packagesIds += packageId + ",";
        }
        packagesIds += "-1";


        PreparedStatement stmt = null;
        ResultSet rs = null;
        try (Connection conn = this.dataSource.getConnection()) {

            conn.setReadOnly(true);
            String sql = "SELECT * FROM NewscronConfiguration.category where (specificCountryID is NULL OR specificCountryID in (SELECT distinct countryId FROM NewscronConfiguration.package WHERE id in (" + packagesIds + "))) AND isActive=1 AND isHidden=0 AND id <> 12";
            stmt = conn.prepareStatement(sql);

            rs = stmt.executeQuery();

            while (rs.next()) {
                CategoryPreference category = new CategoryPreference();
                category.setId(rs.getInt("id"));
                category.setName(rs.getString("name"));
                category.setAmount(3 * Math.round((rs.getFloat("defaultAmount") * 1.5f) / 3f));  //multiple of 3
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

    protected String searchLanguage(List<Integer> packages) {


        String packagesIds = "";
        for (Integer packageId : packages) {
            packagesIds += packageId + ",";
        }
        packagesIds += "-1";


        PreparedStatement stmt = null;
        ResultSet rs = null;
        try (Connection conn = this.dataSource.getConnection()) {

            conn.setReadOnly(true);
            String sql = "SELECT distinct L.name FROM NewscronConfiguration.package as P JOIN NewscronConfiguration.language AS L ON L.id=P.defaultLanguage where P.id in (" + packagesIds + ") limit 1";
            stmt = conn.prepareStatement(sql);

            rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getString("L.name").toUpperCase();
            }
        } catch (Exception e) {
            log.log(Level.ERROR, "Error unable to query suggested language", e);
        } finally {
            DbUtils.closeQuietly(rs);
            DbUtils.closeQuietly(stmt);
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
