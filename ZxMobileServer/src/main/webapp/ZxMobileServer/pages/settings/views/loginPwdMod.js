define(function(require, exports, module){
	
	var loginPwdModTpl = require("text!../template/loginPwdMod.html");
	 var passwordOld = ""; 
	 var passwordNew = "";	  
	 var passwordNew2 = "";	  
	 var pwdKey = "";
	 var loginPwdModView = module.exports = ItemView.extend({
		
	template : loginPwdModTpl,
	
	events:{
		"click #passwordOld":"pwdOld",
		"click #passwordNew":"pwdNew",
		"click #passwordNew2":"pwdNew2",
		"keyup #cardNo,#vcode":"checkButton1",
		"blur #cardNo,#vcode":"checkButton1",
		"click #submitBtn":"submit"
	},
	initialize : function(){
		var pageStep1 = {
			  	title:'登录密码修改',
				leftButton:{
					name : '返回',
					func: 'curView.goBack()'
//				},
//				rightButton:{
//					name : '帮助',
//					func : 'curView.help()'
				}
		  };
		 Client.initPageTitle(pageStep1);
		 Client.hideWaitPanel();
		 
		 var userInfo = App.storage.get("UserInfo");
		 this.cardNo = userInfo.iAccountInfo[0].cardNo;
		 this.mobileNo = Utils.trim(userInfo.regMobile);
		 
	},
	//原密码
	pwdOld:function(){
	  Utils.focusPosition($("#passwordOld").parent());
	  var opt = {
			 elem:"#passwordOld",//当前对像
			 type:'text',//text 字母与数字 number数字键盘
			 max:'20',
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
			 type:'text',//text 字母与数字 number数字键盘
			 max:'20',
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
			 type:'text',//text 字母与数字 number数字键盘
			 max:'20',
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
		 (!MUI.isEmpty(passwordOld) && !MUI.isEmpty(passwordNew)&& !MUI.isEmpty(passwordNew2)) ?
		 $("#submitBtn").removeClass('disabled').removeAttr('disabled') : $("#submitBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
	  },

	  //提交
	  submit:function(){ //为提交按钮绑定提交事件
			if($("#submitBtn").attr('disabled')){ //确定按钮可点击	
				return;
			 }
			Client.pwdConfirm("curView.confirmback");
			Client.hideWaitPanel(1);
		  },
       confirmback : function(data){
    	   if(data=="0"){//密码不相等
    		   passwordNew2="";
    		   $("#passwordNew2").val("");
    		   this.checkButton1();
    		   return;
    	   }
		 	var param ={
		 			mobileNo:this.mobileNo,
		 			cardNo:this.cardNo,
		 			passwordOld:passwordOld,
		 			passwordNew:passwordNew,
					pwdkey:pwdKey,
					logonType:"0"
			};
		 	var $this=this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/pubServer/modifyLogonPwd", data:param, success:function(data){
				$this.clearPwd();
				$this.checkButton1();
				 if(MUI.isEmpty(data.errorCode)){
				     Client.alertinfo("登录密码修改成功","提醒","curView.gotoSetCenter()");
				 }else{
			    	Utils.alertinfo(data.errorMessage);	
				 }
				 Client.hideWaitPanel(1);
			},error:function(){
				$this.clearPwd();
				$this.checkButton1();	
				Client.hideWaitPanel();
    		}});     
       },
		  
	gotoSetCenter:function(){
		App.back();
//		App.navigate("settings/setCenterCtl/security",true);
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
	    passwordOld = "";
	    passwordNew = "";
	    passwordNew2 = "";
	    pwdKey = "";
		Client.loadPwdKey();
	},
	});
});
