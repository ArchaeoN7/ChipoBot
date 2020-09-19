const tmMail = require('./tempMailAccess');
const registerError = require("./handleErrors");
const { gmailAccess, findChipotleMessage} = require('./gmailAccess');
const config = require('config');

/**
 * Get img in the mail in the tempmail box
 * @param {*} count
 * @param {*} dispInfos
 * @param {string} email
 * @param {callback} callback
 */

exports.retrieveImg = (email, callback) => {
    mailOption = config.get("MAIL_OPTION")
    switch(mailOption) {
        case "gmail":
            retrieveImg_gmail(email, callback)
            break;
        case "tmpmail":
            retrieveImg_tmpmail(email, callback)
            break;
        default:
            retrieveImg_gmail(email, callback)
            break;
      }
}
const retrieveImg_tmpmail = (email, callback)=> {
    tmMail.getmail(0, dispInfos, email, (mail, errorLog)=> {
        if(errorLog)
        {
            registerError(errorLog)
        }
        if (mail)
        {
            var html = mail.mail_html;
            const img = retrieveLink(html);
            if(img)
                callback(img);
            else
                callback(null);
        }
        else
            callback(null);
    });

}
const retrieveImg_gmail = (email, callback)=> {
    gmailAccess(findChipotleMessage, {mail: email, count: 0}, (html)=> {
        if (html != null)
            console.log(retrieveLink(html))
    })
}
/**
 * find the qrcode image url in the html code of the mail
 * @param {string} html
 */
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