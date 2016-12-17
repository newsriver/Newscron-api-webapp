package ch.newscron.v3.data;

import java.util.List;

/**
 * Created by eliapalme on 19.11.16.
 */
public class Category {

    private String name;
    private int id;
    private int amount;
    private List<Integer> packages;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

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
}
