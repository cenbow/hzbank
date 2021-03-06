define(function (require, exports, module) {

	var batchPassWordSetting2Template = require("text!../template/batchPassWordSetting2.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : batchPassWordSetting2Template,
        
        events:{
        	"click #nextButton2":"doNext",     
        	"click #password1" : "password1",
        	"click #password2" : "password2",
        },
        
        initialize : function(params){
        	var pageTest = {
    			  	title:'密码设置',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				}
    			  };
    		Client.initPageTitle(pageTest);
    		
    		this.pwd = "";
    		this.pwd2 = "";
    		this.pwdKey = "";
    		Client.hideWaitPanel(1);
        },
  	   password1 : function(){
		   Utils.focusPosition($("#password1").parent());
			var opt = {
				 elem:"#password1",//当前对像
				 type:'text',//text 字母与数字 number数字键盘
				 max:'20',
				 callback:'curView.savePassword',
				 confirm:'1'
			 };
			 Client.showPwdPicker(opt);
				 
       },
       savePassword : function(data){
    	 this.pwd = data.pwd;
    	 this.pwdKey = data.pwdKey;
		 this.checkButton();
       },
       
       password2 : function(){
		   Utils.focusPosition($("#password2").parent());
			var opt = {
				 elem:"#password2",//当前对像
				 type:'text',//text 字母与数字 number数字键盘
				 max:'20',
				 callback:'curView.savePassword2',
				 confirm:'2'
			 };
			 Client.showPwdPicker(opt);
				 
       },
       savePassword2 : function(data){
      	 this.pwd2 = data.pwd;
  		 this.checkButton();
        },
 		 //第三步
        doNext : function(){ //为提交按钮绑定提交事件
			if($("#nextButton2").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
			Client.pwdConfirm("curView.confirmback");
		},
		confirmback : function(data){
		   var $this = this;
    	   if(data=="0"){//密码不相等
    		   this.pwd2="";
    		   $("#password2").val("");
    		   this.checkButton();
    		   return;
    	   }
    	   var paramValue=App.storage.get("_parameters");
    	   paramValue.pwdLogin = this.pwd;
    	   paramValue.pwdkey = this.pwdKey;
		   App.browParam[0] = paramValue;
		   App.navigate("userRegister/userRegisterCtl/batchPassWordSetting3",paramValue);

  		},
 	    goBack : function(){
			App.back();
  	    },
		checkButton : function(){
			  //验证码开始进行匹配
			  (!Utils.isEmpty(this.pwd)&&!Utils.isEmpty(this.pwd2)) ?
					    $("#nextButton2").removeClass('disabled').removeAttr('disabled') : $("#nextButton2").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  

		},

	});
});