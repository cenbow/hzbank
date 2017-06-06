define(function(require, exports, module){
	
	var lecunhongbaoTpl = require("text!../template/lecunhongbao.html");
	
	var lecunhongbaoView = module.exports = ItemView.extend({
		
		events : {
			"click #gotoLecun" : "gotoLecun"
			
		},
		
		template : lecunhongbaoTpl,
		
		initialize : function(){
			//初始化菜单方法
			var pageTest = {
				  	title:'新春营销',
					leftButton:{
						name : '返回',
    					func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
				  };
			Client.initPageTitle(pageTest);
//			this.init();
			Client.hideWaitPanel(1);
		},
		
  	    goBack : function(){
			App.back();
  	    },
  	    
		gotoLecun : function(){
			if (Utils.checkSession()) {
				if(Utils.checkRealUser()){
					if(!Utils.checkActivate()){
						return;
					}
					App.navigate("deposit/depositCtl/depositLoad");
				}
			} else {
				Client.toLogin("curView.gotoLecun()");
			}
    	}
	
	});
});
