define(function (require, exports, module) {

	var userRegResult2Template = require("text!../template/userRegResult2.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : userRegResult2Template,
        
        events:{
        	"click #share":"toShare",

        },
        
        initialize : function(params){
        	var pageTest = {
    			  	title:'活动分享',
    				leftButton:{
    					name : '返回',
    					func :'curView.logOut()'
    				}
    			  };
    		Client.initPageTitle(pageTest);
			Client.hideWaitPanel(1);

        },
        logOut : function(){
			var shareReturn = App.storage.get("shareReturn");
			if(shareReturn){
				Client.menuOpt("2");
	    		App.navigate("product/productCtl/wantInv");
			}else{
				Client.logOut();	
			}
    	},
    	toLogin : function(type){
    		var param ={isHidden:type};
    		App.navigate("login/loginCtl/login?type=account",param);
    	},
    	toShare : function(){	
    		var name = App.storage.get("UserInfo").customerNameCN;
			if(MUI.isEmpty(name)){
				name = App.storage.get("customerName");
    		}   			
			var opt={
					url: basePath + "/share.html?code="+(App.storage.get("recommendNum")||"")+"&name="+encodeURIComponent(name),
					content:"杭银直销突破传统实体网点的经营模式，只需通过互联网即可即可完成账户注册，享受多元化的金融服务，快来体验吧。",
					type:"1"
				};
			Client.share(opt);
    	}
	});
});