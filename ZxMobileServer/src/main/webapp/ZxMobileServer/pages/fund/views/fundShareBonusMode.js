define(function(require, exports, module) {

	var fundShareBonusModeTemplate = require("text!../template/fundShareBonusMode.html");

	var fundShareBonusModeInfoView = module.exports = ItemView.extend({
		
		template : fundShareBonusModeTemplate,
		
		events : {
			"click #sureModifyDivMode" : "sureModifyDivMode",
			"click #pwd" : "showPwd",
			},

		initialize : function() {
				var pageStep1 = {
					title : "分红方式",
					leftButton : {
						name : '返回',
						func : 'curView.goBack()'
					}

				};

				Client.initPageTitle(pageStep1);
				Client.hideWaitPanel(1);
				
				var divMode=App.storage.get("_parameters").divMode;
				if(divMode=="现金分红"){
					$("#cashShare").attr("checked","checked");
				}else{
					$("#divReinvest").attr("checked","checked");
				}
		},
		
		sureModifyDivMode :function(){
			var $this=this;
			if($("#sureModifyDivMode").hasClass("disabled")){
    			return;
    		}
			var cardNo = Utils.getEleCard().cardNo;
  			var accountType = Utils.getEleCard().accountType;
  			var fundCode=App.storage.get("_parameters").fundCode;
  			var divMode =$("input[name='radio']:checked").val();
  			
  			if(!$this.pwd||!$this.pwdKey){
  				if(	$('.ui-view').attr('data-position')!=0){
	     			return;
	     		}
    			Utils.alertinfo("请输入交易密码！");
    			return false;
    		}
  			
  			var param={
					cardNo:cardNo, 
					accountType:accountType,
					password:this.pwd, 
					pwdkey:this.pwdKey,
					fundCode:fundCode,
					divMode:divMode
				};
			Client.openWaitPanel("拼命加载中，请稍候");
  			Ajax({url:"/fund/modifyDivMode",data:param, success:function(data){//修改分红方式
					if(Utils.isEmpty(data.errorCode)){
						Utils.alertinfo("修改分红方式提交成功");
						App.navigate("fund/fundCtl/fundBuyAfterDetail");
						Client.hideWaitPanel(1);
						$this.clearPwd();
					}else{
//						Utils.alertinfo("修改分红方式提交失败");
//						App.navigate("fund/fundCtl/fundBuyAfterDetail");
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
		
		 showPwd : function(){
				Utils.focusPosition($("#pwd").parent());
				var opt = {
					elem:"#pwd",//当前对像
					type:'number',//text 字母与数字 number数字键盘
					max:'6',
					callback:'curView.savePassword'
				};
				Client.showPwdPicker(opt);//显示安全键盘
			},
			
		savePassword : function(obj){
			this.pwd = obj.pwd;
			this.pwdKey = obj.pwdKey;
			this.formValidate();
		},
		
		clearPwd : function(){
    		$("#pwd").val("");
    		this.pwdKey = null;
    		this.pwd = null;
			Client.loadPwdKey();//通知重载随机数
			this.formValidate();
    	},
		
    	formValidate:function(){
    		if(this.pwd && this.pwdKey && $("#pwd").val().length>=6){
    			$("#sureModifyDivMode").removeClass("disabled");
    		}else{
    			$("#sureModifyDivMode").addClass("disabled");
    		}
    	},
    	
		goBack : function(){
        	App.back();
    	},
	});
});