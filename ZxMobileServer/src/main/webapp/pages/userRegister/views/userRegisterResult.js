define(function (require, exports, module) {

	var userRegisterResultTemplate = require("text!../template/userRegisterResult.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : userRegisterResultTemplate,
        
        events:{
        	"click #gotoIndex" : "gotoIndex",
        	"click #active" : "active",
        	"click #hongbao" : "gotoHongBao"
        },
        
        initialize : function(params){
        	var pageTest = {
    			  	title:'注册结果',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				}
    			  };
    		Client.initPageTitle(pageTest);
    		var activityFlag = App.storage.get("_parameters").activityFlag;
  	    	if(activityFlag == "01"){
				$("#hongbao").show();
			}
    		Client.hideWaitPanel(1);
        },
  	    goBack : function(){
			App.navigate("index/index/index");
  	    },
  	    gotoIndex : function(){
			Client.menuOpt("3");
			App.navigate("account/mycountCtl/mycount");
  	    },
  	    gotoHongBao : function(){
  	    	Client.menuOpt("0");
			App.navigate("hongbao/hongbaoCtl/redPacketInviteIndex");
  	    }, 
  	    active : function(){
  	    	Utils.recharge();
  	    },
	});
});