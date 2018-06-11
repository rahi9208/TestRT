let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
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
	}, function (err, data) {
		if (data.Items) {
			response.body = JSON.stringify(data.Items.map(item => {
				item.image = "https://s3.amazonaws.com/" + process.env["IMAGE_BUCKET"] + "/" + item.itemCode + ".jpg";
				return item;
			}));
			callback(null, response);
		} else {
			response.statusCode = 500;
			callback(response, null);
		}
	});


}