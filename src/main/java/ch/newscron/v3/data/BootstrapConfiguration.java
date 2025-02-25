package ch.newscron.v3.data;

import java.util.List;

/**
 * Created by eliapalme on 23.11.16.
 */
public class BootstrapConfiguration {


    private List<Integer> packagesIds;
    private List<Integer> localPackagesIds;
    private List<CategoryPreference> categories;
    private String searchLanguage;


    public List<CategoryPreference> getCategories() {
        return categories;
    }

    public void setCategories(List<CategoryPreference> categories) {
        this.categories = categories;
    }

    public List<Integer> getPackagesIds() {
        return packagesIds;
    }

    public void setPackagesIds(List<Integer> packagesIds) {
        this.packagesIds = packagesIds;
    }

    public List<Integer> getLocalPackagesIds() {
        return localPackagesIds;
    }

    public void setLocalPackagesIds(List<Integer> localPackagesIds) {
        this.localPackagesIds = localPackagesIds;
    }

    public String getSearchLanguage() {
        return searchLanguage;
    }

    public void setSearchLanguage(String searchLanguage) {
        this.searchLanguage = searchLanguage;
    }
}
