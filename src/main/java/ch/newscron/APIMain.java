package ch.newscron;

import ch.newscron.dao.DbConnectionFactory;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.actuate.metrics.buffer.BufferMetricReader;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.tuckey.web.filters.urlrewrite.UrlRewriteFilter;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

@SpringBootApplication
public class APIMain {
    private static final Logger logger = Logger.getLogger(APIMain.class);


    public static void main(String[] args) {

        SpringApplication app = new SpringApplication(APIMain.class);
        app.run(args);

    }


    @Bean
    public FilterRegistrationBean tuckeyRegistrationBean() {
        final FilterRegistrationBean registrationBean = new FilterRegistrationBean();

        registrationBean.setFilter(new UrlRewriteFilter());
        registrationBean.addInitParameter("confPath", "/WEB-INF/classes/urlrewrite.xml");

        return registrationBean;
    }

}

@Component(value = "apiHealth")
class APIHealth implements HealthIndicator {

    private BufferMetricReader metrics;

    @Autowired
    public APIHealth(BufferMetricReader metrics) {
        this.metrics = metrics;
    }

    @Override
    public Health health() {
        return Health.up().build();
    }
}

@Configuration
class DBDataSource {


    @Bean(name = "dataSource", destroyMethod = "close")
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource dataSource() {
        return DataSourceBuilder.create().build();
    }

    @PostConstruct
    public void legacyDataSources() throws Exception {
        //Setting internal datasources -- legacy old newscron
        DbConnectionFactory.overrideJNIContentDataSource(this.dataSource());
        DbConnectionFactory.overrideJNIConfigDataSource(this.dataSource());
        DbConnectionFactory.overrideJNIComunicationDataSource(this.dataSource());
        DbConnectionFactory.overrideJNIUserDataSource(this.dataSource());
    }


}
