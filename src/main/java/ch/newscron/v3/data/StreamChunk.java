package ch.newscron.v3.data;

import java.util.LinkedList;

/**
 * Created by eliapalme on 16.05.17.
 */
public class StreamChunk {

    private LinkedList<Article> articles = new LinkedList<Article>();
    private long timestamp;
    private long latestId;

    public LinkedList<Article> getArticles() {
        return articles;
    }

    public void setArticles(LinkedList<Article> articles) {
        this.articles = articles;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public long getLatestId() {
        return latestId;
    }

    public void setLatestId(long latestId) {
        this.latestId = latestId;
    }
}
