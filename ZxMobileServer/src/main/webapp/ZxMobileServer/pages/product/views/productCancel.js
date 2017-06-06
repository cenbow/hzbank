define(function(require, exports, module){
	
	var productCancelTpl = require("text!../template/productCancel.html");
	
	var productCancelView = module.exports = ItemView.extend({
		
		template : productCancelTpl,
        events:{
        	"click #pwd" : "showPassword",
        	"click #cancelBtn" : "productCancel",
 
        },
			//定义日志TAG便于错误信息查找
        initialize : function(params){
        	var pageTest = {
    			  	title:'幸福金禧撤单',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				}
    			  };
    		this.password = "";
    		this.pwdkey = "";
    		Client.initPageTitle(pageTest);
    		Client.hideWaitPanel(1);
        },
        
    	showPassword : function(){
    		Utils.focusPosition($("#pwd").parent());
    		var opt = {
    			elem:"#pwd",//当前对像
    			type:'number',//text 字母与数字 number数字键盘
    			max:'6',
    			callback:'curView.savePassword'
    		};
    		Client.showPwdPicker(opt);
    	},
    	
    	savePassword : function(obj){
    		this.password = obj.pwd;
    		this.pwdkey = obj.pwdKey;
			this.checkButton();
    	},
    	checkButton : function(){
  		  //验证码开始进行匹配
  		  (!Utils.isEmpty(this.password)) ?
  				    $("#cancelBtn").removeClass('disabled').removeAttr('disabled') : $("#cancelBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
    	},
		goBack : function(type){
			if(App.browseList[1].indexOf("p2pDetail")>=0 && type==1){
				App.back(2);
			}else{
				App.back();
			}
		},
		
    	productCancel : function(){
    		if(MUI.isEmpty(this.password)){
				Utils.alertinfo("交易密码不能为空");
				return;
    		}
			var orderFlowNo=App.storage.get("_parameters").orderFlowNo;

			var param={
					orgTxNo:orderFlowNo,
					password:this.password, 
					pwdkey:this.pwdkey
			};
			var $this=this;
    		Client.openWaitPanel("加载中");
			Ajax({
				url : "/product/saleProductCancel",
				data : param,
				success : function(data) {
					if (MUI.isEmpty(data.errorCode)) {	
			        	if(!MUI.isEmpty(App.storage.get("iP2PRaisingList"))){
			        		App.storage.remove("iP2PRaisingList");
			        	};
    					if(!MUI.isEmpty(App.storage.get("paramAccount"))){
    						App.storage.set("totalP2P",App.storage.get("paramAccount").p2pSum);	
    						App.storage.remove("paramAccount");	
    					}  
    					if(!MUI.isEmpty(App.storage.get("balanceInfo"))){
    						App.storage.remove("balanceInfo");	
    					} 
						Client.alertinfo("该笔交易撤单成功！","提示","curView.goBack(1)",false);
					} else {
						Utils.alertinfo(data.errorMessage);
					}
					$this.clearPwd();
					Client.hideWaitPanel();
				},
				error : function() {
					$this.clearPwd();
					Client.hideWaitPanel();
					Utils.alertinfo("服务器异常！");
				}
			});
    	},
  	   clearPwd : function(){
		  	 $("#pwd").val("");
			 this.password = "";
	  		 this.pwdkey = "";
			 Client.loadPwdKey();
	   	},
	});
});
