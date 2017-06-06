define(function (require, exports, module){
	 
	var transactionPwdResetTwoTemplate = require("text!../template/transactionPwdResetTwo.html");
	var fPassword = "";
	var fPassword2 = "";
	var vBasis='PB1110';
	var pwdkey = "";
	var transactionPwdResetTwoView = module.exports = ItemView.extend({
		
        template : transactionPwdResetTwoTemplate,
        
        events:{
        	"click #password":"getPassword",
        	"click #password2":"getPassword2",
        	"click #nextButton1":"doReset"
        },
        
        initialize : function(params){
        	
        	var pageTest = {
    			  	title:'交易密码重置',
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
			(!MUI.isEmpty(fPassword) && !MUI.isEmpty(fPassword2))
			? $("#nextButton1").removeClass('disabled').removeAttr('disabled') : $("#nextButton1").addClass('disabled').attr('disabled',true);								
		},
		doReset : function(){
			if($("#nextButton1").attr('disabled')){ //确定按钮可点击
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
	    	var vCode = App.storage.get("param").vCode;
	    	var userName = App.storage.get("param").userName;
	    	var certNo = App.storage.get("param").certNo;
	    	var random3 = App.storage.get("userRandom").random3;
	    	var cardNo = Utils.getEleCard().cardNo;
			 //发送短信验证码
		 	var param ={
		 			userName:userName,
		 			certNo:certNo,
		 			passwordNew: fPassword,
					vCode:vCode,
					pwdkey:pwdKey,
					vBasis:vBasis,
					cardNo:cardNo,
					random3:random3
			};
		 	Client.openWaitPanel("拼命加载中，请稍候");
			 Ajax({url:"/pubServer/resetTransactionPwd3", data:param, success:function(data){
				 $this.clearPwd();//重载随机数
				 $this.checkButton();
				 Client.hideWaitPanel();
				 if(MUI.isEmpty(data.errorCode)){
						Client.alertinfo("密码重置成功！", "提醒","curView.goBack()");
				 }else{
					 Utils.alertinfo(data.errorMessage);
				 };
			},error:function(){
				$this.checkButton();
				$this.clearPwd();//重载随机数
			}});
		},
		
        goBack : function(){
			App.back(3);
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