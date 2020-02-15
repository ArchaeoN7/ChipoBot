const config = require('config');
const request = require('request');
let PAGE_ACCESS_TOKEN = config.get("ACCESS_TOKEN");

module.exports = {
     addPersistentMenu() {

        request({
        url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json:{
        "get_started":{
        "payload":"GET_STARTED_PAYLOAD"
        }
        }
    }, function(error, response, body) {
        console.log("Add persistent menu " + response)
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
        request({
        url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json:{
    "persistent_menu":[
        {
            "locale":"default",
            "composer_input_disabled":true,
            "call_to_actions":[
            {
                "title":"Home",
                "type":"postback",
                "payload":"HOME"
            },
            {
                "title":"Nested Menu Example",
                "type":"nested",
                "call_to_actions":[
                {
                    "title":"Who am I",
                    "type":"postback",
                    "payload":"WHO"
                },
                {
                    "title":"Joke",
                    "type":"postback",
                    "payload":"joke"
                },
                {
                    "title":"Contact Info",
                    "type":"postback",
                    "payload":"CONTACT"
                }
                ]
            },
            {
                "type":"web_url",
                "title":"Latest News",
                "url":"http://foxnews.com",
                "webview_height_ratio":"full"
            }
            ]
        },
        {
            "locale":"zh_CN",
            "composer_input_disabled":false
        }
        ]
        }
    
    }, function(error, response, body) {
        console.log(response)
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
    
    },
    
    removePersistentMenu() {
            request({
            url: 'https://graph.facebook.com/v2.6/me/thread_settings',
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: 'POST',
            json:{
                setting_type : "call_to_actions",
                thread_state : "existing_thread",
                call_to_actions:[ ]
            }
        
        }, function(error, response, body) {
            console.log(response)
            if (error) {
                console.log('Error sending messages: ', error)
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
            }
        })
    }
}