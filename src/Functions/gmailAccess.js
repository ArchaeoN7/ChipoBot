const fs = require('fs')
const readline = require('readline');
const {google} = require('googleapis');
const atob = require('atob');
const config = require('config');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} gmailAction The callback to call with the authorized client.
 * @param {function} callback The function to call after playing with gmail API.
 */
const gmailAccess = (gmailAction, gmailActionargs, callback) => {
	// Create a new OAuth2 object
	const client_secret = process.env.CLIENT_SECRET;
	const client_id = process.env.CLIENT_ID;
	const redirect_uri = process.env.REDIRECT_URI;
	const oAuth2Client = new google.auth.OAuth2(
			client_id, client_secret, redirect_uri);

	// Get access token informations
	access_token = process.env.GMAIL_ACCESS_TOKEN;
	refresh_token = process.env.GMAIL_REFRESH_TOKEN;
	scope = process.env.GMAIL_SCOPE;
	token_type = process.env.GMAIL_TOKEN_TYPE;
	expiry_date = process.env.GMAIL_EXPIRY_DATE;
	// Create connection with Gmail
	creds = {access_token, refresh_token, scope, token_type, expiry_date}
	oAuth2Client.setCredentials(creds);
	console.log(process.env.GMAIL_SCOPE)
	// Execute gmailAction function
	gmailAction(oAuth2Client, gmailActionargs, callback);
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} gmailAction The callback for the authorized client.
 */
function getNewToken(oAuth2Client, gmailAction) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});
	console.log('Authorize this app by visiting this url:', authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question('Enter the code from that page here: ', (code) => {
		rl.close();
		oAuth2Client.getToken(code, (err, token) => {
			if (err) return console.error('Error retrieving access token', err);
			oAuth2Client.setCredentials(token);
			// Store the token to disk for later program executions
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) return console.error(err);
				console.log('Token stored to', TOKEN_PATH);
			});
			gmailAction(oAuth2Client);
		});
	});
}

/**
 * Get list of mail ids and send them to next function
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {object} args Object containing various arguments (count, newmail)
 * @param {function} callback Callback to call at the end of the execution
 */
const findChipotleMessage = (auth, args, callback) => {
	var gmail = google.gmail('v1');
	fpartGmail = config.get("GMAIL_ADDRESS")

	gmail.users.messages.list({
	auth: auth,
	userId: fpartGmail+"@gmail.com",
	maxResults: 10,
	q:""
}, function(err, response) {
		if (err) return console.log('The API returned an error: ' + err);
		/*
		console.log("Status : " + response.status);
		console.log("maillists size: " + response.data.resultSizeEstimate);
		console.log("++++++++++++++++++++++++++");
		*/
		getChipotleMessage(response.data, auth, args, callback);
	});
}
/**
 * Extract Html part of the mail
 * @param {json} response mail JSON response
 */
function getHtml(response) {
	var part = response.data.payload.parts.filter(function(part) {
		return part.mimeType == 'text/html';
	});
	return atob(part[0].body.data.replace(/-/g, '+').replace(/_/g, '/'));
}
/**
 * Recurssive process while the count < MAX_COUNT
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {object} args Object containing various arguments (count, newmail)
 * @param {function} callback Callback to call at the end of the execution
 */
function hereWeGoAgain(auth, args, callback)
{
	if (args.count % 5 == 0)
		console.log("Here we go again, n°"+ (args.count + 1) + " try");
	args["count"] = args.count + 1
	findChipotleMessage(auth, args, callback)
}
/**
 * Recursive function. Get a mail of messageID and check if it is our registration address
 * @param {array} messageID Array of all mails message Id
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {object} args Object containing various arguments (count, newmail)
 * @param {function} callback Callback to call at the end of the execution
 */
function getChipotleMessage(messageID, auth, args, callback) {
	if (messageID.messages.length > 0) {
		chipotleLabelId = config.get("GMAIL_CHIPO_LABEL")
		fpartGmail = config.get("GMAIL_ADDRESS")
		senderMail = args.mail
		var gmail = google.gmail('v1');
		gmail.users.messages.get({
		auth: auth,
		userId: fpartGmail+"@gmail.com",
		id:messageID.messages[0].id
		},  function(err, response) {
				if (response.data.labelIds.indexOf(chipotleLabelId) != -1)
				{
					headers = response.data.payload.headers
					for (header of headers){
						if (header.name == "Delivered-To")
							if (header.value == senderMail) {
								var html = getHtml(response);
								callback(html);
								return 0;
							}
							else
								break;
					}
				}
				else
					console.log(response.data.labelIds)
				messageID.messages.splice(0,1);
				if(messageID.messages.length > 0)
					getChipotleMessage(messageID, auth, args, callback);
				else {
					count = args.count
					if (count < config.get("MAX_COUNT_LOOP"))
					{
						hereWeGoAgain(auth, args, callback)
					}
					else
					{
						console.log("email searching Timed out, counter: " + args.count)
						callback(null)
					}
				}
			});
	}
	else
		hereWeGoAgain(auth, args, callback)
}

exports.findChipotleMessage = findChipotleMessage;
exports.gmailAccess = gmailAccess;