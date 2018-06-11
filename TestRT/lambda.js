let AWS = require('aws-sdk');
const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB.DocumentClient();
let validatejs = require("validate.js");
exports.handler = function (event, context, callback) {

	//using validate.js : 3rd party LIBS
	let validation = validatejs(event, {
		itemCode: { presence: true },
		price: { numericality: true, presence: true }
	});

	if (validation) {
		callback(JSON.stringify(validation), null);
	}

	let image = Buffer.from(event.image, "base64");

	//DyanamoDB Demo
	ddb.put({
		TableName: 'TestRT',
		Item: { 'itemCode': event.itemCode, 'name': event.name, 'itemType': event.type, 'price': event.price }
	}, function (err, data) {

		if (!err) {
			let fileName = event.itemCode + ".jpg";
			//S3 Demo
			s3.putObject({
				"Body": image,
				"Bucket": "testxyz.abc.slapp.food",
				"Key": fileName,
				"ACL": "public-read"
			})
				.promise()
				.then(data => {
					callback(null, "Persisted Successfully");

				})
				.catch(err => {
					callback(err, null);
				});
		} else {
			callback(err, null);
		}

	});
}