const jsonDB = require('../model/jsonDatabase');
const userModel = jsonDB('users');

function userLoggedMiddleware (req,res,next) {

    req.session.userLogged = userModel.findByField('email', req.cookies.userEmail);

    res.locals.isLogged = req.session.userLogged;

    next();
};

module.exports = userLoggedMiddleware;  