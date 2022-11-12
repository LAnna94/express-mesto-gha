const { constants } = require('http2');
const HTTPError = require('./HTTPError');

class ServerError extends HTTPError {
  constructor(message = '') {
    super(`Неизвестная ошибка. ${message}`, constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
}

module.exports = ServerError;
