define(function (require, exports, module) {

	var ocrCreditTemplate = require("text!../template/ocrCredit.html");
	 
	var ocrCreditView = module.exports = ItemView.extend({
		
        template : ocrCreditTemplate,
        
        events:{
        	"click #a" : "ocrFront",
			"click #b" : "ocrBack",
			"click #next" : "next"
        },
        
        initialize : function(params){
        	var param = App.storage.get("_parameters");
			this.param = $.extend({},param);
        	Client.hideWaitPanel(1);
        },
        
        ocrFront : function(){
        	Client.ocrCheck("curView.getPhotoResFront");
		},
		
		getPhotoResFront : function(obj) {
			var html = '<img src="data:image/png;base64,'+obj.photoBase64+'" width="550" height="173">';
			$("#a .idcard").html(html);
			$("#a").addClass("ag");
			Client.hideWaitPanel(1);
			obj.birth = '' + obj.year + obj.month + obj.day;
			_.extend(this.param, obj);
		},
		
		ocrBack:function(){
			Client.ocrCheck("curView.getPhotoResBehind");
		},
		
		getPhotoResBehind : function(obj) {
			var html = '<img src="data:image/png;base64,'+obj.photoBase64+'" width="550" height="173">';
			$("#b .idcard").html(html);
			$("#b").addClass("ag");
			Client.hideWaitPanel(1);
			this.param.photoBackBase64 = obj.photoBase64;
			this.param.authority = obj.authority;
			this.param.validDate = obj.validDate;
		},
		
		next : function(){
			if(!this.param.photoBase64){
				Utils.alertinfo("请扫描身份证正面");
				return;
			}
			if(!this.param.photoBackBase64){
				Utils.alertinfo("请扫描身份证反面");
				return;
			}
    		Client.openWaitPanel("加载中");
    		var $this=this;
    		var param = {
    				userName:this.param.userName,
    				certNo:this.param.certNo,
    				photoBackBase64:this.param.photoBackBase64,
					photoBase64:this.param.photoBase64,
					customerSex:this.param.gender=='男'?'M':'F',
					customerBirthday:this.param.birth,
					customerAddress:this.param.address,
					customerRace:this.param.people,
					organ:this.param.authority,
    				validity:this.param.validDate.split('-')[1]
    		};
    		Ajax({url:"/batchacc/userInfoInput",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					App.navigate("userRegister/userRegisterCtl/batchAccResult",$this.param);
    			}else{
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}
    		}});
		
  	    },
		
  	    goBack : function(){
  	    	Client.openWaitPanel("正在退出...");
	  		Client.logOut("curView.cleanSession");
  	    },
  	    
  	  cleanSession : function(data){
			var ad = App.storage.get("adList");
			var aprShowMsg = App.storage.get("aprShowMsg");
			App.storage.clear();
			App.storage.set("adList",ad);
			App.storage.set("aprShowMsg",aprShowMsg);
		}
  	    
	});
});