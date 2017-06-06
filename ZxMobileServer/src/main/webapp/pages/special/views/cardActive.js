define(function(require, exports, module){
	
	var cardActiveTpl = require("text!../template/cardActive.html");
	
	var cardActiveView = module.exports = ItemView.extend({
		
		events : {
			"click .camera" : "ocrBankCard",
			"click #pwd" : "showpwd",
			"click #pwdC" : "showpwdC",
			"click #pwdN" : "showpwdN",
			"click #submit" : "cardActivate",
			"click #back" : "back"
		},
		
		template : cardActiveTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    
		    Client.hideWaitPanel(1);
		},
		
		cardActivate : function(){
			var cardNo = $("#cardNo").val();
			if(!cardNo){
				Utils.alertinfo("请输入卡号！");
				return;
			}
			if(!this.pwd){
				Utils.alertinfo("请输入取款密码！");
				return;
			}
			
			if(!this.pwdC){
				Utils.alertinfo("请确认密码！");
				return;
			}
			
			Client.pwdConfirm("curView.cardActivateBack");
		},
		
		cardActivateBack : function(msg){
			if(msg=="0"){//密码不相等
	    		   this.pwdC="";
	    		   $("#pwdC").val("");
	    		   return;
	    	}
			var param = {
					"userName":this.model.get("userName"),
					"certNo":this.model.get("certNo"),
					//"userName":"阿三",
					//"certNo":"330521198308293121",
					"cardNo":$("#cardNo").val(),
//					"cardNo":"623061571014810274",
					"pwdKey":this.pwdKey,
					"passwordNew":this.pwdN,
					"passwordOld":this.pwd
				};
			var $this = this;
			Client.openWaitPanel("请稍候");
			Ajax({url:"/specialFinance/changeCardActivate",data:param,
				success : function(data) {
					$this.clearPwd();
					Client.hideWaitPanel(1);
					if(data.errorCode){
						Utils.alertinfo(data.errorMessage);
					}else{
						$(".idc-result").show().siblings(".gap-box").hide().siblings("ul").hide();
					}
				},error : function(data) {
					$this.clearPwd();
				}
			});
		},
		
		showpwd : function(){
			Utils.focusPosition($("#pwd").parent(),100);
			var opt = {
					elem:"#pwd",//当前对像
					type:'number',//text 字母与数字 number数字键盘
					max:'6',
					callback:'curView.savePassword'
				};
				Client.showPwdPicker(opt);
		},
		
		savePassword : function(obj){
			this.pwd = obj.pwd;
			this.pwdKey = obj.pwdKey;
		},
		
		showpwdN : function(){
			Utils.focusPosition($("#pwdN").parent(),100);
			var opt = {
					elem:"#pwdN",//当前对像
					type:'number',//text 字母与数字 number数字键盘
					max:'6',
					callback:'curView.savePasswordN',
					confirm:'1'
				};
				Client.showPwdPicker(opt);
		},
		
		savePasswordN : function(obj){
			this.pwdN = obj.pwd;
			this.pwdKey = obj.pwdKey;
		},
		
		showpwdC : function(){
			Utils.focusPosition($("#pwdC").parent(),100);
			var opt = {
					elem:"#pwdC",//当前对像
					type:'number',//text 字母与数字 number数字键盘
					max:'6',
					callback:'curView.savePasswordC',
					confirm:'2'
				};
				Client.showPwdPicker(opt);
		},
		
		savePasswordC : function(obj){
			this.pwdC = obj.pwd;
		},
		
		clearPwd : function(){
		  	$("#pwd").val("");
		  	$("#pwdC").val("");
		  	$("#pwdN").val("");
	 		 this.pwd = "";
	  		 this.pwdN="";
	  		 this.pwdKey = "";
			Client.loadPwdKey();
	  	},
	  	
		ocrBankCard : function(){
			Client.ocrBankCard("curView.cardRes");
		},
		
		cardRes : function(num){
			$("#cardNo").val(num);
			//$(".idc-area").attr("data-title","点击重新识别银行卡");
		},
		
		back : function(){
			App.navigate("special/specialCtl/special");
		},

		cancel : function(){
			Client.menuOpt("5");
			var index = App.browseList.indexOf("special/specialCtl/special");
    	  	App.browseList.splice(1,index-1);
			App.back();
		},
		
		goBack : function(){
			App.back();
		}
	
	});
});
