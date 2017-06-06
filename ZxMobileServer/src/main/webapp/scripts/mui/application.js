define(function(require, exports, module){

    var AutoLoader = require("./autoLoader");
    var CustomStorage = require("./storage");

    var Application = module.exports = Marionette.Application.extend({

        constructor: function(){
            this.loader = new AutoLoader();
            this.storage = new CustomStorage();
            this.history = Backbone.history;
            this.browseList = [];
            this.browParam = [];
            
            this.listenTo(this.history, "route", function(){
                var fragment = this.history.fragment;
                if(this.browseList[0] == fragment) return;
                this.browseList.unshift(this.history.fragment);
                
                var param = App.storage.get("_parameters");
            	this.browParam.unshift(param || "");
            });

            Marionette.Application.apply(this, arguments);
        },

        back: function(pos){
            if(pos == null) pos = 1;
            if(pos >= 1 && pos < this.browseList.length){
                var url = this.browseList[pos];
                App.storage.set("_parameters", this.browParam[pos]);
                this.browseList = this.browseList.slice(pos + 1);
                this.browParam = this.browParam.slice(pos + 1);
                this.navigate(url, true);
            }
        },

        navigate: function(fragment, options){
        	if(this.browseList[0] != fragment){
        		Client.openWaitPanel("");
        	}
        	if(options&&options!=true){
        		App.storage.set("_parameters",options);
        	}
        	
            return this.history.navigate(fragment, true);
            
        },
        
        reload: function(){
            this.history.loadUrl(this.history.fragment);
        },
        
        qrCleanSession: function(){
        	Client.hideWaitPanel(1);
			var ad = App.storage.get("adList");
			App.storage.clear();
			App.storage.set("adList",ad);
			App.reload();
        }
    });
});