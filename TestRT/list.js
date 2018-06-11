let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const tl = new AWS.Translate();
exports.handler = function (event, context, callback) {

	let response = {
		"isBase64Encoded": 1,
		"statusCode": 200,
		"headers": {
			"Access-Control-Allow-Origin": "*"
		},
		"body": "..."
	};

	let queryType = event.queryStringParameters.type;

	ddb.scan({
		TableName: 'TestRT',
		ExpressionAttributeValues: {
			':queryType': queryType
		},
		FilterExpression: 'itemType = :queryType'
	}, async function (err, data) {
		if (data.Items) {
			response.body = JSON.stringify(await Promise.all(data.Items.map(async (item) => {
				item.image = "https://s3.amazonaws.com/" + process.env["IMAGE_BUCKET"] + "/" + item.itemCode + ".jpg";
				item.name = (await tl.translateText({
					SourceLanguageCode: "en",
					TargetLanguageCode: "fr",
					Text: item.name
				}).promise()).TranslatedText;
				return item;
			})));
			callback(null, response);
		} else {
			response.statusCode = 500;
			callback(response, null);
		}
	});


}