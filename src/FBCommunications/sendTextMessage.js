const config = require('config');
const request = require('request');
const sendReadNotification = require("../FBCommunications/senderAction")

const ACCESS_TOKEN = process.env.FB_WEBHOOK_ACCESS_TOKEN

/**
 * Send a text message back to the sender
 * @param {object} sender
 * @param {string} text
 */
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
        sendReadNotification(sender)
    })
}

module.exports = sendTextMessage;