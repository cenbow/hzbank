define(function (require, exports, module) {

	var userRegisterStep4Template = require("text!../template/userRegisterStep4.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : userRegisterStep4Template,
        
        events:{
//        	"click #nextButton4":"doNext",     
        	"click #password1" : "password1",
        	"click #password2" : "password2",
        },
        
        initialize : function(params){
        	var pageTest = {
    			  	title:'注册',
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
    		
    		// 设置密码框动态高度
    		var iptRow = $('.tradePswd .row');
    		var ht = iptRow.width()/6;
    		iptRow.css({
    			height: ht + 'px',
    			lineHeight: ht + 'px'
    		});
    		  
    		this.step=1;
    		this.password1();
        },
        fixL : function(n,idName){
			n > 6 ? n = 6 : null;
			for(var i = 0; i<6; i++){
				i+1 > n ? 
				$('#tradePswd'+idName+' .cell').eq(i).removeClass('active') :
				$('#tradePswd'+idName+' .cell').addClass('active');
			}
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
		 this.pwdDeal("1");
		 this.doNext();
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
		 this.pwdDeal("2");
		 this.doSubmit();
       },
		pwdDeal:function(idName){
			var me = $("#password"+idName);	
			var s = me.val();
			s.length > 6 ? s = s.substring(0, 6) : null;
			me.val(s);	
			this.fixL(s.length,idName);
		},

 	    goBack : function(){
 	    	if(this.step==2){
         	   $(".pswdAll").removeClass("nxt");
       		    this.step=1;
       		    this.pwd = "";
       		    this.pwdKey = "";
       		    $("#password1").val("");
       		    this.password1();
 	    	}else{
 				App.back();
 	    	}
  	    },
		
		//下一步
        doNext : function(){ //为提交按钮绑定提交事件
           var password=$("#password1").val();
           if(!Utils.isEmpty(password)&&password.length==6){        	   
        	   $(".pswdAll").addClass("nxt");
      		    this.step=2;
       		    this.pwd2 = "";
       		    $("#password2").val("");
       		   this.password2();
           }
		},
		
		 //提交
        doSubmit : function(){ //为提交按钮绑定提交事件
            var password=$("#password2").val();
            if(!Utils.isEmpty(password)&&password.length==6){     	   
    			Client.pwdConfirm("curView.confirmback");
            }
		},
		confirmback : function(data){
		   var $this = this;
    	   if(data=="0"){//密码不相等
       		   $("#password1").val("");
       		   $("#password2").val("");
       		   this.pwdDeal("1");
       		   this.pwdDeal("2");
       		   this.pwd = "";
       		   this.pwd2 = "";
       		   this.pwdKey = "";
        	   $(".pswdAll").removeClass("nxt");
     		   this.password1();
    		   return;
    	   }

    	    Client.pwdHide("");
    	    var paramValue = App.storage.get("_parameters");//响应
    		var random = paramValue.random;

    	    var hongbaoStart = App.storage.get("hongbaoStart");
    	    if(!hongbaoStart){
    	    	paramValue.hongbaoStartTemp = "0";
    	    }else{
    	    	paramValue.hongbaoStartTemp = hongbaoStart.hongbaoStartTemp;
    	    }
    	    if(MUI.isEmpty(paramValue.pwdLogin)){
    	    	Utils.alertinfo("登录密码不能为空");	
    	    	return;
    	    }
			if(MUI.isEmpty(this.pwd)||MUI.isEmpty(this.pwd2)){
		    	Utils.alertinfo("交易密码不能为空");	
		    	return;
			}
			var customerAlias="";
			if(!MUI.isEmpty(paramValue.customerAlias)){
				customerAlias=paramValue.customerAlias;
			}
			var param = {
					certNo:paramValue.certNo,
					userName:paramValue.userName,
					password:paramValue.pwdLogin,
					payPwd:this.pwd,
					pwdkey:this.pwdKey,
					mobileNo:paramValue.mobileNo,
					customerAlias:customerAlias,
					random:random
			};
			var $this = this;
    		Client.openWaitPanel("加载中");
			Ajax({url:"/regServer/registerStep3",data:param, success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var cardNo = data.cardNo;
					var subTime = data.subTime;
					var activityFlag = data.activityFlag;
					paramValue.cardNo = cardNo;
					paramValue.subTime = subTime;
					paramValue.activityFlag = activityFlag;
					App.browParam[0] = paramValue;
					
					var param = {
							customerId : paramValue.mobileNo,
							pwdkey : $this.pwdKey,
							password : paramValue.pwdLogin,
							imageCodeKey : "UNCHECK",
							imageCode : ""
						};
						Ajax({url:"/userSign/signIn", data:param, 
							success:function(data){
								$this.clearPwd();//重载随机数
								Client.hideWaitPanel();
								if(data.errorCode){
									if(data.errorMessage.indexOf("无法获取交易代码")>=0){
										Utils.alertinfo("用户名或密码错");
										return false;
									}
									Utils.alertinfo(data.errorMessage);
								}else{
									$this.cleanSession();
									App.storage.set("UserInfo",data);
									Client.setClientInfo(data);
									MUI.Cache.save("userId",paramValue.mobileNo);						
									App.navigate("userRegister/userRegisterCtl/userRegisterResult",paramValue);
								}
							}
						});
						
				}else{
					if(data.errorCode=="-77336"){
						App.navigate("userRegister/userRegisterCtl/userRegisterResult2");

//						Client.alertinfo(data.errorMessage, "提醒","curView.goIndex()");
					}else{
				    	Utils.alertinfo(data.errorMessage);		  
					}
					$this.clearPwd();//重载随机数
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
	  	 this.pwdDeal("1");
	  	 this.pwdDeal("2");
		 this.pwd = "";
 		 this.pwd2 = "";
  		 this.pwdKey = "";
		 var paramValue = App.storage.get("_parameters");//响应
		 paramValue.pwdLogin="";
		 App.storage.set("_parameters",paramValue);
		 Client.loadPwdKey();
		 App.back();
   		},
   		cleanSession : function(){
    		var ad = App.storage.get("adList");
    		var aprShowMsg = App.storage.get("aprShowMsg");
    		App.storage.clear();
    		App.storage.set("adList",ad);
    		App.storage.set("aprShowMsg",aprShowMsg);
    	}
	});
});