function userLoggedMiddleware (req,res,next) {
    res.locals.isLogged = req.session.userLogged;
    next();
};

module.exports = userLoggedMiddleware;  