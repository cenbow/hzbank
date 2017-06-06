define(function (require, exports, module) {

	var wxAddTransPasswordTemplate = require("text!../template/wxAddTransPassword.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : wxAddTransPasswordTemplate,
        
        events:{
        	"click #password1" : "password1",
        	"click #password2" : "password2",
        },
        
        initialize : function(params){
        	var pageTest = {
    			  	title:'交易密码设置',
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
    
    	    if(MUI.isEmpty(paramValue.pwdLogin)){
    	    	Utils.alertinfo("登录密码不能为空");	
    	    	return;
    	    }
			if(MUI.isEmpty(this.pwd)||MUI.isEmpty(this.pwd2)){
		    	Utils.alertinfo("交易密码不能为空");	
		    	return;
			}
			var sessionInfo = App.storage.get("UserInfo");
			var param = {
					cardNo:Utils.getEleCard().cardNo,
					accountType:Utils.getEleCard().accountType,
					password:paramValue.pwdLogin,
					payPwd:this.pwd,
					pwdkey:this.pwdKey,
					mobileNo:sessionInfo.regMobile

			};
			var $this = this;
    		Client.openWaitPanel("加载中");
			Ajax({url:"/wxUserSign/addWeiXinPassword",data:param, success:function(data){
				Client.hideWaitPanel(1);
				if(MUI.isEmpty(data.errorCode)){
					//修改登陆状态 21代表微信用户 且已经设置成交易密码
					var userInfo = App.storage.get("UserInfo");
					userInfo.hasResetPwd = "21";
					App.storage.set("UserInfo",userInfo); 
					$this.clearPwd();//重载随机数
					App.navigate("userRegister/userRegisterCtl/wxAddPasswordResult");
					
				}else{
				    Utils.alertinfo(data.errorMessage);	  
					$this.clearPwd();//重载随机数
					App.navigate("userRegister/userRegisterCtl/wxAddLoginPassword");
				}
			},error:function(){
				Utils.alertinfo("网络故障，请重新设置登录密码和交易密码");
				$this.clearPwd();//重载随机数
				Client.hideWaitPanel(1);
				App.navigate("userRegister/userRegisterCtl/wxAddLoginPassword");
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
   		}
	});
});