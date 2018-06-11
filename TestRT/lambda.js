let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = function (event, context, callback) {
	ddb.put({
		TableName: 'TestRT',
		Item: { 'itemCode': event.itemCode, 'name': event.name, 'type': event.type, 'price': event.price }
	}, function (err, data) {
		callback(err, event);
	});
}