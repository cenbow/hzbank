define(function(require, exports, module){
	
	var queryEnsuerTpl = require("text!../template/queryEnsuer.html");
	
	var queryEnsuerView = module.exports = ItemView.extend({
		
		events : {
			"click #ensuerSubmit":"ensuerSubmit"
//				,
//			"click #hidePwdBox" : "hidePwdBox",
//			"click #pwd" : "password1"
		},
		
		template : queryEnsuerTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			var cardNo =App.storage.get("_parameters").cardNo;
        	var payAccountName =App.storage.get("_parameters").payAccountName;
        	var billkey =App.storage.get("_parameters").billkey;
        	var mobile = App.storage.get("UserInfo").regMobile;
        	
        	$("#cardNo").text(Utils.protectAcc(cardNo)+'(电子账户)');
        	$("#name").text(payAccountName);
        	$("#billKey").text(billkey);
        	$("#mobileNo").text(mobile);
        	
//        	this.init();
        	
			Client.hideWaitPanel(1);
		},
		
//		init : function(){
//			//获取随机加密因子
//			var param = {};
//			var $this = this;
//			Ajax({url:"/orderPay/getpassRandomKey",data:param, success:function(data){
//    			if(MUI.isEmpty(data.errorCode)){
//    				var pwdkey=data.cd.pwdkey;
//    				var pwdvalue=data.cd.pwdvalue;
//    				$this.pwdModel={
//    						pwdkey:pwdkey,
//    						pwdvalue:pwdvalue
//    				};
//    			}else{
//    				Utils.alertinfo(data.errorMessage);
//    			}
//    			Client.hideWaitPanel(1);
//    		}});
//		},
//		
//		fixL : function(n){
//			n > 6 ? n = 6 : null;
//			for(var i = 0; i<6; i++){
//				i+1 > n ? 
//				$('.tradePswd .cell').eq(i).removeClass('active') :
//				$('.tradePswd .cell').eq(i).addClass('active');
//			}
//		}, 
//  	   password1 : function(){
//			var opt = {
//				 elem:"#pwd",//当前对像
//				 type:'number',//text 字母与数字 number数字键盘
//				 max:'6',
//				 callback:'curView.savePassword',
//				 confirm:'1'
//			 };
//			 Client.showPwdPicker(opt);
//				 
//       },
//       savePassword : function(data){
//    	 this.pwd = data.pwd;
//    	 this.pwdKey = data.pwdKey;
//		 this.pwdDeal();
//		 this.doSubmit();
//       },
//       
//       getPassword : function(obj){
//    	   this.pwd = obj.pwd;
//      	 	this.pwdKey = obj.pwdKey;
////      	 	this.dosubmit();
//      	 	this.ensuerSubmit1();
//       },
//       
//		pwdDeal:function(){
//			var me = $("#pwd");	
//			var s = me.val();
//			s.length > 6 ? s = s.substring(0, 6) : null;
//			me.val(s);	
//			this.fixL(s.length);
//		},
//
//		 //提交
//        doSubmit : function(){ //为提交按钮绑定提交事件
//            var password=$("#pwd").val();
//            if(!Utils.isEmpty(password)&&password.length==6){     	   
//    			this.ensuerSubmit1();
//            }
//		},
//			hidePwdBox :function(){
//				$("#pwdText").hide();
//			},
			
		ensuerSubmit:function(){
			var $this=this;
	 		var cardNo =App.storage.get("_parameters").cardNo;
        	var payAccountName =App.storage.get("_parameters").payAccountName;
			var billKey =App.storage.get("_parameters").billkey;
			var projectCode = App.storage.get("_parameters").projectCode;
	 		var pageURL = "";
			
			var param = {
					"projectCode":projectCode,
					"billkey":billKey,
					"billkeyName":payAccountName,
					"tranAmt":'2000',
					"payAccount":cardNo,
					"payAccountName":payAccountName,
					"accountType":'1',
					"chanflag":'08',
					"recAccount":cardNo,
					"recAccountName":payAccountName,
					"pageURL":pageURL
			};
	 		Client.openWaitPanel("拼命加载中，请稍候");
	 		Ajax({url:"/fee/carEnsureAmtSubmit",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var notifyUrl = "/fee/carPayResultNotify";
					var feeTypeCode  = "12";
					var resultUrl   = "/fee/feeCtl/ensureResult";
					var confirmUrl = "/fee/hzpaytgOrderQuery";
					var param = {
    						amountTotal : data.amount,
    						userName:data.itemName,
    						notifyUrl:notifyUrl,
    						feeTypeCode:feeTypeCode,
    						resultUrl:resultUrl,
    						confirmUrl:confirmUrl
    				};
    				
//    				var param = {
//    						amountTotal : data.price,
//    						userName:data.itemName
//    				};
    				param = $.extend(param,data);
    				App.navigate("fee/feeCtl/carTuitionPay",param);
    				
//    				$this.checkOrder(param);
    				
    			}else{
    				Utils.alertinfo(data.errorMessage);
    			}
    		}});
		},
		
//		checkOrder:function(param){
//			var $this=this;
////			alert(JSON.stringify(param));
//			Ajax({url:"/orderPay/checkOrder",data:param, success:function(data){
//    			if(MUI.isEmpty(data.errorCode) || data.errorCode == '0'){
//    				alert("data.cd="+JSON.stringify(data.cd));
//    				$this.orderInfo = data.cd;
//    				$this.ensuerSubmit1(param);
//    			}else{
//    				Utils.alertinfo(data.errorMessage);
//    			}
//    			Client.hideWaitPanel(1);
//    		}});
//			
//		}, 
		
//		ensuerSubmit1:function(){
//			var $this=this;
//			
//
//			if(pubParam.clientVersion <= "3.0.8"){
//				$("#pwdText").show();
//				// 设置密码框动态高度
//				this.pwd = "";
//				var iptRow = $('.tradePswd .row');
//				var ht = iptRow.width()/6;
//				iptRow.css({
//					height: ht + 'px',
//					lineHeight: ht + 'px'
//				});
//				$("#pwd").focus();
//				this.password1();
//			}else{
//				//新版本有客户端输入交易密码
//				Client.setTransPwd("1",'请输入您的杭银直销交易密码','','curView.getPassword');
//			}
//			
//			Client.pwdHide("");
//			if(MUI.isEmpty(this.pwd)){
//		    	Utils.alertinfo("交易密码不能为空");	
//		    	return;
//			};
//	 		var cardNo =App.storage.get("_parameters").cardNo;
//        	var payAccountName =App.storage.get("_parameters").payAccountName;
//			var billKey =App.storage.get("_parameters").billkey;
//			var projectCode = App.storage.get("_parameters").projectCode;
//	 		
//			var param = {
//					"projectCode":projectCode,
//					"billkey":billKey,
//					"billkeyName":payAccountName,
//					"tranAmt":'2000',
//					"payAccount":cardNo,
//					"payAccountName":payAccountName,
//					"accountType":'1',
//					"chanflag":'08',
//					"recAccount":cardNo,
//					"recAccountName":payAccountName,
//					"password":this.pwd,
//					"pwdkey":this.pwdkey
//			};
//	 		Client.openWaitPanel("拼命加载中，请稍候");
//			Ajax({url:"/orderPay/hzPayOrder",data:param, success:function(data){
//    			if(MUI.isEmpty(data.errorCode)){
//    				var notifyMsg = data.cd.notifyMsg;
//					var param = {
//							"notifyMsg":notifyMsg || ""
//						};
//					if(data.tranState != "30"){
//						Ajax({url:"/fee/carPayResultNotify",data:param, success:function(data){
//			    			if(MUI.isEmpty(data.errorCode)){
//			    				
//			    				var statePram={
//			    						"state":data.state,
//			    						"hostErrorMessage":data.hostErrorMessage
//			    				};
//								App.storage.set("statePram",statePram);
//								App.navigate("fee/feeCtl/ensureResult");
//			    			}else{
//			    				var error={
//			    						"errorMessage":data.errorMessage
//			    				};
//								App.storage.set("error",error);
//								App.navigate("fee/feeCtl/result");
//			    			}
//			    		}});
//					}
//    			}else{
//    				var error={
//    						"errorMessage":data.errorMessage
//    				};
//					App.storage.set("error",error);
//					App.navigate("fee/feeCtl/result");
//    			}
//    		}});
//			
//		},
//		
//		clearPwd : function(){
//			$("#pwd").val("");
//			this.pwdDeal();
//			this.pwdKey = null;
//			this.pwd = null;
//			Client.loadPwdKey();
//		},
		
		goBack : function(){
			App.back();
		}
	
	});
});
