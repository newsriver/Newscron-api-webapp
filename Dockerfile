FROM openjdk:8-jre-alpine
COPY newscron-api-webapp-*.war /home/newscron-api-webapp.war
COPY newrelic.jar /home/newrelic.jar
COPY newrelic.yml /home/newrelic.yml
WORKDIR /home
EXPOSE 31000-32000
ENTRYPOINT ["java","-Duser.timezone=GMT","-Dfile.encoding=utf-8","-Xms512m","-Xmx800m","-Xss1m","-XX:MaxMetaspaceSize=512m","-XX:+UseConcMarkSweepGC","-XX:+CMSParallelRemarkEnabled","-XX:+UseCMSInitiatingOccupancyOnly","-XX:CMSInitiatingOccupancyFraction=70","-XX:OnOutOfMemoryError='kill -9 %p'","-javaagent:newrelic.jar","-jar","/home/newscron-api-webapp.war"]
