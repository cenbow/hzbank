define(function(require, exports, module){
	
	var elecAccPwdResetQueryTpl = require("text!../template/elecAccPwdResetQuery.html");
	var elecAccPwdResetQueryView = module.exports = ItemView.extend({
		
	template : elecAccPwdResetQueryTpl,
	
	events:{
		"click .resetBtn":"resetBtn",		
	},
	initialize : function(){
		var pageStep1 = {
			  	title:'交易密码申请查询',
				leftButton:{
					name : '返回',
					func: 'curView.goBack()'
//				},
//				rightButton:{
//					name : '帮助',
//					func : 'curView.help()'
				}
		  };
		 Client.initPageTitle(pageStep1);
		 
// 		var padd = pubParam.clientHeight/2;
//		$("#noData").css("padding", padd + 'px 0');
//		
		 this.init();

	},

	init : function(){
    	var $this=this;
    	var param = {
    			pageFlag:'0',
    			turnPageBeginPos:'0',
    			turnPageShowNum:'20',
    			operationType:'1'
    		};
		Client.openWaitPanel("拼命加载中，请稍候");
    	Ajax({url:"/pubServer/resetTransPwdQuery",data:param,success:function(data){
			if(MUI.isEmpty(data.errorCode)){
				var icoll = data.iPwdResetList;
				if(icoll.length <=0){
					$("#noData").show();
					$("#signListDiv").hide();
				}else{
					$("#noData").hide();
					$("#signListDiv").show();
				}
				for(var i=0;i<icoll.length;i++){
					var kcoll = icoll[i];
					$this.addRow(kcoll);
				}
				App.storage.set("signList",icoll);
			}else{
				Utils.alertinfo(data.errorMessage);
			}
			Client.hideWaitPanel(1);

    	}});
    },
    addRow : function(kcoll){
    	var keyId = kcoll.keyId;
    	var applyDate = kcoll.applyDate;
    	var auditDate = kcoll.auditDate;
    	var validDate = kcoll.validDate;
    	var tradeStatus = kcoll.tradeStatus;
    	var applyNo = kcoll.applyNo;
    	var remark = kcoll.remark;
    	
    	var tradeStatusClass = "state ";
    	var html ="";
    	if(tradeStatus == '1'){
    		tradeStatus = "待审批";
    		validDate = '— —';
    	}else if(tradeStatus == '2'){
    		if(Utils.getDifferentDate(-validDate, 'yyyyMMddhhmmss') < auditDate){
    			tradeStatus = "审批通过";
    			html = '<div class="resetBtn">密码重置</div>';
    		}else{
    			tradeStatus = "审批失效";
        		validDate = '— —';
        		tradeStatusClass = tradeStatusClass+"done";
    		}		
    	}else if(tradeStatus == '3'){
    		tradeStatus = "未通过";
    		validDate = '— —';
    		tradeStatusClass = tradeStatusClass+"done";
    	}else if(tradeStatus == '4'){
    		tradeStatus = "审批作废";
    		validDate = '— —';
    		tradeStatusClass = tradeStatusClass+"done";
    	}else if(tradeStatus == '5'){    		 
    		tradeStatus = "已重置";
    		validDate = '— —';
    		tradeStatusClass = tradeStatusClass+"done";
    	}
    	
    	if(Utils.isEmpty(remark)){
    		remark = '— —';
    	}
    	
    	if(Utils.isEmpty(auditDate)){
    		auditDate = '— —';
    	}else{
    		auditDate = Utils.formatDate(auditDate,'yyyyMMddhhmmss','yyyy-MM-dd hh:mm:ss');
    	}
    	
		$("#signList").append( '<li>'+
	        	'<div class="'+tradeStatusClass+'">'+tradeStatus+'</div>'+
	        	'<div class="ifo">'+
	            	'<p>申请号：'+keyId+'</p>'+
	                '<p>申请时间：'+Utils.formatDate(applyDate,'yyyyMMddhhmmss','yyyy-MM-dd hh:mm:ss')+'</p>'+
	                '<p>审核时间：'+auditDate+'</p>'+
	                '<p>有效期：'+validDate+' 天</p>'+
	                '<p>审批说明：'+remark+'</p>'+
	            '</div>'+html+
	        '</li>');
	},  
	goBack : function(){
		App.back();
	},	
	resetBtn : function(){
		App.navigate("settings/setCenterCtl/elecAccPwdResetThree",true);
	}	
	});
});
