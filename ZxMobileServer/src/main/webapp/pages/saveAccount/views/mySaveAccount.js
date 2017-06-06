define(function (require, exports, module) {
	
	var mySaveAccountTemplate = require("text!../template/mySaveAccount.html");
	
	var saveAccountView = module.exports = ItemView.extend({
		template : mySaveAccountTemplate,
		
		events:{
        },
		
        initialize : function(){
        	var pageStep1 = {
	        		title:'存管账户',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
	        		
	        		rightButton:{
	        			name : '',
	        			func: ''
	        		}
	        		
	        	};
        	Client.initPageTitle(pageStep1);
        	
        	var iSaveAccountList = App.storage.get("iSaveAccountList");
    		if(MUI.isEmpty(iSaveAccountList)){
    			this.mySaveAccountQuery();
    		}else{
    			$("#accountList").empty();
    	  		for(var i=0;i<iSaveAccountList.length;i++){
    	  			var kcoll=iSaveAccountList[i];
    	  			this.addRow(kcoll);
    	  		}
    			Client.hideWaitPanel(1);
    		}
        	
    		
    		
        	Client.hideWaitPanel(1);
        },
        
        saveDetailQuery : function(eleAccount){
        	var $this = this;
        	var param = {
        			eleAccount:eleAccount,
        			beginDate:'20160302',
        			endDate:'20170302',
        			pageFlag:'0',
        			turnPageBeginPos:'0',
        			turnPageShowNum:'10',
        	};
        	Ajax({url:"/saveAccount/querySaveDetailList",data:param,
				success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						var iSaveDetailList = data.iSaveDetailList;
						var totalCount = data.totalCount;
						var iSaveDetailListParam = {
								iSaveDetailList:iSaveDetailList,
								totalCount:totalCount
						};
				  		App.storage.set("iSaveDetailListParam",iSaveDetailListParam);
   						
   					}else{
   						Utils.alertinfo(data.errorMessage);
   					}
					Client.hideWaitPanel(1);
				}
        	});
        	
        },
        
        mySaveAccountQuery : function(){
        	var param={
        		credentialNo:App.storage.get("UserInfo").certNo,//身份证号
        	};
        	Ajax({url:"/saveAccount/querySaveList",data:param,
				success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						var iSaveAccountList = data.iSaveAccountList;
						$("#accountList").empty();
				  		for(var i=0;i<iSaveAccountList.length;i++){
				  			var kcoll=iSaveAccountList[i];
				  			$this.addRow(kcoll);
				  		}
						var totalCount = data.totalCount;
						var iSaveAccountDetailParam = {
								iSaveAccountList:iSaveAccountList,
								totalCount:totalCount
						};
				  		App.storage.set("iSaveAccountList",iSaveAccountList);
   						
   					}else{
   						Utils.alertinfo(data.errorMessage);
   					}
					Client.hideWaitPanel(1);
				}
        	});
        },
        
        addRow : function(kcoll){
        	var p2pName = "";
			p2pName = kcoll.p2pName;
			if(p2pName == '杭州市民卡有限公司'){
				p2pName = '惠民理财';
			}else if(p2pName == '通卡联城网络科技有限公司'){
				p2pName = '通卡联城';
			}else if(p2pName == '北京首创金融资产交易信息服务股份有限公司'){
				p2pName = '首创金服';
			}else if(p2pName == '杭州浙农互联网金融服务有限公司'){
				p2pName = '浙农金服';
			}
			
			var eleAccount = kcoll.eleAccount; 		//账户号
			var openDate = kcoll.openDate;     		//注册时间
			var totalAmount = kcoll.totalAmount;	//账户余额
			var balance = kcoll.balance;			//可用余额
			var balanceNum = parseFloat(balance);
			balance = Utils.formatCurrency(balanceNum/100,2); 
			
			
    		$("#accountList").append('<div class="depoCard">'+
					    			 	'<div class="head row">'+
					    			 		'<div class="cell">'+p2pName+'</div>'+
					    			 		'<span class="dtl fc-blue"  data-val="'+eleAccount+'">明细</span>'+
					    				'</div>'+
					    	            '<div class="cnt">'+
					    	            	'<div class="cardNum"  id="eleAccount">'+eleAccount+'</div>'+
					    	            	'<div class="row ft13 fc-9">'+
					    	            		'<div class="cell">注册时间<span class="fc-3">&nbsp;&nbsp;'+openDate+'</span></div>'+
					    	            		'<div>余额<span class="fc-3">&nbsp;&nbsp;'+balance+'元</span></div>'+
					    	            	'</div>'+
					    	            '</div>'+
					    	        '</div>');
    		var $this = this;
    		$(".dtl").off().on("click",function(){
    			var eleAccount = $(this).attr("data-val");
    			var params = {eleAccount:eleAccount};
        		App.navigate("saveAccount/saveAccountCtl/saveDetail",params);
    		});
    	},
        
        goBack : function(){
			App.navigate("account/mycountCtl/mycount");
    	},
	});

});