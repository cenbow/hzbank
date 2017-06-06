define(function(require, exports, module){
	
	var immteInvestTpl = require("text!../template/immteInvest.html");
    
	var immteInvestView = module.exports = ItemView.extend({
		template : immteInvestTpl,
		events:{
        	"click #makesure":"makesure",
        	"blur #inputMoney":"inputMoney",
        	"keyup #inputMoney":"inputMoney",
        	"click #maxMoney":"maxMoney",
        	"click #pwd" : "showPwd",
        	"click #agreement1" : "agreement1",
        	"click #tradeBanner":"goBack2",
        	"click #hongbao" : "toredPacketInviteIndex"
		},
		
		//初始化
		initialize : function(){
				
			var pageStep1 = {
	        		title:'立即投资',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
					rightButton:{
						name : '',
					}
	        	};
	        Client.initPageTitle(pageStep1);
	        
	        //初始化结果页面头部菜单
        	this.pageStep3 = {
        		title:'申购结果',
        		leftButton:{
        			name: '返回',
        			func: 'curView.goBack2();'
        		}
        	};
	        	
	        this.pwd = "";
	        this.pwdKey = "";
	        this.totalAmt = 0;
	        this.totalSum = 0;
	        var financeName=App.storage.get("model").financeName;
	        var financeRiskLevel=App.storage.get("model").financeRiskLevel;
	        var financePreInterestRate=App.storage.get("model").financePreInterestRate;
	        var minbuyamt=Utils.formatCurrency(App.storage.get("model").minbuyamt, 2);
	        var financePeriod=App.storage.get("model").financePeriod;
	        var repaymentType=App.storage.get("model").repaymentType;
	        var toaddamt=Utils.formatCurrency(App.storage.get("model").toaddamt, 2);
	        var interestEndDate=App.storage.get("model").interestEndDate;
	        var financeUseVol=App.storage.get("model").financeUseVol;
	        var raiseenddate = Utils.parseDate(App.storage.get("model").raiseenddate,'yyyy-MM-dd').getTime()-86400000;
	        raiseenddate = new Date(raiseenddate);
	        raiseenddate= Utils.toDateString(raiseenddate,'yyyy年MM月dd日');
	        var interestBeginDate = Utils.formatDate(App.storage.get("model").interestBeginDate,'yyyy-MM-dd','yyyy年MM月dd日');
	        var limitamount = App.storage.get("model").limitamount;
	        
	        $("#financeName").text(financeName);
	        $("#financeRiskLevel").text(financeRiskLevel);
	        $("#financePreInterestRate").text(financePreInterestRate+'%');
	        $("#minbuyamt").text(minbuyamt+'元');
	        $("#financePeriod").text(financePeriod+'天');
	        $("#repaymentType").text(repaymentType);
	        $("#interestBeginDate").text(interestBeginDate);
	        $("#raiseenddate").text(raiseenddate);
	        $("#financeUseVol").text(financeUseVol);
	        $("#cardNo").text(Utils.formatAcc(Utils.getEleCard().cardNo));
	        if(limitamount>0){
	        	$("#inputMoney").attr("placeholder","购买限额"+limitamount/10000+"万元");
	        }else{
	        	$("#inputMoney").attr("placeholder","购买无限额");
	        }
	        
	        this.queryAmt();
	        
        	var cardNo = Utils.getEleCard().cardNo;//获取电子账号
  			var accountType = Utils.getEleCard().accountType;//获取电子账号类型
    		if (Utils.isInteger(cardNo)) {
    			Utils.queryCommBalance(cardNo,accountType);
    		};
		},
		
		queryAmt:function(){
	    	var financeNo=App.storage.get("model").financeNo;
	    	var $this = this;
			var param={
				financeNo:financeNo
			};
			Ajax({url:"/product/residualAmtQuery",data:param, success:function(data){
				if(Utils.isEmpty(data.errorCode)){
					data.totalSum = data.totalSum || 0;
					$this.totalSum = data.totalSum;
					var limitamount=App.storage.get("model").limitamount;
					if(limitamount > 0){
						$this.totalAmt = parseFloat(limitamount) - parseFloat(data.totalSum);
						$this.totalAmt = $this.totalAmt < 0?0:$this.totalAmt;
					}else{
						$this.totalAmt = 99999999999999;
					}
					
				}else{
    				Utils.alertinfo(data.errorMessage);
    			}
				Client.hideWaitPanel(1);
			},error:function(){
    			Client.hideWaitPanel(1);
    		}});
		},
		
		goBack:function(){
			App.back();
		},
		
		goBack2 : function(){
			if(location.href.indexOf("immteInvest")>0){
				if(App.browseList[2].indexOf("p2pDetail")>=0){
					App.back(3);//跳到我的账户页面
				}else{
					App.back();//跳到产品详情页面
				}
			}
    	},
		
		//确定
	    makesure:function(){
	    	var $this=this;
	    	var financeNo=App.storage.get("model").financeNo;
	    	var financeName=App.storage.get("model").financeName;
	    	financeName = financeName.replace(" • ",".");
			var tranAmt=$("#inputMoney").val();
			var showBalanceSpan=Utils.removeComma(document.getElementById("showBalanceSpan").innerHTML);
			var financeUseVol=Utils.removeComma(document.getElementById("financeUseVol").innerHTML);
			var cardNo = Utils.getEleCard().cardNo;
  			var accountType = Utils.getEleCard().accountType;
  			var minbuyamt=Utils.removeComma(App.storage.get("model").minbuyamt);
  			var toaddamt=Utils.removeComma(App.storage.get("model").toaddamt);
  			
  			if(!Utils.checkAmount1(tranAmt)){
    			return false;
    		}
  			
  			if(tranAmt <= 0){
  				Utils.alertinfo("请输入大于0的金额！");	
    			return false;
  			}
  			
//  			if(parseFloat(tranAmt) < parseFloat(minbuyamt)){
//  				Utils.alertinfo("请输入的购买金额必须大于起购金额！");	
//    			return false;
//  			}
  			
  			
  			if(parseFloat(tranAmt)>parseFloat(showBalanceSpan)){
  				Client.alertinfo("抱歉，账户余额不足，无法完成交易，请先充值！","提示","curView.toPay()",true);
    			return false;
    		}
  			
  			if(parseFloat(tranAmt)>parseFloat(financeUseVol)){
    			Utils.alertinfo("产品剩余额度不足！");	
    			return false;
    		}
    		
  			if((tranAmt*100)%(toaddamt*100)!=0){
  				Utils.alertinfo("投资金额必须为最小追加单位的整数倍!");
    			return false;
  			}
    		
  			if(!$this.pwd||!$this.pwdKey){
  				if(	$('.ui-view').attr('data-position')!=0){
	     			return;
	     		}
    			Utils.alertinfo("请输入交易密码！");
    			return false;
    		}
  			
    		var checkStt = document.getElementById("checkbox").checked;
			if(!checkStt){
				Utils.alertinfo("请阅读《相关协议》");
				return false;
			}
			tranAmt=parseFloat(tranAmt);
			var param={
				financeNo:financeNo,
				financeName:financeName, 
				tranAmt:tranAmt, 
				password:this.pwd, 
				pwdkey:this.pwdKey, 
				cardNo:cardNo, 
				accountType:accountType
			};
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/product/saleProductsBuy",data:param, success:function(data){
				if(Utils.isEmpty(data.errorCode)){
					var activityFlag = data.activityFlag;
					$("#productInPage1").hide();
					$("#productInPage2").show();
					if(activityFlag=="01"){
						$("#hongbao").show();
					}
    				$('#recAccName_suc').text(Utils.cardNoFomart(cardNo));
    				$('#recAmt_suc').text(Utils.formatCurrency(tranAmt));
    				$this.initPage2();
    				if(!MUI.isEmpty(App.storage.get("paramAccount"))){
    					App.storage.remove("paramAccount");	
    				}  
    				if(!MUI.isEmpty(App.storage.get("balanceInfo"))){
    					App.storage.remove("balanceInfo");	
    				}
    				
    				if(!MUI.isEmpty(App.storage.get("iP2PRaisingList"))){
    					App.storage.remove("iP2PRaisingList");	
    				}
    				
    			}else{
    				Utils.alertinfo(data.errorMessage);
    				$this.refresh();
    			}
				Client.hideWaitPanel(1);
				$this.clearPwd();
			},error:function(){
				$this.refresh();
    			Client.hideWaitPanel(1);
    			$this.clearPwd();
    			
    		}});
		},

		//去充值
		toPay : function(){
			App.navigate("transfer/transferCtl/recharge");
		},


		//去充值
		toPay : function(){
			App.navigate("transfer/transferCtl/recharge");
		},
		


		refresh:function(){
			var financeNo=App.storage.get("model").financeNo;
			var $this = this;
			Ajax({url:"/product/saleDetailById", data:{financeNo:financeNo}, 
				success:function(data){
					if (data.errorCode) {
						Utils.alertinfo(data.errorMessage);
					} else {
						var financeUseVol = Utils.formatCurrency(data.financeUseVol, 2);
						$("#financeUseVol").text(financeUseVol);
					}
				}
			});
		},
		

		//成功结果页面
		initPage2 : function(){//成功结果页面
    		Client.initPageTitle(this.pageStep3);
    		this.showPage(3);
    	},
    	
    	//错误结果页面
    	initPage3 : function(){
    		$('#errorBackButton').on('click',function(){
    			App.back();
    		});
    		Client.initPageTitle(this.pageStep3);
    		this.showPage(3);
    	},
    	
    	//控制页面显示
    	showPage : function(num){
    		for(var i=1;i<=5;i++){
    			if(i==num){
    				$("#depositOutPage"+i).show();
    			}else{
    				$("#depositOutPage"+i).hide();
    			}
    		}
    	},
    	
    	//计算预期收益
    	inputMoney:function(){
    		var tranAmt=$("#inputMoney").val();
			var financePreInterestRate=App.storage.get("model").financePreInterestRate;
			var financePeriod=App.storage.get("model").financePeriod;
		    var prospectiveYield=Utils.formatCurrency(financePreInterestRate*tranAmt*financePeriod*0.01/365,2);
		    $("#prospectiveYield").text(prospectiveYield); 
		  
		},
		
		
		maxMoney:function(){
			var limitamount=parseFloat(Utils.removeComma(App.storage.get("model").limitamount || 0));
			var showBalanceSpan=parseFloat(Utils.removeComma(document.getElementById("showBalanceSpan").innerHTML));
			var financeUseVol=parseFloat(Utils.removeComma(document.getElementById("financeUseVol").innerHTML));
		    var toaddamt=parseFloat(Utils.removeComma(App.storage.get("model").toaddamt || 0));
		    var minbuyamt= this.totalSum <=0 ? (App.storage.get("model").minbuyamt || 0):toaddamt;
		    minbuyamt = parseFloat(minbuyamt);
			var arr = [showBalanceSpan,financeUseVol,this.totalAmt];
			arr.sort(function(a,b){return a-b;});
			var maxNum = (arr[0] < minbuyamt&&arr[0]!=this.totalAmt)?minbuyamt:arr[0];
			maxNum = maxNum - (maxNum*100)%((toaddamt||1)*100)/100;
    		$("#inputMoney").val(maxNum.toFixed(2));
    		
    		if(maxNum <= 0){
    			Client.alertinfo("您已购买达到产品限额(限额为:"+limitamount+"元)");
    		}
    		var tranAmt=$("#inputMoney").val();
    		var financePreInterestRate=App.storage.get("model").financePreInterestRate;
			var financePeriod=App.storage.get("model").financePeriod;
		    var prospectiveYield=(financePreInterestRate*tranAmt*financePeriod*0.01/365).toFixed(2);
		    $("#prospectiveYield").text(prospectiveYield);
		},
		
		showPwd : function(){
			Utils.focusPosition($("#pwd").parent(),100);
			var opt = {
				elem:"#pwd",//当前对像
				type:'number',//text 字母与数字 number数字键盘
				max:'6',
				callback:'curView.savePassword'
			};
			Client.showPwdPicker(opt);
		},
		
		agreement1 :function(){
			App.navigate("product/productCtl/agreement");
			Client.menuOpt("0");
		},
		
		savePassword : function(obj){
			this.pwd = obj.pwd;
			this.pwdKey = obj.pwdKey;
		},
		
		toredPacketInviteIndex : function(){
			App.navigate("hongbao/hongbaoCtl/redPacketInviteIndex");
    	},
		
		clearPwd : function(){
    		$("#pwd").val("");
    		this.pwdKey = null;
    		this.pwd = null;
			Client.loadPwdKey();
			$("#login-pswd i").hide();
    	}
	});
});




