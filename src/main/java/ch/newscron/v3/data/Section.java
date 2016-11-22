package ch.newscron.v3.data;

import java.util.LinkedList;

/**
 * Created by eliapalme on 13.11.16.
 */
public class Section {

    private Category category;
    private LinkedList<Article> articles = new LinkedList<Article>();

    public LinkedList<Article> getArticles() {
        return articles;
    }

    public void setArticles(LinkedList<Article> articles) {
        this.articles = articles;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
