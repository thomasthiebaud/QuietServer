'use strict';

class ResponseMock {
  status(_httpCode) {
    this.httpCode = _httpCode;
    return this;
  }
  json(_httpMessage) {
    this.httpMessage = _httpMessage;
  }
  toString() {
    return {
      status: this.httpCode,
      body: this.httpMessage,
    };
  }
}

module.exports = ResponseMock;
