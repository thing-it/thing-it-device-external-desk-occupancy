const crypto = require('crypto');
const fs = require('fs');

class Token {
  constructor(config) {
    this.key = fs.readFileSync(config.keyPath, 'utf8');
    this.keyType = config.keyType; 
  }
  
  /**
   * 
   * @param {String} message 
   * @return {Srting}
   */
  encode(message) {
    let encodedMessage = undefined;
    if (this.keyType === 'public') {      
      encodedMessage = crypto.publicEncode(this.key, Buffer.from(message, 'utf8')).toString('base64')
    }
    if (this.keyType === 'private') {      
      encodedMessage = crypto.privateEncode(this.key, Buffer.from(message, 'utf8')).toString('base64')
    }
    return encodedMessage;
  }

  /**
   * 
   * @param {String} message 
   * @return {Srting}
   */
  decode(message) {
    let encodedMessage = undefined;
    if (this.keyType === 'public') {      
      encodedMessage = crypto.publicDecrypt(this.key, Buffer.from(message, 'base64')).toString('utf8')
    }
    if (this.keyType === 'private') {      
      encodedMessage = crypto.privateDecrypt(this.key, Buffer.from(message, 'base64')).toString('utf8')
    }
    return encodedMessage;
  }
}

module.exports = Token;