define(function (require, exports, module) {

	var UserRegStep1View = require("../views/userRegStep1");
	var UserRegStep2View = require("../views/userRegStep2");
	var UserRegResultView = require("../views/userRegResult");
	var UserRegResult2View = require("../views/userRegResult2");
	var UserRegisterStep1View = require("../views/userRegisterStep1");
	var UserRegisterStep2View = require("../views/userRegisterStep2");
	var UserRegisterStep3View = require("../views/userRegisterStep3");
	var UserRegController = module.exports = Controller.extend({
		actions:{
				"userRegStep1" : "userRegStep1",
				"userRegStep2" : "userRegStep2",
				"userRegResult" : "userRegResult",
				"userRegResult2" : "userRegResult2",
				"userRegisterStep1" : "userRegisterStep1",
				"userRegisterStep2" : "userRegisterStep2",
				"userRegisterStep3" : "userRegisterStep3",
			},
        userRegStep1 : function(){
        	App.container.show(new UserRegStep1View({model : new Model()}));
        },

        userRegStep2 : function(){
        	var param ={
        			mobileNo :Utils.trim(App.storage.get("_parameters").mobileNo),
        			recommendNum :Utils.trim(App.storage.get("_parameters").recommendNum),
        			totalNum :Utils.trim(App.storage.get("_parameters").totalNum),
        	};
        	App.container.show(new UserRegStep2View({model : new Model(param)}));
        },

        userRegResult : function(){
        	var param ={
        			mobileNo :Utils.trim(App.storage.get("_parameters").mobileNo),
        	};
        	App.container.show(new UserRegResultView({model : new Model(param)}));
        },

        userRegResult2 : function(){
           	var param ={
        			recommendNum :Utils.trim(App.storage.get("recommendNum")),
        	};
        	App.container.show(new UserRegResult2View({model : new Model(param)}));
        },

        userRegisterStep1 : function(){
        	var param =App.storage.get("_parameters");
        	/*if(!MUI.isEmpty(App.storage.get("_parameters"))){
        		param = {
        				userName:Utils.trim(App.storage.get("_parameters").userName),
        				certNo:Utils.trim(App.storage.get("_parameters").certNo),
        		};
        	}else{
        		param = {
        				userName:"",
        				certNo:"",
        		};     		
        	}*/
        	Client.menuOpt("0");
        	App.container.show(new UserRegisterStep1View({model : new Model(param)}));
        },

        userRegisterStep2 : function(){
        	var param ={};
        	if(!MUI.isEmpty(App.storage.get("_parameters"))){
        		param = {
        				bankName:Utils.trim(App.storage.get("_parameters").bankName),
        				bankType:Utils.trim(App.storage.get("_parameters").bankType),
        				bindCardNo:Utils.trim(App.storage.get("_parameters").bindCardNo),
        				cardType:Utils.trim(App.storage.get("_parameters").cardType),
        				bankUrlClass:Utils.trim(App.storage.get("_parameters").bankUrlClass),
        				bankList : NS.PB_BANKLIST,
        		};        		
        	}else{
        		param = {
        				bankName:"",
        				bankType:"",
        				bindCardNo:"",
        				cardType:"",
        				bankUrlClass:"",
        				bankList : NS.PB_BANKLIST,
       		};     		
        	}
        	App.container.show(new UserRegisterStep2View({model : new Model(param)}));
        },

        userRegisterStep3 : function(){
        	var param ={
        			customerAlias :Utils.trim(App.storage.get("_parameters").customerAlias),
        	};
        	App.container.show(new UserRegisterStep3View({model : new Model(param)}));
        },

	});
	
});