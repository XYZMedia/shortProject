(function(exports){

    var userRoles = {
        public: 1, // 001
        user:   2, // 010
        admin:  4  // 100
    };

    exports.userRoles = userRoles;
    
    exports.accessLevels = {
        public: userRoles.public | // 111
                userRoles.user   |
                userRoles.admin,   
        anon:   userRoles.public,  // 001
        user:   userRoles.user |   // 110
                userRoles.admin,                    
        admin:  userRoles.admin    // 100
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