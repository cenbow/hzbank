define(function(require, exports, module){
	
	var elecAccPwdModTpl = require("text!../template/elecAccPwdMod.html");
	 var validTime = 60;
	 var passwordOld = ""; 
	 var passwordNew = "";	  
	 var passwordNew2 = "";	  
	 var vcode = $('#vcode');	 
	 var vBasis='PB1101';
	 var pwdKey = "";
	 var ElecAccPwdModView = module.exports = ItemView.extend({
		
	template : elecAccPwdModTpl,
	
	events:{
		"click #passwordOld":"pwdOld",
		"click #passwordNew":"pwdNew",
		"click #passwordNew2":"pwdNew2",
		"keyup #cardNo,#vcode":"checkButton1",
		"blur #cardNo,#vcode":"checkButton1",
		"click #btn_sendSMS":"sendMessage",
		"click #submitBtn":"submit"
	},
	initialize : function(){
		var pageStep1 = {
			  	title:'交易密码修改',
				leftButton:{
					name : '返回',
					func: 'curView.goBack()'
				},
				rightButton:{
					name : '帮助',
					func : 'curView.help()'
				}
		  };
		 Client.initPageTitle(pageStep1);
		 Client.hideWaitPanel();
		 
		 var userInfo = App.storage.get("UserInfo");
		 this.cardNo = userInfo.iAccountInfo[0].cardNo;
		 this.customerNameCN = Utils.trim(userInfo.customerNameCN);
		 this.mobileNo = Utils.trim(userInfo.regMobile);
		 
		 $('#customerNameCN').text(this.customerNameCN);
		 $('#cardNo').text(this.cardNo);
		 
	},
	//原密码
	pwdOld:function(){
	  Utils.focusPosition($("#passwordOld").parent());
	  var opt = {
			 elem:"#passwordOld",//当前对像
			 type:'number',//text 字母与数字 number数字键盘
			 max:'6',
			 callback:'curView.passwordOld'
		 };
		 Client.showPwdPicker(opt);
	  },
	passwordOld:function(data){
		 passwordOld = data.pwd;
		 this.checkButton1();	
	 },
		//新密码
	 pwdNew:function(){
		Utils.focusPosition($("#passwordNew").parent());
		var opt = {
			 elem:"#passwordNew",//当前对像
			 type:'number',//text 字母与数字 number数字键盘
			 max:'6',
			 callback:'curView.passwordNew',
			 confirm:'1'
		 };
		 Client.showPwdPicker(opt);
	  },

	 passwordNew:function(data){
		 passwordNew = data.pwd;
		 pwdKey = data.pwdKey;
		 this.checkButton1();	
	 }, 
		//新密码
	 pwdNew2:function(){
		Utils.focusPosition($("#passwordNew2").parent());
		var opt = {
			 elem:"#passwordNew2",//当前对像
			 type:'number',//text 字母与数字 number数字键盘
			 max:'6',
			 callback:'curView.passwordNew2',
			 confirm:'2'
		 };
		 Client.showPwdPicker(opt);
	  },

	 passwordNew2:function(data){
		 passwordNew2 = data.pwd;
		 this.checkButton1();	
	 }, 
	 //验证输入信息
	 checkButton1:function(){
		  (!MUI.isEmpty($('#vcode').val())&&!MUI.isEmpty(passwordOld) && !MUI.isEmpty(passwordNew)&& !MUI.isEmpty(passwordNew2)) ?
				    $("#submitBtn").removeClass('disabled').removeAttr('disabled') : $("#submitBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
	  },
	//获取手机验证码
	  sendMessage:function(){
		  if($("#btn_sendSMS").attr('disabled')){ //确定按钮可点击
				return;
			}
		  
		  if(MUI.isEmpty(passwordOld)){
			  Utils.alertinfo("请输入原交易密码");	
			  return;
		  }
		  
		  if(MUI.isEmpty(passwordNew)){
			  Utils.alertinfo("请输入新交易密码");	
			  return;
		  }
		  
		  if(MUI.isEmpty(passwordNew2)){
			  Utils.alertinfo("请输入确认新交易密码");	
			  return;
		  }
		  
			$("#btn_sendSMS").addClass('disabled').attr('disabled',true);
			var param = {
					mobileNo:this.mobileNo,
					vBasis: vBasis
			};
			Ajax({url:"/mobile/send", data:param, success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var count = validTime;//60秒不允许再次发送
					var timerID = setInterval(function(){
						$('#btn_sendSMS').val(count + '秒后重新获取');
						count--;
						if(count == 0 || $('#btn_sendSMS').length==0){
							clearInterval(timerID);
							$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
							$('#btn_sendSMS').val('获取手机验证码');
						}
					},1000);
					$('#btn_sendSMS').val(count + '秒后重新获取');
					count--;
				}else{
					$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
				}
			},error:function(){
				$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
			}});
	  },
	  //提交
	  submit:function(){ //为提交按钮绑定提交事件
			if($("#submitBtn").attr('disabled')){ //确定按钮可点击	
				return;
			 }
			 if (MUI.isEmpty($('#vcode').val())){
			    	Utils.alertinfo("请输入短信验证码");	
					return;
			 }
			Client.pwdConfirm("curView.confirmback");
 
		  },
       confirmback : function(data){
    	   if(data=="0"){//密码不相等
    		   passwordNew2="";
    		   $("#passwordNew2").val("");
    		   this.checkButton1();
    		   return;
    	   }
		 	var param ={
		 			cardNo:this.cardNo,
		 			passwordOld:passwordOld,
		 			passwordNew:passwordNew,
		 			vCode:$('#vcode').val(),
					pwdkey:pwdKey,
					vBasis:vBasis
			};
			Client.openWaitPanel("拼命加载中，请稍候");
			var $this=this;
			Ajax({url:"/pubServer/modifyTransPwd", data:param, success:function(data){
				Client.hideWaitPanel();
				$this.clearPwd();
				$this.checkButton1();
				 if(MUI.isEmpty(data.errorCode)){
				     Client.alertinfo("交易密码修改成功","提醒","curView.gotoSetCenter()");
				 }else{
			    	Utils.alertinfo(data.errorMessage);	
				 }
			},error:function(){
				$this.clearPwd();
				$this.checkButton1();
				Client.hideWaitPanel();
    		}});    
       },
		  
	gotoSetCenter:function(){
		App.back();
	},
	help : function(){
		App.navigate("anymore/anymoreCtl/messageCenter",true);
	},
	goBack : function(){
		App.back();
	},
	clearPwd : function(){
		$("#passwordOld").val("");
	    $("#passwordNew").val("");
	    $("#passwordNew2").val("");
	    $("#vcode").val("");
	    passwordOld = "";
	    passwordNew = "";
	    passwordNew2 = "";
		pwdKey = "";
		Client.loadPwdKey();
	},
	});
});
