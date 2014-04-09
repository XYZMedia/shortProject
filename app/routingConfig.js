(function(exports){
//EUGENECHOI
    var userRoles = {
        public: 1,
        user:   2,
        admin:  4 
    };

    exports.userRoles = userRoles;
    
    exports.accessLevels = {
        public: userRoles.public,
        anon:   userRoles.public, 
        user:   userRoles.user,
        admin:  userRoles.admin
    };

})(typeof exports === 'undefined'? this['routingConfig']={}: exports);

// function ensureAuthorized(req, res, next) {         should be in server side
//     var role;
//     if(!req.user) role = userRoles.public;
//     else          role = req.user.role;

//     var accessLevel = _.findWhere(routes, 
//         { path: req.route.path }).accessLevel 
//         || accessLevels.public;

//     if(!(accessLevel.bitMask & role.bitMask)) 
//         return res.send(403);

//     return next();
// }