define(function(require, exports, module){
	
	var cardCheckTpl = require("text!../template/cardCheck.html");
	
	var cardCheckView = module.exports = ItemView.extend({
		
		events : {
			"click #pwd" : "showpwd",
			"click .idc-area" : "ocrBankCard",
			"click .camera" : "ocrBankCard",
			"click #submit" : "submit",
			"click #next" : "next"
		},
		
		template : cardCheckTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    
		    Client.hideWaitPanel(1);
		},
		
		submit : function(){
			
			if(!$("#cardNo").val()){
				Utils.alertinfo("请输入卡号！");
				return;
			}
			
			if(!this.pwd||!this.pwdKey){
				Utils.alertinfo("请输入取款密码！");
				return;
			}
			
			var sendStr = {
					"cardNo":$("#cardNo").val(),
					//"cardNo":"603367100133451852",
					"password":this.pwd,
					"certNo":App.storage.get("_parameters").certNo,
					//"certNo":"330126710202401",
					"pwdKey":this.pwdKey
			};
			//卡密验证
			var $this = this;
			Client.openWaitPanel("请稍候");
			Ajax({url:"/specialFinance/passwordCheckout",data:sendStr,
				success:function(data){
					$this.clearPwd();
					if(data.errorCode){
						Utils.alertinfo(data.errorMessage);
					}else{
						$this.customerId=data.customerId;
						if(data.resultCode=="-1"){
							Utils.alertinfo("该卡号不在当前业务白名单内");
						}else{
							$this.next();
						}
					}
					Client.hideWaitPanel(1);
				},error:function(msg){
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
		
		clearPwd : function(){
		  	$("#pwd").val("");
	 		 this.pwd = "";
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
		
		next : function(){
			var type = Utils.search().type;
			if(type == "cardChage"){
				var param={
						cardNo:$("#cardNo").val(),
						certNo:App.storage.get("_parameters").certNo
				};
				App.navigate("special/specialCtl/bankNode",param);
			}else{
				var param = {
					customerId:this.customerId,
					cardNo:$("#cardNo").val(),
					certNo:App.storage.get("_parameters").certNo,
				}
				App.navigate("special/specialCtl/financeRiskReq",param);
			}
		},

		cancel : function(){
			Client.menuOpt("5");
			var index = App.browseList.indexOf("special/specialCtl/special");
    	  	App.browseList.splice(1,index-1);
			App.back();
		},
		
		goBack : function(){
			App.back();
		},
		
	
	});
});
