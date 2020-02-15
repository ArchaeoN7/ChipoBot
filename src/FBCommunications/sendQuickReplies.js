const config = require('config');
const request = require('request');

const sendQuickReplyMessage = (sender,  title, proposition1, proposition2) => {
    
    let data = 
    { 
        text:title,
        "quick_replies":[
        {
            "content_type":"text",
            "title":proposition1,
            "payload":"proposition1"
            },
            {
            "content_type":"text",
            "title":proposition2,
            "payload":"proposition2"
            }
        ]
    }
    let access_token = config.get("ACCESS_TOKEN");
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: access_token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: data,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending quick reply messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

module.exports = sendQuickReplyMessage;