package ch.newscron.v3.web;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * @author epalme
 */

import java.util.ResourceBundle;

public class DynamicResourceBundleControl extends ResourceBundle.Control {

    static private DynamicResourceBundleControl instance = null;
    //Reload resource every 5 min
    private long timeToLive = 300000l;

    public static DynamicResourceBundleControl instance() {
        if (instance == null) {
            instance = new DynamicResourceBundleControl();
        }
        return instance;
    }

    @Override
    public long getTimeToLive(String baseName, java.util.Locale locale) {
        return timeToLive;
    }
}