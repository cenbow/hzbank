define(function(require, exports, module){

    _.extend(exports, Marionette);

    exports.Collection = Backbone.Collection;
    exports.Model = Backbone.Model;

    exports.Application = require("./application");
    exports.Controller = require("./controller");
    exports.Router = require("./router");
    exports.CustomStorage = require("./storage");
    exports.Ajax = require("./ajax");
    exports.Client = require("mui_bridge");
    exports.TemplateCache = require("./templateCache");

});