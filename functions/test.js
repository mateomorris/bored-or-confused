const moment = require('moment');

exports.handler = function(event, context, callback) {
    callback(null, {
      statusCode: 200,
      body: moment().format()
    });
}