package ch.newscron.v3.data;

/**
 * Created by eliapalme on 23.11.16.
 */
public class Package {

    private int id;
    private String name;
    private int language;
    private int rootPackage;


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getLanguage() {
        return language;
    }

    public void setLanguage(int language) {
        this.language = language;
    }

    public int getRootPackage() {
        return rootPackage;
    }

    public void setRootPackage(int rootPackage) {
        this.rootPackage = rootPackage;
    }
}
