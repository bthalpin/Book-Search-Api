const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '1000';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({req,res}) {
    // console.log('AUTH',req?.body,req?.headers,req?.query)
    // allows token to be sent via  req.query or headers
    let token = req.query.token || req.headers.authorization;
    console.log('here',token)
    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      console.log('none')
      return req;
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      console.log(req.user)
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: token });
    }

    // send to next endpoint
    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    console.log('payload',payload)
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
