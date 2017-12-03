<%@page import="ch.newscron.crawler.configuration.PublisherConfiguration.READABILITYSTATUS"%>
<%@page import="ch.newscron.crawler.configuration.PublisherConfiguration"%>
<%@page import="ch.newscron.crawler.configuration.PublisherConfigurationFactoryRedis"%>
<%@page import="ch.newscron.extractor.StructuredArticle"%>
<%@page import="ch.newscron.data.article.v2.ArticleFactory"%>
<%@page import="java.util.Random"%>
<%@page import="java.util.Date"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.text.DateFormat"%>
<%@page import="java.util.List"%>
<%@page import="java.util.ArrayList"%>
<%@page import="ch.newscron.data.article.Article"%>
<%@page import="java.sql.ResultSet"%>
<%@page import="org.apache.commons.dbutils.DbUtils"%>
<%@page import="javax.sql.DataSource"%>
<%@page import="javax.naming.InitialContext"%>
<%@page import="java.sql.PreparedStatement"%>
<%@page import="java.sql.Connection"%>
<%@page import="ch.newscron.v3.web.DynamicResourceBundleControl"%>
<%@page import="java.util.ResourceBundle"%>
<%@page import="java.util.Locale"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>



<%

    long id = Long.parseLong(request.getParameter("id"));
    String lang = request.getParameter("lang");

    boolean noFooter = false;
    if (request.getParameter("nofooter") != null && request.getParameter("nofooter").equalsIgnoreCase("true")) {
        noFooter = true;
    }

    boolean embedded = false;
    if (request.getParameter("embedded") != null && request.getParameter("embedded").equalsIgnoreCase("true")) {
        embedded = true;
    }

    if (lang == null) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equalsIgnoreCase("lang")) {
                    lang = cookie.getValue();
                    break;
                }
            }
        }
    }
    if (lang == null) {
        Locale l = request.getLocale();
        if (l.getLanguage().equalsIgnoreCase("en")) {
            lang = "en";
        }
        if (l.getLanguage().equalsIgnoreCase("fr")) {
            lang = "fr";
        }
        if (l.getLanguage().equalsIgnoreCase("it")) {
            lang = "it";
        }
        if (l.getLanguage().equalsIgnoreCase("de")) {
            lang = "de";
        }
    }

    if (lang == null) {
        lang = "en";
    }

    Locale locale = new Locale(lang);
    ResourceBundle stringBundle = ResourceBundle.getBundle("readability-strings", locale, DynamicResourceBundleControl.instance());

    String url = "";
    StructuredArticle article = ArticleFactory.getInstance().getArticle(id);

    final DateFormat dateFormatDate = new SimpleDateFormat("dd MMMM");
    final DateFormat dateFormatTime = new SimpleDateFormat("HH:mm a");

    String imageURL = null;
    int imageHO = 0;
    int imageWO = 0;
    boolean hasImage = false;
    String text = null;
    if (article != null) {

        url = article.getUrl();
        text = article.getHtml();
        if (text == null || text.isEmpty()) {
            article = null;
        } else {
            if (article.getImageID() > 0 && article.getImageWidth() >= 320) {
                imageWO = article.getImageWidth();
                imageHO = article.getImageHeight();
                hasImage = true;
            }
        }
    }

    if (article == null) {
        response.setStatus(410);
    } else {
        PublisherConfiguration publisher= null;
        if (article.getPublisherId() != null) {
             publisher = PublisherConfigurationFactoryRedis.getInstance().getPublisherConfiguration(article.getPublisherId().intValue());
        }else{
            Long publisherId = PublisherConfigurationFactoryRedis.getInstance().publisherLookup(article.getUrl());
            if(publisherId!=null){
               publisher = PublisherConfigurationFactoryRedis.getInstance().getPublisherConfiguration(publisherId.intValue());
            }
        }
        if(publisher!=null){
            if(publisher.getReadabilityStatus() == READABILITYSTATUS.FORBIDDEN){
                response.setStatus(403);
            }
            if(publisher.getReadabilityStatus() == READABILITYSTATUS.LOCKED){
                response.setStatus(423);
            }
        }
    }
%>



<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"> 

            <title>Newscron</title>
            <style type="text/css">

                html {
                    background: #fff;
                    margin: 0px;
                    padding:0px;
                }

                body{
                    font-family:"Roboto","Helvetica-Light","Arial";
                    margin: 0px;
                    padding:0px;
                    padding-bottom: 125px;
                }


                *{
                    box-sizing: border-box;
                    ms-box-sizing: border-box;
                    webkit-box-sizing: border-box;
                    moz-box-sizing: border-box; 
                }

                .container{
                    padding-top:25px;
                    padding-left:7px;
                    padding-right:7px;
                }

                .imgFrame{
                    width: 100%;
                }

                .img{
                    height: auto;
                    width: 100% !important;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                }

                .header{
                    font-weight: lighter;
                    font-size:90%;
                }

                .header #publisher{
                    color:#13B5D5;
                    font-style: italic;
                }

                .header #time{
                    text-transform:lowercase;
                }

                .h1{
                    font-size: 145%;
                    line-height:120%;
                    font-weight: bolder;
                }


                p{
                    line-height:150%;
                    font-size: 100%;
                }

                p:first-letter { 
                    font-weight: bolder; 
                    font-size: 135%; 
                }

                .footer{
                    width: 100%;
                    margin: 0px;
                    padding:0px;
                }

                .footer .button{
                    margin:30px;
                    height:50px;
                    border:1px;
                    border-style: solid;
                    border-color: #E5E4E2;
                    padding: 10px;
                    display: block;
                    text-decoration: none;
                    line-height: 30px;
                    text-align: center;
                    color:black;
                    font-size:120%;
                }

                .footer .disclamer{
                    background-color: #E5E4E2;
                    padding:10px;

                }

                .footer .disclamer span{

                    font-weight: lighter; 
                    font-size: 80%; 
                    text-align: center;
                    display: block;
                    color:#736F6E;
                }

                .alert{
                    background-color: 
                        rgb(242, 222, 222);
                    border-bottom-color: 
                        rgb(238, 211, 215);
                    border-bottom-left-radius: 4px;
                    border-bottom-right-radius: 4px;
                    border-bottom-style: solid;
                    border-bottom-width: 1px;
                    border-left-color: 
                        rgb(238, 211, 215);
                    border-left-style: solid;
                    border-left-width: 1px;
                    border-right-color: 
                        rgb(238, 211, 215);
                    border-right-style: solid;
                    border-right-width: 1px;
                    border-top-color: 
                        rgb(238, 211, 215);
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                    border-top-style: solid;
                    border-top-width: 1px;
                    box-sizing: border-box;
                    color: 
                        rgb(185, 74, 72);
                    display: block;
                    font-size: 14px;
                    line-height: 20px;
                    padding-bottom: 15px;
                    padding-left: 15px;
                    padding-right: 15px;
                    padding-top: 15px;
                    width: 95%;
                    margin: auto;
                    margin-top: 25px;
                    text-align: center;

                }



                h1,h2,h3,h4,h5,h6
                {
                    font-size: 1em;
                    font-weight: normal;
                }
                b,strong
                {
                    font-weight: normal;
                }
                a{
                    text-decoration: none;
                    color: black;
                }


            </style>

    </head>
    <body>
        <%  if (article != null) {%>
        <div class="container" <% if (embedded) {%> style="padding-top:0px;" <%}%>>

            <% if (!embedded) {%>
            <div class="header">
                <span id="date"><%=dateFormatDate.format(new Date(article.getPublicationDateGMT()))%></span> | <span id="time"><%=dateFormatTime.format(new Date(article.getPublicationDateGMT()))%></span> | <span id="publisher"><%=article.getPublisher()%></span>
            </div>
            <h1 class="h1"><%=article.getTitle()%></h1>
            <%}%> 

            <div class="imgFrame" id="imgFrame"></div>
            <p><%=text%></p>
        </div>

        <% if (!noFooter && !embedded) {%>
        <div class="footer">
            <a class="button" href="<%=url%>"><%= stringBundle.getString("readability.original")%></a>	
            <div class="disclamer">
                <span><%= stringBundle.getString("readability.disclamer")%></span> 
            </div>
        </div>
        <%}%>

        <%} else {%>
        <div class="container">
            <div class="alert"><%= stringBundle.getString("readability.notfound")%></div>
        </div>
        <%}%>
    </body>
    <%  if (article != null && hasImage) {%>    
    <script language="JavaScript">
        var w = window.innerWidth - 30;
        var h = Math.round(w / <%=imageWO%> * <%=imageHO%>);
        if (w > <%=imageWO%>) {
            w = <%=imageWO%>;
            h = <%=imageHO%>;
        }
        document.getElementById("imgFrame").innerHTML = "<img src='http://services.newscron.com/v2/Image?id=<%=article.getImageID()%>&size=maxw:" + w + "' border='0' class='img' height='" + h + "' width='" + w + "'> ";
    </script>
    <%}%>     
</html>
