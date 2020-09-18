const sendTextMessage = require('./sendTextMessage');
const sendQuickReplies = require('./sendQuickReplies');
const persMenus = require('./persistentMenus');
const getImg = require('../Functions/getImg');
const sendPic = require('../FBCommunications/sendPic');
const config = require('config');
var request = require("request");
const sub2chip = require('../Functions/sub2chipotle');
const registerError = require("../Functions/handleErrors");
const ACCESS_TOKEN = process.env.FB_WEBHOOK_ACCESS_TOKEN

/**
 * Parse facebook request to send an appropriate answer
 * @param {*} req
 * @param {*} res
 */
const handleChat = (req, res)=>
{
	let message_events = req.body.entry[0].messaging
	message_events.forEach(message_event => {
		let sender = message_event.sender.id
		try {
			console.log(config.get('APP_NAME'))
				if(message_event.postback)
				{
					if(message_event.postback.payload)
					{
						if (message_event.postback.payload == "GET_STARTED")
							sendQuickReplies(sender, "Hello jeune affamé ! Que puis-je faire pour toi ?","J'ai faim", "J'ai très faim")
						else if(message_event.postback.payload == "J'ai faim")
							{
								const url = "https://graph.facebook.com/"+sender+"?fields=first_name,last_name,profile_pic&access_token=" + ACCESS_TOKEN;
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

				}
				else if (message_event.message) {
					sendTextMessage(sender, "new " + config.get('APP_NAME') + " au rapport! Ta demande est en cours de traitement")
					if(message_event.message.quick_reply)
					{
						if(message_event.message.quick_reply.payload == "proposition1" || message_event.message.quick_reply.payload == "proposition2")
						{
							const url = "https://graph.facebook.com/"+sender+"?fields=first_name,last_name,profile_pic&access_token=" + ACCESS_TOKEN;
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
						if(text == "rmenu")
							persMenus.removePersistentMenu();
						else if(text == "menu")
							persMenus.addPersistentMenu(sender);
						else if(text == "J'ai faim")
						{
							const url = "https://graph.facebook.com/"+sender+"?fields=first_name,last_name,profile_pic&access_token=" + ACCESS_TOKEN;
							var options = {
								method: "GET",
								url:url
							};
							request(options, function(error, response, body) {
								if (error) throw new Error(error);
								const name = JSON.parse(body).first_name;
								sendQrCode(name, sender);
							});
						}else if(text == "help"){
							text = "*MAN " + config.get('APP_NAME') + "*\n\n*Ce bot te fournit des bons de réduction Chipotle* \n=> 2 burritos pour le prix d'un\n\n"+
							"-  Pour recevoir un nouveau code, envoie: 𝙅'𝙖𝙞 𝙛𝙖𝙞𝙢, ou passe par le menu à gauche de ta zone de texte\n"+
							"-  Si tu n'as pas de menu, envoie: ```menu```, il devrait apparaître au bout de quelques instants\n"+
							"-  Si tu veux enlever ce menu, envoie: ```rmenu```\n" +
							"-  D'autres questions? Demande à l'administrateur !\nhttps://www.facebook.com/messages/t/100045731290840\n" +
							"-  Le code du bot est pour le moment privé car il contient des informations sensibles concernant l'authentifcation de la page\n"+
							"=> Contacte l'administrateur si tu veux pouvoir en discuter avec lui !"+
							"\n\n\nAmicalement, l'admin"
							sendTextMessage(sender, text);

						}
						else
						{
							sendTextMessage(sender, "J'ai recu : " + text.substring(0, 200)+"...");
							sendTextMessage(sender, "Mais qu'est ce que comment que je fonctionne ?! pour le découvrir, envoie : ```help``` ");
						}
					}
				}
			} catch (error) {
				errorMessage(sender)
				console.log('aie')
		}
	});
    res.sendStatus(200)
}

/**
 * Process to get a qrcode reduction img and send it back to the user
 * @param {string} name
 * @param {object} sender
 */
function sendQrCode(name, sender){

    sub2chip((fname, lname, newMail)=>{
        if(fname)
        {
            getImg(0, false, newMail, (link)=>{
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
/**
 * Send an error message to the usr
 * @param {object} sender
 */
function errorMessage(sender)
{
    sendTextMessage(sender, "Probleme au cours de la récupération, réessayer ou contacter l'administrateur de la page.");
}
module.exports = handleChat;