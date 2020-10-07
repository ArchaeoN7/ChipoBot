const config = require('config');
const request = require('request');
const ACCESS_TOKEN = process.env.FB_WEBHOOK_ACCESS_TOKEN


module.exports = {

    sendReadNotification(sender) {
        console.log("on envoie la sauce")
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: ACCESS_TOKEN},
            method: 'POST',
            json: {
                recipient: {id:sender},
                sender_action: "mark_seen"
            }
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending mark_seen indicator: ', error)
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
            }
            else
                console.log(response)
        })
    }
}