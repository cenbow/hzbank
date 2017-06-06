define(function (require, exports, module) {
	
	var financeBalanceSignTemplate = require("text!../template/financeBalanceSign.html");
	
	var FinanceBalanceSignView = module.exports = ItemView.extend({
		
        template : financeBalanceSignTemplate,
        
        events:{
	       	 "keyup #addressText,#zipcodeText":"checkButton",
	    	 "blur #addressText,#zipcodeText":"checkButton",
        	 "click #checkbox1":"checkButton",      	
        	 "click #checkbox2":"checkButton",
        	 "click #pwd" : "showPassword",
        	 "click #signBtn" : "signFinanceBalance",
        	 "click #succBackButton" : "goToBuy",
        	 "click #showPage4" : "showPage4",
        	 "click #showPage5" : "showPage5",
         	 "click #agreeBtn1":"agreeBtn1",      	
        	 "click #closeBtn1":"showPage1",     
        	 "click #agreeBtn2":"agreeBtn2",      	
        	 "click #closeBtn2":"showPage1"    
        },
        
        initialize : function(){
        	var pageStep1 = {
    			title:'幸福添利签约',
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
				if(data.errorCode==undefined){
					$this.queryCustInfo();
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
						Client.hideWaitPanel(1);
					}
				}else{
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(1);
				}
				}});
		},
			
		queryCustInfo : function(){
			var param = {};
			Ajax({url:"/finance/queryFinanceCustInfo",data:param, success:function(data){
				if(data.errorCode==undefined){
					var customerAddress = data.customerAddress;
					if(!Utils.isEmpty(customerAddress)){
						$("#addressText").attr("disabled",true);
						$("#zipcodeText").attr("disabled",true);
						$("#addressText").val(data.customerAddress);
						$("#zipcodeText").val(data.customerZipcode);
					}
					Client.hideWaitPanel(1);
				}else{
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(1);
				}
			}});
		},
			
		signFinanceBalance : function(){
			if($("#signBtn").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
			var $this = this;
			var cardNo = $("#accountSelect").val();
			var customerAddress	= $("#addressText").val();
			var customerZipcode	= $("#zipcodeText").val();
			var checkStt1 = document.getElementById("checkbox1").checked;
			var checkStt2 = document.getElementById("checkbox2").checked;
			var mgrNo = "";
			
			if(MUI.isEmpty(cardNo)){
				Utils.alertinfo("请选择卡号");
				return;
			}
			if((this.model.get("mgrNoClass") == "")){
				mgrNo = $("#mgrNoText").val();
				if(!MUI.isEmpty(mgrNo) && mgrNo.length != 6){
					Utils.alertinfo("请输入6位客户经理编号");
					return;	
				}
			}
			if(MUI.isEmpty(customerAddress)){
				Utils.alertinfo("请输入账单地址");
				return;
			}
			if(MUI.isEmpty(customerZipcode)){
				Utils.alertinfo("请输入邮政编码");
				return;
			}
			if(this.password==""||this.pwdkey==""){
				Utils.alertinfo("交易密码不能为空");
				return;
			}
			if(!checkStt1){
				Client.alertinfo("请勾选‘幸福添利’产品规则与货币基金风险提示");
				return;
			}
			if(!checkStt2){
				Client.alertinfo("请勾选‘幸福添利’快速赎回服务协议");
				return;
			}

			var param = {
					customerAddress:customerAddress,
					customerZipcode:customerZipcode,
			};
			
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/finance/modifyFinanceCustInfo",data:param, success:function(data){  //修改客户信息
				if(Utils.isEmpty(data.errorCode)){
					var params = {
		    				cardNo:cardNo,
		    				financeNo:$this.model.get("financeNo"),
		    				reserveAmt:"",
		    				mgrNo:mgrNo,
		    				password:$this.password,
		    				pwdkey:$this.pwdkey
		    		 };
					Ajax({url:"/finance/signFinanceBalance",data:params, success:function(data){//签约
						Client.hideWaitPanel(1);
						if(Utils.isEmpty(data.errorCode)){
							var userInfo = App.storage.get("UserInfo");
							var iCardInfo = userInfo.iCardInfo;
				    		for(var len=0;len<iCardInfo.length;len++){
				    			var cardNoColl = iCardInfo[len].cardNo;
				    			if(Utils.trim(cardNoColl) == cardNo){
				    				userInfo.iCardInfo[len].cardFlag1 = '0';
				    			}
				    		}
							App.storage.set("UserInfo",userInfo);//将参数放入session
							
							App.storage.remove("paramFinanceUserMobBalInfo");//将参数放入session
							var balanceIsSign = {
									isSign : "1",
									financeNo :  $this.model.get("financeNo")
							}
							App.storage.set("balanceIsSign",balanceIsSign);//幸福添利已签约
							$('#recAccName_suc').text(Utils.getFmtAcc(cardNo));
							App.navigate("finance/financeCtl/financeBalanceIn");
//							$this.initPage2();
						}else{
							Utils.alertinfo(data.errorMessage);
						}
						$("#pwd").val("");
						$this.password = "";
	    				$this.pwdkey = "";
	    				$this.checkButton();
						Client.loadPwdKey();
					},error:function(){
						Client.loadPwdKey();
					}});
				}else{
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(1);
				}
			}});
		},
		
		//控制页面显示
		showPage : function(num){
			for(var i=1;i<=5;i++){
				if(i==num){
					$("#financeSignPage"+i).show();
				}else{
					$("#financeSignPage"+i).hide();
				}
			}
		},
		
		
//		initPage2 : function(){//成功结果页面
//
//			//初始化结果页面头部菜单
//			var pageStep3 = {
//	    		title:'幸福添利签约',
//				leftButton:{
//					name: '返回',
//					func: 'App.goToBuy()'
//				}
//			};
//			
//			Client.initPageTitle(pageStep3);
//			this.showPage(2);
//		},
		
//		initPage3 : function(){//错误结果页面
//			$('#errorBackButton').on('click',function(){
//				App.goToBuy();
//			});
//			Client.initPageTitle(pageStep3);
//			this.showPage(3);
//		},
//		
//		initPage4 : function(){//可疑结果页面
//		$('#dubBackButton').on('click',function(){
//			App.goToBuy();
//		});
//		Client.initPageTitle(pageStep3);
//		this.showPage(4);
//	},
	
		showPage1 : function(){
        	var pageStep1 = {
        			title:'幸福添利签约',
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
    		Client.menuOpt("5");
			this.showPage(1);
		},
	
		showPage4 : function(){
			//初始化结果页面头部菜单
			Client.menuOpt("0");
			var pageStep4 = {
	    		title:'幸福添利签约',
				leftButton:{
					name: '返回',
					func: 'curView.showPage1()'
				}
			};
			Client.initPageTitle(pageStep4);
			var $this = this;
			setTimeout(function(){
				$this.showPage(4);
			},100);
			
		},
	
		showPage5 : function(){
			//初始化结果页面头部菜单
			Client.menuOpt("0");
			var pageStep4 = {
	    		title:'幸福添利签约',
				leftButton:{
					name: '返回',
					func: 'curView.showPage1()'
				}
			};
			Client.initPageTitle(pageStep4);
			var $this = this;
			setTimeout(function(){
				$this.showPage(5);
			},100);
		},
	
		goToBuy : function(){
			var param = {
					financeNo:this.model.get("financeNo"),
					financeName:this.model.get("financeName")
				};	
			App.navigate("finance/financeCtl/financeBalanceLoad",param);
		},
		
        goBack : function(){
        	App.back();
    	},
    	
    	help : function(){
    		App.navigate("anymore/anymoreCtl/messageCenter");
    	},
		agreeBtn1 : function(){
        	var pageStep1 = {
        			title:'幸福添利签约',
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
    		Client.menuOpt("5");
    		$('#checkbox1').remove();
    		$('#checkReg1').prepend('<input type="checkbox" checked id="checkbox1" />');
    		this.checkButton();
			this.showPage(1);
		},
		agreeBtn2 : function(){
        	var pageStep1 = {
        			title:'幸福添利签约',
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
    		Client.menuOpt("5");
    		$('#checkbox2').remove();
    		$('#checkReg2').prepend('<input type="checkbox" checked id="checkbox2" />');
    		this.checkButton();
			this.showPage(1);
		},
    	checkButton : function(){
  		  //验证码开始进行匹配
  		  (!Utils.isEmpty($('#addressText').val())&&!Utils.isEmpty($('#zipcodeText').val())&&!Utils.isEmpty(this.password)&&($('#checkbox1').attr("checked"))&&($('#checkbox2').attr("checked"))) ?
  				    $("#signBtn").removeClass('disabled').removeAttr('disabled') : $("#signBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
    	},	
	});
	
	
});