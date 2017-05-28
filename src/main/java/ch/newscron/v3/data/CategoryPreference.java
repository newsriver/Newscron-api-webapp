package ch.newscron.v3.data;

import java.util.LinkedList;
import java.util.List;

/**
 * Created by eliapalme on 19.11.16.
 */
public class CategoryPreference extends Category {


    private int amount;
    private List<Integer> packages = new LinkedList<>();
    private List<Publisher> publishersOptOut = new LinkedList<>();


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

    public List<Publisher> getPublishersOptOut() {
        return publishersOptOut;
    }

    public void setPublishersOptOut(List<Publisher> publishersOptOut) {
        this.publishersOptOut = publishersOptOut;
    }
}
