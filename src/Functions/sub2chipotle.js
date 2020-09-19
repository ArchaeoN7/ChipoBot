const tmMail = require('./tempMailAccess')
var request = require("request");
const fmParams = require("../../config/formDataParams");
const crypto = require("crypto");
const haiku = require('./haiku');
const { v4: uuidv4 } = require('uuid');
const config = require('config');

/**
 * Send a request to Chipotle to subscribe with a random mail
 * fpart is "first part" of the email, randomDomain is given by tempmail
 * and is "@" + domain name
 * @param {callback} callback
 */

exports.sub2chip = (callback) => {
    mailOption = config.get("MAIL_OPTION")
    switch(mailOption) {
        case "gmail":
            sub2chip_gmail(callback)
            break;
        case "tmpmail":
            sub2chip_tempmail(callback)
            break;
        default:
            sub2chip_gmail(callback)
            break;
      }
}
const sub2chip_tempmail = (callback)=>{

    const title = haiku();
    const index = title.indexOf("_");
    const firstName = title.substring(0, index);
    const lastName = title.substring(index+1);
    var fpart = crypto.randomBytes(20).toString('hex');

    tmMail.randomDomain((randomDomain, log)=>{
        if(randomDomain)
        {
            const {newMail, options} = build_request(fpart, randomDomain, firstName, lastName)
            request(options, function(error, response, body) {
                if (error) throw new Error(error);
                else
                {
                    callback(firstName, lastName, newMail);
                }
            });
        }
        else if(log)
            callback(null, null, log);
    })
}

const sub2chip_gmail = (callback)=>{

    const title = haiku();
    const index = title.indexOf("_");
    const firstName = title.substring(0, index);
    const lastName = title.substring(index+1);
    domain = "@gmail.com"
    var fpart = config.get('GMAIL_ADDRESS') + "+" + title + "+"+ uuidv4();

    const {newMail, options} = build_request(fpart, domain, firstName, lastName)
    request(options, function(error, response, body) {
        if (error) throw new Error(error);
        else
        {
            callback(firstName, lastName, newMail);
        }
    });
}

function build_request(fpart, domain, firstName, lastName) {
    const newMail = fpart + domain;

    const url = "http://chipotefr.fbmta.com/members/UpdateProfile.aspx?Action=Subscribe&_Theme=30064771402";
    var options = {
        method: "POST",
        url:url,
        headers: {
        "Host": "chipotlefr.fbmta.com",
        "x-rapidapi-key": "240ac4c2cdmsh97553e01256735fp172537jsn4bf665c47ea7"
        },
        formData: {
            "__VIEWSTATEFIELDCOUNT":fmParams.VIEWSTATEFIELDCOUNT,
            "__VIEWSTATE":fmParams.VIEWSTATE,
            "__VIEWSTATE1":fmParams.VIEWSTATE1,
            "__VIEWSTATE2":fmParams.VIEWSTATE2,
            "__VIEWSTATE3":fmParams.VIEWSTATE3,
            "__VIEWSTATE4":fmParams.VIEWSTATE4,
            "__VIEWSTATE5":fmParams.VIEWSTATE5,
            "__VIEWSTATE6":fmParams.VIEWSTATE6,
            "__VIEWSTATE7":fmParams.VIEWSTATE7,
            "__VIEWSTATEGENERATOR":fmParams.VIEWSTATEGENERATOR,
            "ctl00$PageContent$SubmitText":fmParams.SubmitText,
            "ctl00$PageContent$MemberProfileControl$CustomField_FirstName_0":firstName,
            "ctl00$PageContent$MemberProfileControl$CustomField_LastName_0":lastName,
            "ctl00$PageContent$MemberProfileControl$CustomField_EmailAddress_0":newMail,
            "ctl00$PageContent$MemberProfileControl$CustomField_EmailAddress_1":newMail

        }
    };
    return {newMail, options}
}
