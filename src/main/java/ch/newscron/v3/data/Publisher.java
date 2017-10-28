package ch.newscron.v3.data;

/**
 * Created by eliapalme on 28.05.17.
 */
public class Publisher {

    private String name;
    private Long id;
    private Integer relevance;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRelevance() {
        return relevance;
    }

    public void setRelevance(Integer relevance) {
        this.relevance = relevance;
    }
}
