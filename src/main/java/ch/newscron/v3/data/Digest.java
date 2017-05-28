package ch.newscron.v3.data;

import java.util.LinkedList;
import java.util.List;

/**
 * Created by eliapalme on 16.05.17.
 */
public class Digest {

    private List<Section> sections = new LinkedList<>();
    private long timestamp;


    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }


    public List<Section> getSections() {
        return sections;
    }

    public void setSections(List<Section> sections) {
        this.sections = sections;
    }
}
