const config = require('config');
const request = require('request');
const ACCESS_TOKEN = process.env.FB_WEBHOOK_ACCESS_TOKEN

/**
 * Send an image to the sender
 * @param {object} sender
 * @param {string} url
 */

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
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: ACCESS_TOKEN},
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