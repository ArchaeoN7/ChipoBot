const sendTextMessage = require('./sendTextMessage');
const sendQuickReplies = require('./sendQuickReplies');
const persMenus = require('./persistentMenus');
const addPersMenu = persMenus.addPersistentMenu; 
const getImg = require('../Functions/getImg');
const sendPic = require('../FBCommunications/sendPic');
const config = require('config');
var request = require("request");
const sub2chip = require('../Functions/sub2chipotle');
const registerError = require("../Functions/handleErrors");


const handleChat = (req, res)=>
{
    //console.log(JSON.stringify(req.body));
    //console.log("\n");
    let message_events = req.body.entry[0].messaging
    message_events.forEach(message_event => {
    let sender = message_event.sender.id
        
        if(message_event.postback)
        {
            if(message_event.postback.payload)
            {
                if (message_event.postback.payload == "GET_STARTED")
                    sendQuickReplies(sender, "Hello jeune affamé ! Que puis-je faire pour toi ?","J'ai faim", "J'ai très faim")
            }
            
        }
        else if (message_event.message) {
            if(message_event.message.quick_reply)
            {
                if(message_event.message.quick_reply.payload == "proposition1" || message_event.message.quick_reply.payload == "proposition2")
                {
                    const url = "https://graph.facebook.com/"+sender+"?fields=first_name,last_name,profile_pic&access_token="+config.get("ACCESS_TOKEN");
                    var options = {
                        method: "GET",
                        url:url
                    };
                    request(options, function(error, response, body) {
                        if (error) throw new Error(error);
                        const name = JSON.parse(body).first_name;
                        sendQrCode(name, sender);
                    });

                }
            }
            else if(message_event.message.text)
            {

                let text = message_event.message.text
                if(text == "rmMenu")
                    persMenus.removePersistentMenu();
                else if(text == "J'ai faim")
                {
                    const url = "https://graph.facebook.com/"+sender+"?fields=first_name,last_name,profile_pic&access_token="+config.get("ACCESS_TOKEN");
                    var options = {
                        method: "GET",
                        url:url
                    };
                    request(options, function(error, response, body) {
                        if (error) throw new Error(error);
                        const name = JSON.parse(body).first_name;
                        sendQrCode(name, sender);
                    });
                }   
                else
                    sendTextMessage(sender, "J'ai recu : " + text.substring(0, 200))
            }
            
        }
    });
    res.sendStatus(200)
}

function sendQrCode(name, sender){
    sub2chip((fname, lname, newMail)=>{
        if(fname)
        {
            getImg(0, false, "newMail", (link)=>{
                if(link!=null)
                {
                    sendTextMessage(sender, fname + " "+lname+ " s'est enregistré chez Chipotle");
                    sendTextMessage(sender, "Et voilà, va donc te régaler "+name+" !");
                    sendPic(sender, link);
                }
                else
                    errorMessage(sender)
            })
        }
        else
        {
            registerError(newMail);
            errorMessage(sender);
        }
        
      })
}

function errorMessage(sender)
{
    sendTextMessage(sender, "Probleme au cours de la récupération, réessayer ou contacter l'administrateur de la page.");
}
module.exports = handleChat;