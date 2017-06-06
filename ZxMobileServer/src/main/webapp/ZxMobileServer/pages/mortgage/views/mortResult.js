define(function(require, exports, module){
	
	var mortResultTpl = require("text!../template/mortResult.html");
	
	var MortResultView = module.exports = ItemView.extend({
		
		events : {
			"click #upLoad,#upLoad2":"upLoad",
			"click #bank1" : "bank1",
			"click #bank2" : "bank2",
			"click #bank3" : "bank3",
			"click #bank4" : "bank4",
			"click #bank5" : "bank5",
			"click #bank6" : "bank6",
			"click #bank7" : "bank7"
		},
		
		template : mortResultTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    this.init();
		    Client.hideWaitPanel(1);
		},
		
		init : function(){
			var applyStatusName = App.storage.get("applyDataInfo").applyStatusName;
			var applyStatus = App.storage.get("applyDataInfo").applyStatus;
			if(applyStatusName=="已受理"){
				$("#loan1").show();
				$("#loan2").hide();
				$("#loan3").hide();
				$("#loan4").hide();
				$("#loan5").hide();
				$("#loan6").hide();
				$("#loan7").hide();
				this.initPage1();
			}else if(applyStatusName=="未提交"){
				App.navigate("mortgage/mortgageCtl/mortMore");
			}else if(applyStatusName=="审批通过"){
				$("#loan1").hide();
				$("#loan2").show();
				$("#loan3").hide();
				$("#loan4").hide();
				$("#loan5").hide();
				$("#loan6").hide();
				$("#loan7").hide();
				this.initPage2();
			}else if(applyStatusName=="申请关闭"){
				$("#loan1").hide();
				$("#loan2").hide();
				$("#loan3").show();
				$("#loan4").hide();
				$("#loan5").hide();
				$("#loan6").hide();
				$("#loan7").hide();
				this.initPage3();
			}else if(applyStatusName=="已完成"){
				$("#loan1").hide();
				$("#loan2").hide();
				$("#loan3").hide();
				$("#loan4").show();
				$("#loan5").hide();
				$("#loan6").hide();
				$("#loan7").hide();
				this.initPage4();
			}else if(applyStatusName=="审批失败"){
				$("#loan1").hide();
				$("#loan2").hide();
				$("#loan3").hide();
				$("#loan4").hide();
				$("#loan5").show();
				$("#loan6").hide();
				$("#loan7").hide();
				this.initPage5();
			}else if(applyStatusName=="已提交"){
				$("#loan1").hide();
				$("#loan2").hide();
				$("#loan3").hide();
				$("#loan4").hide();
				$("#loan5").hide();
				$("#loan6").show();
				$("#loan7").hide();
				this.initPage6();
			}else if(applyStatusName=="受理成功"){
				if(applyStatus=="11"){
					$("#result1").hide();
					$("#result2").show();
					$("#result3").hide();
					$("#result4").show();
				}else{
					$("#result1").show();
					$("#result2").hide();
					$("#result3").show();
					$("#result4").hide();
				}
				$("#loan1").hide();
				$("#loan2").hide();
				$("#loan3").hide();
				$("#loan4").hide();
				$("#loan5").hide();
				$("#loan6").hide();
				$("#loan7").show();
				this.initPage7();
			}
		},
		
		initPage1 : function(){//确定页面
        	var pageStep1 = {
            		title:'已受理',
            		leftButton:{
            			name : '返回',
            			func: 'curView.goBack()'
            		},
            		rightButton:{
            			name : ''
            		}
            	};
            Client.initPageTitle(pageStep1);
    	},
    	
    	initPage2 : function(){//确定页面
        	var pageStep2 = {
            		title:'审批通过',
            		leftButton:{
            			name : '返回',
            			func: 'curView.goBack()'
            		},
            		rightButton:{
            			name : ''
            		}
            	};
            Client.initPageTitle(pageStep2);
            var authAmount = Utils.formatCurrency(App.storage.get("applyDataInfo").authAmount,2);//授信金额
			var applyDeadline = App.storage.get("applyDataInfo").applyDeadline;//贷款期限
			
			
			if(applyDeadline=="02"){
				applyDeadline="6个月";
			}else if(applyDeadline=="03"){
				applyDeadline="12个月";
			}else if(applyDeadline=="04"){
				applyDeadline="2年";
			}else if(applyDeadline=="05"){
				applyDeadline="3年";
			}else if(applyDeadline=="06"){
				applyDeadline="4年";
			}else if(applyDeadline=="07"){
				applyDeadline="5年";
			}
			var creditRepayType = App.storage.get("applyDataInfo").creditRepayType1;//还款方式
			if(creditRepayType=="401"){
				creditRepayType="循环";
			}else{
				creditRepayType="分期";
			}
			var loanRate = App.storage.get("applyDataInfo").loanRate;//贷款利率
			$("#applyAmount").text(authAmount*1);
			$("#applyAmount1").text( Utils.formatCurrency(authAmount*10000,2));
			$("#applyDeadline1").text(applyDeadline);
			$("#creditRepayType1").text(creditRepayType);
			$("#loanRate1").text(loanRate+"‰");
			
			
    	},
    	
    	initPage3 : function(){//确定页面
        	var pageStep3 = {
            		title:'申请关闭',
            		leftButton:{
            			name : '返回',
            			func: 'curView.goBack()'
            		},
            		rightButton:{
            			name : ''
            		}
            	};
            Client.initPageTitle(pageStep3);
            var authAmount = Utils.formatCurrency(App.storage.get("applyDataInfo").authAmount,2);//授信金额
			var applyDeadline = App.storage.get("applyDataInfo").applyDeadline;//贷款期限
			if(applyDeadline=="02"){
				applyDeadline="6个月";
			}else if(applyDeadline=="03"){
				applyDeadline="12个月";
			}else if(applyDeadline=="04"){
				applyDeadline="2年";
			}else if(applyDeadline=="05"){
				applyDeadline="3年";
			}else if(applyDeadline=="06"){
				applyDeadline="4年";
			}else if(applyDeadline=="07"){
				applyDeadline="5年";
			}
			var creditRepayType = App.storage.get("applyDataInfo").creditRepayType1;//还款方式
			if(creditRepayType=="401"){
				creditRepayType="循环";
			}else{
				creditRepayType="分期";
			}
			var loanRate = App.storage.get("applyDataInfo").loanRate;//贷款利率
			$("#applyAmount3").text( Utils.formatCurrency(authAmount*10000,2));
			$("#applyDeadline3").text(applyDeadline);
			$("#creditRepayType3").text(creditRepayType);
			$("#loanRate3").text(loanRate+"‰");
    	},
    	initPage4 : function(){//确定页面
        	var pageStep4 = {
            		title:'已完成',
            		leftButton:{
            			name : '返回',
            			func: 'curView.goBack()'
            		},
            		rightButton:{
            			name : ''
            		}
            	};
            Client.initPageTitle(pageStep4);
            var authAmount = Utils.formatCurrency(App.storage.get("applyDataInfo").authAmount,2);//授信金额
			var applyDeadline = App.storage.get("applyDataInfo").applyDeadline;//贷款期限
			if(applyDeadline=="02"){
				applyDeadline="6个月";
			}else if(applyDeadline=="03"){
				applyDeadline="12个月";
			}else if(applyDeadline=="04"){
				applyDeadline="2年";
			}else if(applyDeadline=="05"){
				applyDeadline="3年";
			}else if(applyDeadline=="06"){
				applyDeadline="4年";
			}else if(applyDeadline=="07"){
				applyDeadline="5年";
			}
			var creditRepayType = App.storage.get("applyDataInfo").creditRepayType1;//还款方式
			if(creditRepayType=="401"){
				creditRepayType="循环";
			}else{
				creditRepayType="分期";
			}
			var loanRate = App.storage.get("applyDataInfo").loanRate;//贷款利率
			$("#applyAmount4").text( Utils.formatCurrency(authAmount*10000,2));
			$("#applyDeadline4").text(applyDeadline);
			$("#creditRepayType4").text(creditRepayType);
			$("#loanRate4").text(loanRate+"‰");
    	},
    	initPage5 : function(){//确定页面
        	var pageStep5 = {
            		title:'审批失败',
            		leftButton:{
            			name : '返回',
            			func: 'curView.goBack()'
            		},
            		rightButton:{
            			name : ''
            		}
            	};
            Client.initPageTitle(pageStep5);
    	},
    	initPage6 : function(){//确定页面
        	var pageStep6 = {
            		title:'已提交',
            		leftButton:{
            			name : '返回',
            			func: 'curView.goBack()'
            		},
            		rightButton:{
            			name : ''
            		}
            	};
            Client.initPageTitle(pageStep6);
    	},
    	initPage7 : function(){//确定页面
        	var pageStep7 = {
            		title:'受理成功',
            		leftButton:{
            			name : '返回',
            			func: 'curView.goBack()'
            		},
            		rightButton:{
            			name : ''
            		}
            	};
            Client.initPageTitle(pageStep7);
            var applyAmount = Utils.formatCurrency(App.storage.get("applyDataInfo").applyAmount1,2);//申购金额
			var applyDeadline = App.storage.get("applyDataInfo").applyDeadline;//贷款期限
			if(applyDeadline=="02"){
				applyDeadline="6个月";
			}else if(applyDeadline=="03"){
				applyDeadline="12个月";
			}else if(applyDeadline=="04"){
				applyDeadline="2年";
			}else if(applyDeadline=="05"){
				applyDeadline="3年";
			}else if(applyDeadline=="06"){
				applyDeadline="4年";
			}else if(applyDeadline=="07"){
				applyDeadline="5年";
			}
			var creditRepayType = App.storage.get("applyDataInfo").creditRepayType1;//还款方式
			if(creditRepayType=="401"){
				creditRepayType="循环";
			}else{
				creditRepayType="分期";
			}
			$("#applyAmount7").text( Utils.formatCurrency(applyAmount*10000,2));
			$("#applyDeadline7").text(applyDeadline);
			$("#creditRepayType7").text(creditRepayType);
    	},
		
		upLoad : function(){
			App.navigate("mortgage/mortgageCtl/imageUpload");
		},
		
		bank1 : function(){
			App.storage.remove("applyDataInfo");
			App.back();
		},
		bank2 : function(){
			App.storage.remove("applyDataInfo");
			App.back();
		},
		bank3 : function(){
			App.storage.remove("applyDataInfo");
			App.back();
		},
		bank4 : function(){
			App.storage.remove("applyDataInfo");
			App.back();
		},
		bank5 : function(){
			App.storage.remove("applyDataInfo");
			App.back();
		},
		bank6 : function(){
			App.storage.remove("applyDataInfo");
			App.back();
		},
		bank7 : function(){
			App.storage.remove("applyDataInfo");
			App.back();
		},
		
		
		goBack : function(){
			App.storage.remove("applyDataInfo");
			App.back();
		}
	
	});
});
