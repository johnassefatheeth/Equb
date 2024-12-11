const jwt = require('jsonwebtoken');

function createToken(id){
    const secret='shalom secret'
    const options={expiresIn:'1h'}
    return jwt.sign({id},secret,options)
}

module.exports = { createToken }