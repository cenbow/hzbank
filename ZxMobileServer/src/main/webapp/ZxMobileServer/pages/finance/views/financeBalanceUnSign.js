define(function (require, exports, module) {
	
	var financeBalanceUnSignTemplate = require("text!../template/financeBalanceUnSign.html");
	
	var FinanceBalanceUnSignView = module.exports = ItemView.extend({
		
        template : financeBalanceUnSignTemplate,
        
        events:{
        	 "click #pwd" : "showPassword",
        	 "tap #signBtn" : "financeBalanceUnSign",
        	 "tap #succBackButton" : "goBack"
        },
        
        initialize : function(){
        	var pageStep1 = {
    			title:'幸福添利解约',
    			leftButton:{
    				name : '返回',
    				func: 'curView.goBack()'
    			},
    			rightButton:{
    				name : '帮助',
    				func : 'curView.help()'
    			}
    		};

    		Client.initPageTitle(pageStep1);
    		
    		this.password = "";
    		this.pwdkey = "";
    		
			this.toQueryAcc(this.model.get("financeNo"));  //查询客户地址等信息
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
    	
    	toQueryAcc : function(financeNo){
			var iCardInfo  = App.storage.get("UserInfo").iCardInfo;
			var accList ="";
			var cardNo;
			var num = 0;
			var numLength = iCardInfo.length;
			for(var len=0;len<iCardInfo.length;len++){
				cardNo = iCardInfo[len].cardNo;
				accList+=cardNo+"|";
				num++;
				if(num==5){
					numLength = numLength-5;
					queryAcc(financeNo,accList);
					num=0;
					accList="";
				}
			}
			if(numLength>0){	
				for(var i=numLength;i<5;i++){
					accList+="|";
				}		
				this.queryAcc(financeNo,accList);
			}
		},
		
		queryAcc : function(financeNo,accList){
			var param = {
				financeNo:financeNo,
				accountList:accList
			};
			var $this = this;
			Ajax({url:"/finance/queryFinanceAcc",data:param, success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var icoll = data.iInfo;
					if(icoll.length>0){	
						$('#accountSelect').empty();
						for ( var len=0;len<icoll.length;len++ )
						{
							var kColl = icoll[len];					
							var opt = $("<option></option>").text(kColl.info).val(kColl.info);
							$('#accountSelect').append(opt);
						}
					}else{
						$('#accountSelect').append("<option value=''>您没有可开通幸福添利的卡号</option>");
					}
					Client.hideWaitPanel(1); 
				}else{
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(1);
				}
				}});
		},

			
		financeBalanceUnSign : function(){
			if($("#signBtn").attr('disabled')){ //确定按钮可点击
				return;
			}
			var $this = this;
			var cardNo = $("#accountSelect").val();
			
			if(this.password==""||this.pwdkey==""){
				Utils.alertinfo("交易密码不能为空！");
				return false;
			}
			var params = {
    				cardNo:cardNo,
    				financeNo:this.model.get("financeNo"),
    				password:this.password,
    				pwdkey:this.pwdkey
    		 };
			Client.openWaitPanel();
			Ajax({url:"/finance/balanceUnSign",data:params, success:function(data){//签约

				if(MUI.isEmpty(data.errorCode)){
					$('#recAccName_suc').text(Utils.cardNoFomart(cardNo));
					var balanceIsSign ={isSign:"2"};
					App.storage.set("balanceIsSign",balanceIsSign);//幸福添利未签约
					
					var paramFinanceUserMobBalInfo = App.storage.get("paramFinanceUserMobBalInfo");
					if(!MUI.isEmpty(paramFinanceUserMobBalInfo)){
						paramFinanceUserMobBalInfo.state = "0";//幸福添利未签约
						App.storage.set("paramFinanceUserMobBalInfo",paramFinanceUserMobBalInfo);
					}
					$this.initPage2();
				}else{
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(1);
				}
				$("#pwd").val("");
				$this.password = "";
				$this.pwdkey = "";
				Client.loadPwdKey();
				$this.checkButton();
			},error:function(){
				Client.loadPwdKey();
				$this.checkButton();
			}});

		},
		
		//控制页面显示
		showPage : function(num){
			for(var i=1;i<=5;i++){
				if(i==num){
					$("#financeUnSignPage"+i).show();
				}else{
					$("#financeUnSignPage"+i).hide();
				}
			}
			Client.hideWaitPanel(1);
		},
		
		
		initPage2 : function(){//成功结果页面

			this.showPage(2);
		},
		
//		initPage3 : function(){//错误结果页面
//			$('#errorBackButton').on('tap',function(){
//				App.goToBuy();
//			});
//			Client.initPageTitle(pageStep3);
//			this.showPage(3);
//		},
//		
//		initPage4 : function(){//可疑结果页面
//			$('#dubBackButton').on('tap',function(){
//				App.goToBuy();
//			});
//			Client.initPageTitle(pageStep3);
//			this.showPage(4);
//		},
		
		goToBuy : function(){
			App.navigate("finance/financeCtl/financeBalance");
		},
		
        goBack : function(){
        	var actionFlag = App.storage.get("_parameters").actionFlag;
        	if(!MUI.isEmpty(actionFlag)&&actionFlag=="1"){
				var balanceIsSign = App.storage.get("balanceIsSign");//幸福添利未签约
				if(!MUI.isEmpty(balanceIsSign)&&(balanceIsSign.isSign=="1")){
		     		var financeNo ="";
	        		var financeName ="";
	        		if(this.model.get("financeNo") == Utils.getParamDisplay("PB_FINANCE_BALANCE","1")){
	        			financeNo = Utils.getParamDisplay("PB_FINANCE_BALANCE","3");
	        			financeName = Utils.getParamDisplay("PB_FINANCE_BALANCE","4");
	        		}else{
	           			financeNo = Utils.getParamDisplay("PB_FINANCE_BALANCE","1");
	        			financeName = Utils.getParamDisplay("PB_FINANCE_BALANCE","2");   			
	        		}
	        		var param ={financeNo:financeNo,financeName:financeName};
					App.navigate("finance/financeCtl/financeBalancePrompt2",param);//跳转幸福添利提示页面					
				}else{
					App.back();			
				}  
        	}else{
        		App.back();
        	}
    	},
    	
    	help : function(){
    		App.navigate("anymore/anymoreCtl/messageCenter");
    	},
    	checkButton : function(){
  		  //验证码开始进行匹配
  		  (!MUI.isEmpty(this.password)) ?
  		  $("#signBtn").removeClass('disabled').removeAttr('disabled') : $("#signBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
    	}
	});
	
	
});