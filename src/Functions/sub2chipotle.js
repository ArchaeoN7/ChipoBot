const tmMail = require('./tempMailAccess')
var request = require("request");
const fmParams = require("../../config/formDataParams");
const crypto = require("crypto");
const haiku = require('./haiku');

const sub2chip=(goOn)=>{

    const title = haiku();
    const index = title.indexOf("_");
    const firstName = title.substring(0, index);
    const lastName = title.substring(index+1);

    var fpart = crypto.randomBytes(20).toString('hex');
    tmMail.randomDomain((randomDomain, log)=>{
    
        if(randomDomain)
        {
            const newMail = fpart + randomDomain;

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
        request(options, function(error, response, body) {
            if (error) throw new Error(error);
            else
            {
                goOn(firstName, lastName, newMail);
            }
        });
        }
        else if(log)
            goOn(null, null, log);

    })

}

module.exports=sub2chip;
