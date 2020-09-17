const crypto = require("crypto");
var request = require("request");
const config = require('config');

function md5HashMail(email) {
	return crypto
		.createHash("md5")
		.update(email)
		.digest("hex");
}
const getMail = (count, dispInfos, email, useMail) => {
	const url = "https://privatix-temp-mail-v1.p.rapidapi.com/request/mail/id/" + md5HashMail(email)+"/";
	var options = {
		method: "GET",
		url:url,
		headers: {
		"x-rapidapi-host": "privatix-temp-mail-v1.p.rapidapi.com",
		"x-rapidapi-key": "240ac4c2cdmsh97553e01256735fp172537jsn4bf665c47ea7"
		}
	};

	request(options, function(error, response, body) {
		if (error) throw new Error(error);
		if(!JSON.parse(body).error)
		{
			if(JSON.parse(body)[0].mail_subject == "CHI-POT-LÉ. TU-VAS-KIF-FER")
				useMail(JSON.parse(body)[0], null);
			else
				useMail(null,"Wrong mail found in temp mail box");
		}
		else if(JSON.parse(body).error)
		{
			if(count > config.get("MAX_COUNT_LOOP"))
				useMail(null, "MAX_COUNT_LOOP was reached, last error: "+JSON.parse(body).error)
			else
			{
				getMail(count+1, dispInfos, email, useMail);
				if(dispInfos == true)
					displayInfos(count, email, body);
			}
		}
		else
			useMail(null, "Found neither error message or email when contacting temp mail API");
		
	});
}

function displayInfos(count, email, stuff) {

	console.log("Count: " + count);
	console.log("hash is: "+md5HashMail(email) + " for email: " + email);
	console.log(JSON.parse(stuff).error);
}

const randomDomain = (useRandom) =>{

	var options = {
	method: 'GET',
	url: 'https://privatix-temp-mail-v1.p.rapidapi.com/request/domains/',
	headers: {
		'x-rapidapi-host': 'privatix-temp-mail-v1.p.rapidapi.com',
		'x-rapidapi-key': '240ac4c2cdmsh97553e01256735fp172537jsn4bf665c47ea7'
	}
	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);
		else
		{
			try {
				
			
			console.log(body)
			body = JSON.parse(body);
			if(body.length > 0)
			{
				const randomDomain = Math.floor(Math.random()*body.length);
				useRandom(body[randomDomain], null);
			}
			else
				useRandom(null, "Couldn't get any domain from API TM");
			} catch (error) {
				print(error);
			}
		}
});

}

module.exports.getmail=getMail;
module.exports.randomDomain=randomDomain;

