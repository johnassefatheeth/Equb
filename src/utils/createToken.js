const jwt = require('jsonwebtoken');

function createToken(id){
    const secret='shalom secret'
    const options={expiresIn:'1w'}
    return jwt.sign({id},secret,options)
}

module.exports = { createToken }