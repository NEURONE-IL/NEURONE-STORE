var jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request');
    }
    let token = req.headers.authorization.split(' ')[1]
    if (!token) {
        return res.status(401).send('Unauthorized request');
    }
    jwt.verify(token, 'store2019', (err, decoded) => {
        if (err) return res.status(401).send({ ok: false, message: 'Unauthorized request' });
        else {
            req.decoded = decoded;
            next();
        }
    });
}

module.exports = verifyToken;