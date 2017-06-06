define(function (require, exports, module) {
	
	var depositProfitTemplate = require("text!../template/depositProfit.html");
	
	var DepositProfitView = module.exports = ItemView.extend({
		
        template : depositProfitTemplate,
        
        events:{
        },
        
        initialize : function(){
        	//初始化菜单方法
        	var pageStep = {
        		title:'收益查询',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		},
        		rightButton:{
        			name : '帮助',
        			func : 'curView.help()'
        		}
        	};
        	
        	Client.initPageTitle(pageStep);
        	
        	this.queryDepositDetail();
        	
        	var setHeight = (document.documentElement.clientHeight || window.innerHeight) -170; //需要占满屏幕高度所需高度
    		document.querySelector('#noData').style.height = setHeight+ 'px';
        },
        
        
        queryDepositDetail : function(){
    		var cardNo = Utils.getEleCard().cardNo;//电子账号
    		var accountType = Utils.getEleCard().accountType;//电子账户类型
    		var param = {
    				accountNo:cardNo,
    				accountType2:accountType
    		};
    		var $this = this;
    		Ajax({url:"/finance/queryFinanceTerm",data:param, success:function(data){
    			if(data.errorCode==undefined){
    				var icoll = data.iAccountDetail;			
    				for(var len=0;len<icoll.length;len++){
    					var kcoll = icoll[len];
    					var depositType = Utils.trim(kcoll.depositType);
    					if("29" != depositType)continue;//29为幸福乐存
    					var accountNo = kcoll.accountNo;
    					var balance = Utils.formatCurrency(kcoll.balance,2);
    					var interestBeginDate= kcoll.interestBeginDate;
    					var interestEndDate = kcoll.interestEndDate;
    					var openNode = kcoll.openNode;
    					var balanceAvailable = Utils.formatCurrency(kcoll.balanceAvailable,2);
    					var info = cardNo+'|'+accountType+'|'+accountNo+'|'+balance+'|'+interestBeginDate+'|'+interestEndDate+'|'+openNode;
    					$this.addRow("iAccountDetail",accountNo,balance,interestBeginDate,info);
    				}
    				
    				Client.hideWaitPanel(1);
    			}else{
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}
    			if($("#iAccountDetail li").length<=0){
					$('#noData').show();
					$('#iAccountDetail').hide();
				}else{
					$('#noData').hide();
					$('#iAccountDetail').show();
				}
    		}});		
    	},

        formatAccount : function(accountNo){
    		var cardNo6 = "";
    		if(accountNo.length > 16){
    			var cardNo1 = accountNo.substring(0,4);
    			var cardNo5 = accountNo.substring(16,accountNo.length);	
    			cardNo6 = cardNo1+"****"+cardNo5;		
    		}else{
    			cardNo6 = cardNo;
    		}
    		return cardNo6;
    	},
    	
    	addRow : function(id,accountNo,balance,interestBeginDate,info){
    		var balanceTem = balance.replace(/,/g,"");
//    		if(parseFloat(balanceTem)/10000 >1){
//    			balance = Utils.formatCurrency(parseFloat(balanceTem)/10000,2)+"万";
//    		}
    		
    		$("#"+id).append( '<li>'+
    				'<div class="bnf-liz">'+
    					'<p>'+this.formatAccount(accountNo)+'</p>'+
    					'<p class="ft12 fc-8">起息日：'+interestBeginDate+'</p>'+
    				'</div>'+
    				'<div class="bnf-liz">'+
						'<p>'+balance+'元</p>'+
    					'<p class="ft12 fc-8">可用余额</p>'+
    				'</div>'+
    				'<div class="query-btn">'+
    					'<a href="javascript:;" class="btn" id= "'+accountNo+'" name="'+info+'">收益查询</a>'+
    				'</div>'+
    			'</li>');
    		var $this = this;
    		$("#"+accountNo).on('click', function() {
    			$this.depositProfitQry(info);
    		});
    	},
    	
    	depositProfitQry : function(info){
    		var infoValues = info.split("|");
    		var param = {
    				cardNo:infoValues[0],
    				accountType:infoValues[1],
    				accountNo:infoValues[2],
    				balance:infoValues[3],
    				interestBeginDate:infoValues[4],
    				interestEndDate:infoValues[5]
    		};
    		App.navigate("deposit/depositCtl/depositProfitDetail",param);
    	},
    	
    	
        goBack : function(){
        	App.back();
    	},

    	help : function(){
    		App.navigate("anymore/anymoreCtl/messageCenter");
    	},
    	
	});
	
});