define(function (require, exports, module) {

	var userRegisterStep2_1Template = require("text!../template/userRegisterStep2_1.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : userRegisterStep2_1Template,
        
        events:{
        	"click #green_info":"green_info",
        },
        
        initialize : function(params){
        	var pageTest = {
    			  	title:'注册',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				}
    			  };
        	Client.hideWaitPanel(1);
        },
        
        green_info : function(){
        	var certNo = $('#input_certNo').val();
        	if (!Utils.checkCertNo18(certNo)) {
				return false;
			}
        	
			var userName = $('#input_userName').val();
			if(Utils.isEmpty(userName)){
				Utils.alertinfo("姓名不能为空");
				return false;
			}
			
			certNo = $('#input_certNo').val();
			var param = App.storage.get("_parameters");
			param.userName = userName;
			param.certNo = certNo;
			App.navigate("userRegister/userRegisterCtl/userRegisterStep2_2",param);
        },
	   	
  	    goBack : function(){
			App.back();
  	    }
        
	});
});