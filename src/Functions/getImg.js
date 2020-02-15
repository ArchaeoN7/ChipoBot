const tmMail = require('./tempMailAccess');
const registerError = require("./handleErrors");

const retrieveImg = (count, dispInfos, email, goOn)=>{
    tmMail.getmail(count, dispInfos, email, (mail, errorLog)=>{
        if(errorLog)
        {
            registerError(errorLog)
        }
        if (mail)
        {
            var html = mail.mail_html;
            const img = retrieveLink(html);
            if(img)
                goOn(img);
            else
                goOn(null);
        }
        else
            goOn(null);
    });
    
}

function retrieveLink(html){

    var indexLink = html.indexOf("https://offermanager.fishbowl.com/OfferManagement/Handlers/BarcodeGenerator.ashx");
    if(indexLink != -1)
    {
        html = html.substring(indexLink);
        indexLink = html.indexOf('\"');
        if(indexLink != -1)
        {
            html = html.substring(0, indexLink);
            return html;
        }
        else
            return null;
    }
    else
        return null;
}



module.exports=retrieveImg;