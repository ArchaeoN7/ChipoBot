const config = require('config');
const request = require('request');

const sendImageMessage = (sender, url) => {
    let data = 
    { 
      "attachment":{
        "type":"image",
        "payload":{
          "url":url
        }
      }
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
            console.log('Error sending image messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

module.exports=sendImageMessage;