define(function(require, exports, module){
	
	var goldRevokeTpl = require("text!../template/goldRevoke.html");
	
	var goldRevokeView = module.exports = ItemView.extend({
		
		events : {
			"click #sureRevoke" : "sureRevoke",
			"click #pwd" : "showPassword",
			"click #back" : "goBack"
		},
		
		template : goldRevokeTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			this.pwd = "";
			this.pwdKey = "";
			Client.hideWaitPanel(1);
        	
        	var tranAmt =App.storage.get("_parameters").tranAmt;
        	var transferDate =App.storage.get("_parameters").transferDate;
        	var transferTime =App.storage.get("_parameters").transferTime;
        	$("#amt").text(tranAmt);
        	$("#transDate").text(transferDate+" "+transferTime);
		},
		
        
        sureRevoke :function(){
    		if($("#sureRevoke").hasClass("disabled")){
    			return;
    		}
        	var origQid =App.storage.get("_parameters").flowid;
        	var tranSign =App.storage.get("_parameters").tranSign;
			var cardNo = Utils.getEleCard().cardNo;
			var purchaseAmt = App.storage.get("_parameters").purchaseAmt;
  			
  			if(!this.pwd||!this.pwdKey){
  				if(	$('.ui-view').attr('data-position')!=0){
	     			return;
	     		}
  				Utils.alertinfo("请输入正确交易密码！");
    			return false;
    		}
  			
  			var param={
  					productId : Utils.getParamDisplay("PB_BOSERA", '3'),
					cardNo:cardNo,
					origQid:origQid,
					tranSign:tranSign,
					password:this.pwd, 
					pwdkey:this.pwdKey,
					purchaseAmt:purchaseAmt
				};
			var $this=this;
			Client.openWaitPanel("拼命加载中，请稍候");
  			Ajax({url:"/bosera/boseraAssetRevoke",data:param, success:function(data){//基金撤单
					if(Utils.isEmpty(data.errorCode)){
						Utils.alertinfo("撤单成功！");
						$this.goBack();
						$this.clearPwd();
					}else{
						Utils.alertinfo(data.errorMessage);
	    				Client.hideWaitPanel(1);
	    				$this.clearPwd();
	    				return;
	    			}
					
				},error:function(){
					Client.hideWaitPanel(1);
	    			$this.clearPwd();
	    		}});
		},
        
		showPassword : function(){
			Utils.focusPosition($("#pwd").parent(),100);
			$("#pwd").parent().addClass("focusState");
			var opt = {
				elem:"#pwd",//当前对像
				type:'number',//text 字母与数字 number数字键盘
				max:'6',
				callback:'curView.savePassword'
			};
			Client.showPwdPicker(opt);
		},
		
		savePassword : function(obj){
			this.pwd = obj.pwd;
			this.pwdKey = obj.pwdKey;
			this.formValidate();
		},
		
		clearPwd : function(){
    		$("#pwd").val("");
    		this.pwd = null;
    		this.pwdKey = null;
			Client.loadPwdKey();
			this.formValidate();
    	},
    	
    	formValidate:function(){
    		if(this.pwd && this.pwdKey && $("#pwd").val().length>=6){
    			$("#sureRevoke").removeClass("disabled");
    		}else{
    			$("#sureRevoke").addClass("disabled");
    		}
    	},
		goBack : function(){
    		App.back();
		}
	});
});
