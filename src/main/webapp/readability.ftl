<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css?family=Montserrat:100,300,400,700|PT+Serif');
      </style>
    <style type="text/css">

                    html {
                        background: #fff;
                        margin: 0px;
                        padding:0px;
                    }

                    body{
                        font-weight: 300;
                        font-family: Montserrat, "Helvetica Neue", Helvetica, Arial, sans-serif;
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

                    .header .publisher{
                        color:#1CA8DD;
                        font-style: italic;
                    }

                    .header #time{
                        text-transform:lowercase;
                    }

                    .title{
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
                        padding: 7px 15px;
                        color: white!important;
                        background-color: #1ca8dd!important;
                        border-radius: 4px;
                        margin: 30px;
                        display: block;
                        position: relative;
                        display: block;
                        text-decoration: none;
                        line-height: 21px;
                        text-align: center;
                        font-size: 14px;
                        color: black;
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

    <div class="container">
        <div class="header">
                    <span id="date">${publicationDate}</span> | <a class="publisher" href="${url}">${publisher}</a>
        </div>
       <h1 class="title">${title}</h1>
    </div>
       <div class="imgFrame" id="imgFrame"></div>
    <div class="container">
       <p>${text}</p>
    </div>
    <div class="footer">
        <a class="button" href="${url}">Read Web Version</a>
        <div class="disclamer">
            <span>You are viewing this article in readability mode.</span>
        </div>
   </div>
    <#if hasImage == true>
      <script language="JavaScript">
                  var w = window.innerWidth - 30;
                  var h = Math.round(w / ${imageWO?c} * ${imageHO?c});
                  if (w > ${imageWO?c}) {
                      w = ${imageWO?c};
                      h = ${imageHO?c};
                  }
                  document.getElementById("imgFrame").innerHTML = "<img src='http://services.newscron.com/v2/Image?id=${id?c}&size=maxw:" + w + "' border='0' class='img' height='" + h + "' width='" + w + "'> ";
              </script>
    </#if>
</body>
</html>