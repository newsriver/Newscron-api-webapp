package ch.newscron.v3.data;

/**
 * Created by eliapalme on 19.11.16.
 */
public class Category {

    private String name;
    private int id;
    private int defaultAmount;


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

    public int getDefaultAmount() {
        return defaultAmount;
    }

    public void setDefaultAmount(int defaultAmount) {
        this.defaultAmount = defaultAmount;
    }
}
