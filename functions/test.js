const moment = require('moment');

exports.handler = function(event, context, callback) {
    console.log(moment)
    callback(null, {
      statusCode: 200,
      body: moment().format()
    });
}