define(function(require, exports, module){

    var Router = module.exports = Backbone.Router.extend({

        triggerMethod: Marionette.triggerMethod,

        // copy from Backbone.Router, and add some code
        // to trigger `beforeRoute` event
        route: function(route, name, callback) {
            if (!_.isRegExp(route)) route = this._routeToRegExp(route);
            if (_.isFunction(name)) {
                callback = name;
                name = '';
            }
            if (!callback) callback = this[name];
            var router = this;
            Backbone.history.route(route, function(fragment) {
                var event, args = router._extractParameters(route, fragment);

                event = $.Event("beforeRoute", { router: router, name: name, args: args, fragment: fragment });
                router.triggerMethod('beforeRoute', event);
                Backbone.history.trigger('beforeRoute', event);
                if(event.isDefaultPrevented()) return;

                if(router.execute(callback, args) === false) return;

                event = $.Event("route", { router: router, name: name, args: args, fragment: fragment });
                router.triggerMethod('route', event);
                Backbone.history.trigger('route', event);
            });

            return this;
        },

        _extractParameters: function(route, fragment) {
            var args = route.exec(fragment).slice(1);
            var query = this._deserialize(args.pop());
            return args.concat([query]);
        },

        _deserialize: function(queryString){
            if(queryString) {
                return _.reduce(queryString.split("&"), function (query, pair) {
                    var matched = /^([^=]+)(?:=(.*))?$/.exec(pair);
                    if (matched) query[matched[1]] = decodeURIComponent(matched[2]);
                    return query;
                }, {});
            }
        }
    });
});