define(function (require, exports, module) {
	
	var depositTemplate = require("text!../template/deposit.html");
	
	var DepositView = module.exports = ItemView.extend({
		
        template : depositTemplate,
        
        events:{
        	"click #goToBuy":"toLogin",
        	"keyup #inputAmt,#inputDayNum":"calculate",
        	"blur #inputAmt,#inputDayNum":"calculate"
        },
        
        initialize : function(){
        	//初始化菜单方法
        	var pageStep1 = {
        		title:'幸福乐存',
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
        	var depositRate = App.storage.get("depositRate");
        	if(depositRate){
        		this.rate = depositRate.rate;
        		this.initChart(depositRate.rate,depositRate.label);
        	}else{
        		this.queryRate();
        	}
        	
        },
        
        queryRate : function(){
        	
        	var rate = this.rate =[];
        	var label = [];
        	var $this = this;
        	
        	Ajax({url:"/finance/queryRmbRate",data:{}, 
    			success:function(data){
    				if(data.errorCode){
    					Utils.alertinfo(data.errorMessage);
    				}else{
    					var iApparList = data.iApparList;
    					
    					for(index in iApparList){
    						var appar = iApparList[index];
    						rate.push(appar.aprShowMsg);
    						label.push(appar.aprName);
    					}
    					$this.initChart(rate,label);
    					App.storage.set("depositRate",{rate:rate,label:label});
    				}
    				
    			}
        	});
        },
        
        initChart : function(rate,label){
        	
        	var rate9 = Utils.getParamDisplay("PB_DEPOSIT_RATE","100");//银行活期
        	
        	$('#rate9').text(rate9);
    					
			$('#rate4').text(rate[3]);
        	$('#rate8').text(rate[7]);
        	
        	var opt = {
    			
    			chartType: "line",
    			
    		    myData: {
    			  labels : label,
    			  data : rate
    		    }        		
        	};
        	setTimeout(function(){
        		MUI.creatChart('#hs_chart_line',opt);
			},300);
        	this.calculate();
        },
        
        goToBuy : function(){
    		App.navigate("deposit/depositCtl/depositIn");  //跳转幸福乐存购买页面
    	},
    	
    	calculate : function(){
    		var rate = Utils.getParamDisplay("PB_DEPOSIT_RATE","100");
    		var newRate="";
    		var inputAmt = $('#inputAmt').val();
    		var inputDayNum = $('#inputDayNum').val();
    		/*1天≤T2≤6天	一天通知存款利率
    		7天≤T2≤89天	七天通知存款利率
    		90天≤T2≤179天	三个月存款利率
    		180天≤T2≤364天	六个月存款利率
    		365天≤T2≤729天	一年存款利率
    		730天≤T2≤1094天	二年存款利率
    		1095天≤T2≤1824天	三年存款利率
    		T2=1825天	五年存款利率*/
    		if(1 <= inputDayNum && inputDayNum <= 6){
    			newRate = this.rate[0];
    		}else if(7 <= inputDayNum && inputDayNum <= 89){
    			newRate = this.rate[1];
    		}else if(90 <= inputDayNum && inputDayNum <= 179){
    			newRate = this.rate[2];
    		}else if(180 <= inputDayNum && inputDayNum <= 364){
    			newRate = this.rate[3];
    		}else if(365 <= inputDayNum && inputDayNum <= 729){
    			newRate = this.rate[4];
    		}else if(730 <= inputDayNum && inputDayNum <= 1094){
    			newRate = this.rate[5];
    		}else if(1095 <= inputDayNum && inputDayNum <= 1824){
    			newRate = this.rate[6];
    		}else if(1825 <= inputDayNum){
    			newRate = this.rate[7];
    		}
    		var expectAmt = Utils.formatCurrency(inputDayNum*newRate*inputAmt/36500,2);
    		var expectBankAmt = Utils.formatCurrency(inputDayNum*rate*inputAmt/36500,2);
    		$('#expectAmt').text(expectAmt);
    		$('#expectBankAmt').text(expectBankAmt);
    		Client.hideWaitPanel(1);
    	},
    	
        toLogin : function(){
        	Client.toLogin("curView.toDepositIn()");
		},
		
		toDepositIn : function(){
   			if(Utils.checkRealUser()){
				if(!Utils.checkActivate()){
					return;
				}
    			Client.menuOpt("5");
				App.navigate("deposit/depositCtl/depositIn");  //跳转幸福乐存购买页面
				return false;
		   		 
			}
		},
		
        goBack : function(){
    		App.back();
    	},
    	
    	help : function(){
    		App.navigate("anymore/anymoreCtl/messageCenter");
    	},
    	
	});
	
	
});