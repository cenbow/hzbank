define(function(require, exports, module){
	
	var changeCardTpl = require("text!../template/changeCard.html");
	
	var changeCardView = module.exports = ItemView.extend({
		
		events : {
			"click #pwd" : "showpwd",
			"click #submit" : "submit",
			"click #back":"back"
		},
		
		template : changeCardTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			var nodeInfo = App.storage.get("nodeInfo");
			$("#cardType").on("change",function(){
				var $this = $(this);
				var options = '<option value="">请选择卡面 </option>';
				_.each(nodeInfo.iCardDetailInfo,function(temp,i){
					if($this.val()==temp.cardType)
						options+='<option value="'+temp.cardInfo+'">'+temp.cardInfoCN+'</option>';
				});
				$("#cardInfo").html(options);
			});
			
		    Client.hideWaitPanel(1);
		},
		
		submit : function(){
			
			if(this.model.get("transferFlag")!="0"){
				Utils.alertinfo("该卡号不允许做同卡号换卡");
				return;
			}
			
			var cardType = $("#cardType").val();
			if(!cardType){
				Utils.alertinfo("请选择介质类型！");
				return;
			}
			
			var cardInfo = $("#cardInfo").val();
			if(!cardType){
				Utils.alertinfo("请选择卡面类型！");
				return;
			}
			
			var phone = $("#phone").val();
			if(!phone){
				Utils.alertinfo("请输入手机号！");
				return;
			}
			
			if(!this.pwd||!this.pwdKey){
				Utils.alertinfo("请输入取款密码！");
				return;
			}
			
			var param = {
					"cardNo" : this.model.get("cardNo"),
					"password":this.pwd,
					"pwdKey":this.pwdKey,
					"pinKey" : "",
					"transAccountType" : cardType,
					"cardInfo" : cardInfo,
					"cardOpenNode" : this.model.get("nodeNo"),
					"phoneNumber": phone
				};
			var $this = this;
			Client.openWaitPanel("请稍候");
			Ajax({url:"/node/getChangeCardCertNo",data:param,
				success : function(data) {
					$this.clearPwd();
					Client.hideWaitPanel(1);
					if(data.errorCode){
						Utils.alertinfo(data.errorMessage);
					}else{
						$(".pass").html("同卡号换卡业务申请成功，申请编号："+data.certNo+" 请等待短信通知");
						$(".idc-result").show();
						$(".zen-list-2,.gap-box").hide();
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
		
		clearPwd : function(){
		  	$("#pwd").val("");
	 		 this.pwd = "";
	  		 this.pwdKey = "";
			Client.loadPwdKey();
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
