define(function(require, exports, module){

    var Router = require("./router");

    var AutoLoader = module.exports = Router.extend({
        initialize: function(){
            this.moduleStates = {};
            this.route(":dir/:file/*splat", "handle");
        },

        handle: function(dir,file){
            var modulePath = "webapp/pages/" + dir + "/controller/" + file;
            if(this.moduleStates[modulePath]) 
            	return;
            else if(this.moduleStates[modulePath]==false) {
            	
            	//自定义    js加载失败后，保证重新请求页面后能再次加载页面
            	//modulePath += ".js?reload="+getDate('YmdHis');
            }
            var fragment = Backbone.history.fragment;
            var hashChanged = false;

            var onRequireSuccess = _.bind(function(Controller){
                this.moduleStates[modulePath] = true;

                if(_.isFunction(Controller)) new Controller(dir + "/" + file + "/");
                if(!hashChanged) Backbone.history.loadUrl(fragment);
                this.triggerMethod("after:load");
            }, this);

            var onRequireError = _.bind(function(error){
            	
            	/*自定义加载失败处理*/
            	Utils.alertinfo("打开页面失败，请检查网络");
            	App.back();
            	Client.hideWaitPanel(1);
            	
                this.moduleStates[modulePath] = false;
                this.triggerMethod("after:load", error);
                throw error;
            }, this);

            this.triggerMethod("before:load");
            require([modulePath], onRequireSuccess, onRequireError);

            Backbone.history.once("beforeRoute", function(){
                hashChanged = true;
            });
        }
        
    });

});