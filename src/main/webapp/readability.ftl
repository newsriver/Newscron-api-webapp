<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
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
                    <span id="date">${publicationDate}</span> | <span id="publisher">${publisher}</span>
        </div>
       <h1 class="title">${title}</h1>
       <div class="imgFrame" id="imgFrame"></div>
       <p>${text}</p>
    </div>
    <div class="footer">
        <a class="button" href="${url}">Read Web Version</a>
        <div class="disclamer">
            <span>You are reading this article in readability mode.</span>
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