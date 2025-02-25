<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css?family=Montserrat:100,300,400,700|PT+Serif');
      </style>
    <style type="text/css">

                    html {
                        background: #fff;
                        margin: 0px;
                        padding:0px;
                        font-size: 10px;
                    }

                    body{
                        font-weight: 300;
                        font-family: Montserrat, "Helvetica Neue", Helvetica, Arial, sans-serif;
                        margin: 0px;
                        padding:0px;
                        font-size: 14px;
                    }


                    *{
                        box-sizing: border-box;
                        ms-box-sizing: border-box;
                        webkit-box-sizing: border-box;
                        moz-box-sizing: border-box;
                    }

                    .container{
                        padding-top:25px;
                        padding-left:12px;
                        padding-right:12px;
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
                        font-weight: 400;
                        font-size:1.2rem;
                    }

                    .header .publisher{
                        color:#1CA8DD;
                        font-style: italic;
                    }

                    .header #time{
                        text-transform:lowercase;
                    }

                    .title{
                        font-size: 2.4rem;
                        font-weight: 700;
                    }


                    p{
                        font-size: 1.75rem;
                    }

                    p:first-letter {
                        font-weight: bolder;
                        font-size: 1.75rem;
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