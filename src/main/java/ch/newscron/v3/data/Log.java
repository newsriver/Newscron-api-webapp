package ch.newscron.v3.data;


import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.util.List;

/**
 * Created by eliapalme on 29.10.17.
 */
public class Log {

    private List<LogEntry> logs;
    private String uuid;
    private String version;

    public List<LogEntry> getLogs() {
        return logs;
    }

    public void setLogs(List<LogEntry> logs) {
        this.logs = logs;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
    @JsonSubTypes({
            @JsonSubTypes.Type(value = PublisherRelevanceLog.class, name = "pubRelevance"),
    })
    public static abstract class LogEntry {
        private int timestamp;

        public int getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(int timestamp) {
            this.timestamp = timestamp;
        }
    }

    ;


    public static class PublisherRelevanceLog extends LogEntry {
        private int publisherId;
        private int categoryId;
        private int relevance;

        public int getPublisherId() {
            return publisherId;
        }

        public void setPublisherId(int publisherId) {
            this.publisherId = publisherId;
        }

        public int getRelevance() {
            return relevance;
        }

        public void setRelevance(int relevance) {
            this.relevance = relevance;
        }

        public int getCategoryId() {
            return categoryId;
        }

        public void setCategoryId(int categoryId) {
            this.categoryId = categoryId;
        }
    }
}
