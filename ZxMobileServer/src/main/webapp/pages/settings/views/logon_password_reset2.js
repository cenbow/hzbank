define(function (require, exports, module){
	 
	var logonPasswordReset2Template = require("text!../template/logon_password_reset2.html");
	var fPassword = "";
	var fPassword2 = "";
	var vBasis='PB1113';
	var pwdkey = "";
	var logonPasswordReset2View = module.exports = ItemView.extend({
		
        template : logonPasswordReset2Template,
        
        events:{
        	"click #password":"getPassword",
        	"click #password2":"getPassword2",
        	"blur #input_name":"checkName",
        	"blur #input_certNo":"checkCertNo18",
        	"keyup #input_name, #input_certNo":"checkButton",
        	"blur #input_name, #input_certNo":"checkButton",
        	"click #nextButton1":"doReset"
        },
        
        initialize : function(params){
        	
        	var pageTest = {
    			  	title:'忘记密码',
    				leftButton:{
    					name : '返回',
    					func :'App.back()'
    				},
    				rightButton:{
    					name : '帮助',
    					func : 'curView.help()'
    				}
    			  };
        	
        	Client.initPageTitle(pageTest);
        	Client.hideWaitPanel(1);
        },
        checkName : function(){
        	var simCN = $('#input_name').val();
    		if(MUI.isEmpty(simCN)){
    			Utils.alertinfo("请输入中文姓名");
    			return false;
    		}else if(Utils.containSpecial(simCN)){
    			Utils.alertinfo("您输入的中文姓名有误，请重新输入");
    			return false;
    		}
		},
		getPassword : function(){
			Utils.focusPosition($("#password").parent());
			var opt = {
					elem:"#password",//当前对像
					type:'text',//text 字母与数字 number数字键盘
					max:'20',
					callback:'curView.savePassword',
					confirm:'1'
			};
			Client.showPwdPicker(opt);
		},
		savePassword : function(data){
			 fPassword = data.pwd;
			 pwdKey = data.pwdKey;
			 this.checkButton();
		},
		getPassword2 : function(){
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
			fPassword2 = data.pwd;
			this.checkButton();
		},
		checkButton : function(){
			(!MUI.isEmpty($('#input_name').val()) && !MUI.isEmpty($('#input_certNo').val()) && !MUI.isEmpty(fPassword)&& !MUI.isEmpty(fPassword2))
			? $("#nextButton1").removeClass('disabled').removeAttr('disabled') : $("#nextButton1").addClass('disabled').attr('disabled',true);								
		},
		checkCertNo18 : function(){
			var certNo = $('#input_certNo').val();
			if (MUI.isEmpty(certNo)){
				Utils.alertinfo("您的身份证号不能为空！");
		    	return false;
			}else if(Utils.containSpecial(certNo) || certNo.length!=18){
		    	Utils.alertinfo("您输入的身份证号有误，请重新输入");
		    	return false;
			}else{
				if(certNo.substring(17,18) == 'x'){
					certNo= certNo.substring(0,17)+'X';
					$('#input_certNo').val(certNo);
				}
				if(Utils.IdentityCodeValid(certNo)){
					return true;
				}else{
					Utils.alertinfo("您输入的身份证号有误，请重新输入");		
					return false;
				}
				return true;
			}
		},
		doReset : function(){
			if($("#nextButton1").attr('disabled')){ //确定按钮可点击
				return;
			}
		    if (!this.checkCertNo18()){
	    		 return;
	    	}
			Client.pwdConfirm("curView.confirmback");
		},
		confirmback : function(data){
      		var $this = this;
	    	   if(data=="0"){//密码不相等
	    		   fPassword2="";
	    		   $("#password2").val("");
	    		   this.checkButton();
	    		   return;
	    	   }
	    	var vCode = App.storage.get("_parameters").vCode;
	    	var mobileNo = App.storage.get("_parameters").mobileNo;
	    	var random2 =  App.storage.get("randomInfo").random2;
			 //发送短信验证码
		 	var param ={
		 			userName:$('#input_name').val(),
		 			certNo:$('#input_certNo').val(),
		 			password: fPassword,
					mobileNo:mobileNo,
					vCode:vCode,
					pwdkey:pwdKey,
					vBasis:vBasis,
					random2:random2
			};
		 	Client.openWaitPanel("拼命加载中，请稍候");
			 Ajax({url:"/pubServer/resetLogonPwd2", data:param, success:function(data){
				 $this.clearPwd();//重载随机数
				 Client.hideWaitPanel();
				 if(MUI.isEmpty(data.errorCode)){
						Client.alertinfo("密码重置成功！", "提醒","curView.goBack()");
				 }else{
					 Utils.alertinfo(data.errorMessage);
				 };
			},error:function(){
				$this.clearPwd();//重载随机数
			}});
		},
        goBack : function(){
			App.back(2);
		},
		clearPwd : function(){
    		$("#password").val("");
    		$("#password2").val("");
    		pwdKey = null;
    		fPassword = null;
    		fPassword2 = null;
			Client.loadPwdKey();
    	},
        help : function(){
        	App.navigate("anymore/anymoreCtl/messageCenter");
        }
	});
});