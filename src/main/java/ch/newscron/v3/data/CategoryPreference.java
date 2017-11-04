package ch.newscron.v3.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.apache.commons.collections.map.HashedMap;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * Created by eliapalme on 19.11.16.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class CategoryPreference extends Category {


    private int amount;
    private List<Integer> packages = new LinkedList<>();
    private Map<Integer, Publisher> publishersRelevance = new HashedMap();


    public List<Integer> getPackages() {
        return packages;
    }

    public void setPackages(List<Integer> packages) {
        this.packages = packages;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public Map<Integer, Publisher> getPublishersRelevance() {
        return publishersRelevance;
    }

    public void setPublishersRelevance(Map<Integer, Publisher> publishersRelevance) {
        this.publishersRelevance = publishersRelevance;
    }
}
