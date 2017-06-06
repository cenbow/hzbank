define(function(require, exports, module){

    var Router = require("./router");

    var Controller = module.exports = Router.extend({

        constructor: function(routePrefix){
            this.routePrefix = routePrefix;
            this.routes = this.routes || {};
            this._initializeRoutes();
            Router.call(this);
        },

        // convert actions to routes
        _initializeRoutes: function(){
            _.each(this.actions, function(name, route){
                route = this.routePrefix + route;
                route = route.replace(/\/{2,}/, "/");
                this.routes[route] = name;
            }, this);
        },

        _normalizeRoute: function(route){
            return route.replace(/\/{2,}/, "/");
        }
    });
});