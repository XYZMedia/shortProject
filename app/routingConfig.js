(function (exports) {
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

}(typeof exports === 'undefined' ? this['routingConfig'] = {} : exports));
