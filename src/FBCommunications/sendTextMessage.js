const config = require('config');
const request = require('request');
const ACCESS_TOKEN = process.env.FB_WEBHOOK_ACCESS_TOKEN

const sendTextMessage = (sender, text) => {
    let data = { text:text }
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
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

module.exports = sendTextMessage;