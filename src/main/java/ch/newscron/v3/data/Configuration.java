package ch.newscron.v3.data;

import java.util.List;

/**
 * Created by eliapalme on 23.11.16.
 */
public class Configuration {

    private int countryId;
    private List<Package> packages;
    private List<Category> categories;

    public int getCountryId() {
        return countryId;
    }

    public void setCountryId(int countryId) {
        this.countryId = countryId;
    }

    public List<Package> getPackages() {
        return packages;
    }

    public void setPackages(List<Package> packages) {
        this.packages = packages;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }
}
