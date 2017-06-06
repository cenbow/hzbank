define(function(require, exports, module){
	
	var changeCardPwdTpl = require("text!../template/changeCardPwd.html");
	
	var changeCardPwdView = module.exports = ItemView.extend({
		
		events : {
			"click #pwd" : "showpwd",
			"click #pwdN" : "showpwdN",
			"click #pwdNc" : "showpwdNc",
			"click .camera" : "ocrBankCard",
			"click #pwdMod" : "pwdMod",
			"click #pwdReset" : "pwdReset",
			"click #back" : "back"
		},
		
		template : changeCardPwdTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    
		    Client.hideWaitPanel(1);
		    var $this = this;
		    $(".zen-switch-tab a").on("click",function(){
		    	$(".zen-switch-tab a").removeClass("active");
	    		$(this).addClass("active");
		    	var index = $(this).attr("data-value");
		    	$this.resetPwd();
		    	if(index == "2"){
		    		$(".change").hide();
		    		$(".reset").show();
		    	}else{
		    		$(".reset").hide();
		    		$(".change").show();
		    	}
		    });
		},
		
		ocrBankCard : function(){
			Client.ocrBankCard("curView.cardRes");
		},
		
		cardRes : function(num){
			$("#cardNo").val(num);
			//$(".idc-area").attr("data-title","点击重新识别银行卡");
		},
		
		pwdMod : function(){
			var cardNo = $("#cardNo").val();
			if(!cardNo){
				Utils.alertinfo("请输入卡号！");
				return;
			}
			if(!this.pwd){
				Utils.alertinfo("请输入旧密码！");
				return;
			}
			if(!this.pwdN){
				Utils.alertinfo("请输入新密码！");
				return;
			}
			
			if(!this.pwdNc){
				Utils.alertinfo("请确认新密码！");
				return;
			}
			
			Client.pwdConfirm("curView.confirmback");
		},
		
		confirmback : function(data){
			if(data=="0"){//密码不相等
	    		   this.pwdNc="";
	    		   $("#pwdNc").val("");
	    		   return;
	    	}
			Client.openWaitPanel("请稍候");
			var sendStr = {
					"userName":this.model.get("userName"),
					"certNo":this.model.get("certNo"),
					//"userName":"阿三",
					//"certNo":"330521198308293121",
					"cardNo":$("#cardNo").val(),
					//"cardNo":"623061571014810274",
					"pwdKey" : this.pwdKey,
					"passwordOld" : this.pwd,
					"passwordNew" : this.pwdN,
					"password" : this.pwdNc,
				};
				var $this = this;
				Ajax({url : "/specialFinance/changeCardChangePassword",data : sendStr,
					success : function(data) {
						$this.clearPwd();
						if(data.errorCode){
							Utils.alertinfo(data.errorMessage);
						}else{
							$(".idc-result").show().siblings("div").hide();
							$(".specBuz").show();
						}
						Client.hideWaitPanel(1);
					},error : function(data) {
						Client.hideWaitPanel(1);
						$this.clearPwd();
					}
				});
		},
		
		pwdReset : function(){
			var cardNo = $("#cardNo").val();
			if(!cardNo){
				Utils.alertinfo("请输入卡号！");
				return;
			}
			if(!this.pwdN){
				Utils.alertinfo("请输入新密码！");
				return;
			}
			
			if(!this.pwdNc){
				Utils.alertinfo("请确认新密码！");
				return;
			}
			
			Client.pwdConfirm("curView.resetBack");
		},
		
		resetBack : function(data){
			if(data=="0"){//密码不相等
	    		   this.pwdNc="";
	    		   $("#pwdNc").val("");
	    		   return;
	    	}
			Client.openWaitPanel("请稍候");
			var sendStr = {
				"userName":this.model.get("userName"),
				"certNo":this.model.get("certNo"),
				//"userName":"阿三",
				//"certNo":"330521198308293121",
				"cardNo":$("#cardNo").val(),
				//"cardNo":"623061571014810274",
				"pwdKey" : this.pwdKey,
				"password" : this.pwdN,
			};
			var $this = this;
			Ajax({url : "/specialFinance/changeCardResetPassword",data : sendStr,
				success : function(data) {
					$this.clearPwd();
					if(data.errorCode){
						Utils.alertinfo(data.errorMessage);
					}else{
						$(".pass").text("密码重置成功");
						$(".idc-result").show().siblings("div").hide();
						$(".specBuz").show();
					}
					Client.hideWaitPanel(1);
				},error : function(data) {
					Client.hideWaitPanel(1);
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
		
		showpwdNc : function(){
			Utils.focusPosition($("#pwdNc").parent(),100);
			var opt = {
					elem:"#pwdNc",//当前对像
					type:'number',//text 字母与数字 number数字键盘
					max:'6',
					callback:'curView.savePasswordNc',
					confirm:'2'
				};
				Client.showPwdPicker(opt);
		},
		
		savePasswordNc : function(obj){
			this.pwdNc = obj.pwd;
			this.pwdKey = obj.pwdKey;
		},
		
		clearPwd : function(){
		  	$("#pwd").val("");
		  	$("#pwdN").val("");
		  	$("#pwdNc").val("");
	 		 this.pwd = "";
	  		 this.pwdN = "";
	  		 this.pwdNc="";
	  		 this.pwdKey = "";
			Client.loadPwdKey();
	  	},
	  	
	  	resetPwd : function(){
		  	$("#pwd").val("");
		  	$("#pwdN").val("");
		  	$("#pwdNc").val("");
	 		 this.pwd = "";
	  		 this.pwdN = "";
	  		 this.pwdNc="";
	  		 this.pwdKey = "";
	  	},
	  	
		goBack : function(){
			App.back();
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
		
		facecheck : function(){
			App.navigate("special/specialCtl/facecheck");
		}
	
	});
});
