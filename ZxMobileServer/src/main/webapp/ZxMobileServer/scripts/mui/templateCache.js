define(function (require, exports, module) {

    Marionette.TemplateCache.prototype.loadTemplate = function(template){
        return template;
    };

    module.exports = Marionette.TemplateCache;
});