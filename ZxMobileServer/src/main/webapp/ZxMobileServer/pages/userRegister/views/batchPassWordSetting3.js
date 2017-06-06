define(function (require, exports, module) {

	var batchPassWordSetting3Template = require("text!../template/batchPassWordSetting3.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : batchPassWordSetting3Template,
        
        events:{
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
	
			
			//test start
/*			App.navigate("userRegister/userRegisterCtl/batchAccResult",paramValue);
			return;*/
			//test end
			
			var param = {
					cardNo:Utils.getEleCard().cardNo,
					accountType:Utils.getEleCard().accountType,
					password:paramValue.pwdLogin,
					payPwd:this.pwd,
					pwdkey:this.pwdKey,
					random:paramValue.random,
					//random:"1=1",
					mobileNo:paramValue.mobileNo

			};
			var $this = this;
    		Client.openWaitPanel("加载中");
			Ajax({url:"/batchacc/reSetBatchAccPwd",data:param, success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					
			  			var UserInfo = App.storage.get("UserInfo");
			  			UserInfo.hasResetPwd = "11";
			  			App.storage.set("UserInfo",UserInfo);
						Client.setClientInfo(UserInfo);
						App.navigate("userRegister/userRegisterCtl/ocrCredit");
						
				}else{

				    Utils.alertinfo(data.errorMessage);		  
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
   		}
	});
});