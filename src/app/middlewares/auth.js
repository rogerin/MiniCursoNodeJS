const jwt = require('jsonwebtoken')

const authConfig = require('../../config/auth')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).send( { error: 'No token provided' } )

    // Bearer 4029348209
    const parts = authHeader.split(' ');
    console.log(parts, parts.length === 2)
    if(!parts.length === 2)
        return res.status(401).send( { error: 'Token error' } )

    const [ scheme, token ] = parts
    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send( { error: 'Token malformatted' } )

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err) return res.status(401).send( { error: 'Token invalid' } )

        req.userId = decoded.id;
        return next();
    })
}