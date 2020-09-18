const config = require('config');
const request = require('request');
const ACCESS_TOKEN = process.env.FB_WEBHOOK_ACCESS_TOKEN

module.exports = {
    /**
     * Send a persistent menu with one option
     * @param {object} sender
     */
    addPersistentMenu(sender) {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
            qs: { access_token: ACCESS_TOKEN },
            method: 'POST',
            json: {
                "persistent_menu": [
                    {
                        "locale":"default",
                        "composer_input_disabled":false,
                        "call_to_actions": [
                            {
                                "title":"J'ai encore faim",
                                "type":"postback",
                                "payload":"J'ai faim",
                            }
                        ]
                    }
                ],
                recipient: {id:sender},
            }

        }, function(error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error)
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
            }
        })

    },

    /**
     * Remove a persistent menu
     */
    removePersistentMenu() {
            request({
            url: 'https://graph.facebook.com/v2.6/me/thread_settings',
            qs: { access_token: ACCESS_TOKEN },
            method: 'POST',
            json:{
                setting_type : "call_to_actions",
                thread_state : "existing_thread",
                call_to_actions: [ ]
            }

        }, function(error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error)
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
            }
        })
    }
}