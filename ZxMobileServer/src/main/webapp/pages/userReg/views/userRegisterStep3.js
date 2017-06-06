define(function (require, exports, module) {

	var userRegisterStep3Template = require("text!../template/userRegisterStep3.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : userRegisterStep3Template,
        
        events:{
        	"keyup #input_alias,#input_email":"checkButton",
        	"blur #input_alias,#input_email":"checkButton",
        	"click #submitBtn":"doSubmit",     
        	"click #password1" : "password1",
        	"click #password2" : "password2",
        },
        
        initialize : function(params){
        	var pageTest = {
    			  	title:'资料完善',
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
				 type:'number',//text 字母与数字 number数字键盘
				 max:'6',
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
				 type:'number',//text 字母与数字 number数字键盘
				 max:'6',
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
        doSubmit : function(){ //为提交按钮绑定提交事件
			if($("#submitBtn").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
			var email = $('#input_email').val();
			var customerAlias = $('#input_alias').val();

			if (!this.checkUserAlias(customerAlias)){
				return;
			};

			if (!this.checkEmail(email)){
				return;
			};

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
			var alias = $('#input_alias').val();
			params = {
					customerAlias:alias
			};
    		Client.openWaitPanel("加载中");
			Ajax({ url: "/pubServer/checkUserAlias", data:params, success: function(data){
		    	if(data.errorCode == '-77072'){//别名已存在
			    	Utils.alertinfo("登录名已存在");	
		    		$('#input_alias').val();
		    		$this.checkButton();
   					Client.hideWaitPanel(1);
		    	}else{
		    		$this.toNext();
		    	}
		    }});
  		},
		toNext : function(){
    		var paramValue = App.storage.get("_parameters");//响应
			var email = $('#input_email').val();
			var customerAlias = $('#input_alias').val();
			
    		var param = {
					certNo:paramValue.certNo,
					userName:paramValue.userName,
					payPwd:this.pwd,
					pwdkey:this.pwdKey,
					customerEmail:email,
					mobileNo:paramValue.mobileNo,
					customerAlias:customerAlias,
					random:paramValue.random2,
					isFaceCheck:"false"
    		};
			var $this = this;
    		Ajax({url:"/regServer/mobRegisterStep3",data:param, success:function(data){
				$this.clearPwd();//重载随机数
    			if(MUI.isEmpty(data.errorCode)){
    				var customerId = data.customerId;
    				var param1 = {
    						zxCustomerId:customerId
    				};
    				Ajax({url:"/userSetting/createRandomNUm",data:param1, success:function(data){
    					if(MUI.isEmpty(data.errorCode)){
    						var recommendNum = data.cd.RecommendNum;
    						App.storage.set("recommendNum",recommendNum);
    						Client.menuOpt("0");
    	    				App.navigate("userReg/userRegCtl/userRegResult2");
    					}else if(data.errorCode == "EBLN0000"){
    						//游客无邀请码
    					}else{
    						Utils.alertinfo(data.errorMessage);
    					}
    					Client.hideWaitPanel(1);
    				}});
 
    			}else{
					if(data.errorCode=="-77336"){
						Client.alertinfo(data.errorMessage, "提醒","curView.goIndex()");
					}else{
				    	Utils.alertinfo(data.errorMessage);		  
					}
					Client.hideWaitPanel(1);
    			}
    		},error:function(){
				$this.clearPwd();//重载随机数
				Client.hideWaitPanel(1);
    		}});
    	},
  	   clearPwd : function(){
		  	$("#password1").val("");
		  	$("#password2").val("");
	 		 this.pwd = "";
	  		 this.pwd2 = "";
	  		 this.pwdKey = "";
 		     this.checkButton();
			Client.loadPwdKey();
 		},
    	gotoLogin : function(){
			Client.logOut();	
//    		App.navigate("login/loginCtl/login?type=account");
		},
 	    goBack : function(){
			App.back();
  	    },
 	    goIndex : function(){
    		App.navigate("index/index/index");
  	    },
		checkButton : function(){
			  //验证码开始进行匹配
			  (!Utils.isEmpty($('#input_alias').val())&&!Utils.isEmpty($('#input_email').val())&&!Utils.isEmpty(this.pwd)&&!Utils.isEmpty(this.pwd2)) ?
					    $("#submitBtn").removeClass('disabled').removeAttr('disabled') : $("#submitBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  

		},
		
		checkUserAlias : function(alias){
			if ( MUI.isEmpty(alias) ||Utils.containSpecial(alias)){
		    	Utils.alertinfo("登录名可由数字、字母组成");	
				return false;
			}else if((Utils.isInteger(alias)&&(alias.length==11 || alias.length==18)) || alias.indexOf('@')>-1){
		    	Utils.alertinfo("登录名不能为11或18位数字");	
				return false;
			}else{
				return true;
			}
		},
		
		//检查电子邮件
		checkEmail : function(email){
		  	if (MUI.isEmpty(email) || !Utils.isEmail(email)){
		    	Utils.alertinfo("请输入正确的电子邮箱");	
		  		return false;
		  	}else{
		  		return true;
		  	}
		},

	});
});