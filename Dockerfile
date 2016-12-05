FROM openjdk:8-jre-alpine
COPY Newscron-api-webapp-*.war /home/newscron-api-webapp.war
WORKDIR /home
EXPOSE 31000-32000
ENTRYPOINT ["java","-Duser.timezone=GMT","-Dfile.encoding=utf-8","-Xms512m","-Xmx800m","-Xss1m","-XX:MaxMetaspaceSize=512m","-XX:+UseConcMarkSweepGC","-XX:+CMSParallelRemarkEnabled","-XX:+UseCMSInitiatingOccupancyOnly","-XX:CMSInitiatingOccupancyFraction=70","-XX:OnOutOfMemoryError='kill -9 %p'","-jar","/home/newscron-api-webapp.war"]
