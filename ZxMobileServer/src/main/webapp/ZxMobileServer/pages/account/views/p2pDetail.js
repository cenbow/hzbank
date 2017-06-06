define(function (require, exports, module) {
	
	var P2PDetailTemplate = require("text!../template/p2pDetail.html");
	var P2PDetailItem = require("text!../template/p2pDetailTpl.html");
	var P2PDetailItem2 = require("text!../template/p2pDetailTpl2.html");
	
	var P2PDetailView = module.exports = ItemView.extend({
		
        template : P2PDetailTemplate,
        
        events:{
        	"click #tobuy" : "tobuy",
        },
        
        initialize : function(){
        	var pageTest = {
    			  	title:'幸福金禧',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				},
    				rightButton:{
            			name : ''
    				}
    			  };
    		Client.initPageTitle(pageTest);
    		
    		this.initFlag=true;
    		var totalP2P="";
    		var paramAccount = App.storage.get("paramAccount");
    		if(paramAccount){
        		totalP2P= Utils.formatCurrency(paramAccount.p2pSum,2);   		
    		}else{
        		totalP2P= Utils.formatCurrency(App.storage.get("totalP2P"),2);   		
    		}
    		$("#totalShow").text(totalP2P);
    		this.orgTxNo ="";
    		
    		var padd = (pubParam.clientHeight/2 - 80);
    		$("#noData").css("padding", padd + 'px 0');
        	this.init();
        	var $this=this;
    		$('.filterTab .cell').off().on('click', function(){
				var cur = $(this);
				cur.addClass('active').siblings().removeClass('active');
				var index = cur.attr("index");
				
				if("1"==index){
					$this.init();
				}else{
					$this.showP2PDetail(index);					
				}
				
    		});
        	
        },
		init:function(){
        	var iP2PRaisingList = App.storage.get("iP2PRaisingList");
			if (!MUI.isEmpty(iP2PRaisingList)) {
        		this.showP2PDetail2(iP2PRaisingList);
				Client.hideWaitPanel();
        	}else{
        		this.saleProductRaisingQuery();
        	}			
		},
    	
       	showP2PDetail : function(tag){
    		var ul = $("#p2pDetail");
    		var iP2PProList = App.storage.get("iP2PProList");
    		var iP2PProListTemp = [];
    		var tan="";
    		if(tag == '2'){
    			tag = '20';
    			tan = '80';
    		}else if(tag == '3'){
    			tag = '60';
    			tan = '81';
    		}

			for(var i=0; i<iP2PProList.length; i++){
				var kcoll = iP2PProList[i];
				if(tag == kcoll.state || tan == kcoll.state){
					iP2PProListTemp.push(kcoll);
				}
			}  		

			var html = _.template(P2PDetailItem, {iP2PProList:iP2PProListTemp});
			ul.html(html);
			
			$("#ip2Num").html('共计<span class="fc-orange" >'+iP2PProListTemp.length+'</span>支产品');
			
    		if(iP2PProListTemp.length == 0){
				$("#wrapper").hide();
				$('#noData').show();
    		}else{
				$('#noData').hide();
				$("#wrapper").show();
				this.toTransfer();
    		}    		
    	},
       	showP2PDetail2 : function(iP2PRaisingList){

			
			$("#ip2Num").html('共计<span class="fc-orange" >'+iP2PRaisingList.length+'</span>笔记录');
			
    		if(iP2PRaisingList.length == 0){
    			if(this.initFlag){
    				var cur = $(".filterTab .cell[index='2']");
    				cur.addClass('active').siblings().removeClass('active');
    				this.showP2PDetail(2);
    				this.initFlag=false;
    			}else{
    	    		var ul = $("#p2pDetail");
    				var html = _.template(P2PDetailItem2, {iP2PRaisingList:iP2PRaisingList});
    				ul.html(html);
    				$("#wrapper").hide();
    				$('#noData').show();    				
    			}
    		}else{
	    		var ul = $("#p2pDetail");
				var html = _.template(P2PDetailItem2, {iP2PRaisingList:iP2PRaisingList});
				ul.html(html);
				$('#noData').hide();
				$("#wrapper").show();
				this.detailInfoQuery();
				this.gotoProductCancel();
    		}    		
    	},
        //客户募集中购买记录
    	saleProductRaisingQuery : function(){	
    			var $this=this;
				var param={
				};
				Client.openWaitPanel("拼命加载中，请稍候");
				Ajax({
					url : "/product/saleProductRaisingQuery",
					data : param,
					success : function(data) {
						if (MUI.isEmpty(data.errorCode)) {
							
							var iP2PRaisingList=data.iP2PRaisingList;
							App.storage.set("iP2PRaisingList",iP2PRaisingList);
							$this.showP2PDetail2(iP2PRaisingList);
						} else {
							Utils.alertinfo(data.errorMessage);
						}
						Client.hideWaitPanel();
					},
					error : function() {
						Client.hideWaitPanel();
						Utils.alertinfo("服务器异常！");
					}
				});
    		
    	},
        //通过产品号查询产品明细
    	detailInfoQuery : function(){
    		$('.addBuy').off().on('click',function(){

			   var financeNo = $(this).attr("data-val");
				var param={
						financeNo:financeNo
				};
				Client.openWaitPanel("拼命加载中，请稍候");
				Ajax({
					url : "/product/detailInfoQuery",
					data : param,
					success : function(data) {
						if (MUI.isEmpty(data.errorCode)) {							
							App.navigate("product/productCtl/investDetail",data);
						} else {
							Utils.alertinfo(data.errorMessage);
						}
						Client.hideWaitPanel();
					},
					error : function() {
						Client.hideWaitPanel();
						Utils.alertinfo("服务器异常！");
					}
				});
    		});
    	}, 
        //产品撤单
    	gotoProductCancel : function(){
    		var $this=this;
    		$('.productCancel').off().on('click',function(){
 			   var data = $(this).attr("data-val");
 			   var datas = data.split("|");
 				var param={
 						orderFlowNo:datas[0],
 						projectNo:datas[1],
 						projectName:datas[2],
 						tranAmt:datas[3],
 						orderSubmitTime:datas[4]
 				};
				App.navigate("product/productCtl/productCancel",param);

    		});
    	}, 

        //交易明细查询  	
    	saleProductTradeDetail : function(){
    		$this  = this;
    		$('.myItem').off().on('click',function(){
				if($(this).attr('disabled')){ //确定按钮可点击
					return;
				}
				$(this).attr('disabled',true);
				var thisRemove  = $(this);
				setTimeout(function(){
					thisRemove.removeClass('disabled').removeAttr('disabled');
				},500);
				
				var value=$(this).attr('value');
				var param={
						projectNo:value
				};
				Client.openWaitPanel("拼命加载中，请稍候");
				Ajax({
					url : "/sale_product/life_saleProductTradeDetail",
					data : param,
					success : function(data) {
						if (MUI.isEmpty(data.errorCode)) {
							var cd=data.cd;
							
							var iP2PProTradeList=cd.iP2PProTradeList;
							App.storage.set("iP2PProTradeList",iP2PProTradeList);
							App.navigate("account/mycountCtl/myTradeDetail",iP2PProTradeList);

						} else {
							Utils.alertinfo(data.errorMessage);
							Client.hideWaitPanel();
						}
					},
					error : function() {
						Client.hideWaitPanel();
						Utils.alertinfo("服务器异常！");
					}
				});
			});
    		
    	},
    	
    	toTransfer : function(){//点击当前的产品，就把当前产品的信息带到下一个页面
    		$(".curm").off().on("click",function(){
    			var state = $(this).attr("cur4");
    			if(state=="60" || state=="81"){
    				return;
    			}
				var totalAmt = $(this).attr("cur1");
				var projectNo = $(this).attr("cur2");
				var financePreInterestRate = $(this).attr("cur3");
				var tranFlowNo = $(this).attr("cur5");
	        	var param={
	        			financeNo:projectNo,
	        			tranFlowNo:tranFlowNo, //查持有表的时候返回转让流水
	    			};
	    			Client.openWaitPanel("拼命加载中，请稍候");
	    			Ajax({url:"/product/productDetailQuery",data:param, success:function(data){
	    				if(Utils.isEmpty(data.errorCode)){
	    					var financeNo = data.financeNo;
	    					var financeName = data.financeName;
	    					var raisebegintime = data.raisebegintime;
	    					var limitamount = data.limitamount;
	    					limitamount = Utils.formatCurrency(limitamount/10000,2);
	    					if(limitamount=="0.00"){
	    						limitamount="购买无限额";
	    					}else{
	    						limitamount="每人累计"+limitamount+"万元";
	    					}
	    					var raisebegindate = data.raisebegindate;
	    					var raisebegindate1 = raisebegindate.substring(4,6)+"-"+raisebegindate.substring(6,8);
	    					raisebegindate = raisebegindate.substring(0,4)+"-"+raisebegindate.substring(4,6)+"-"+raisebegindate.substring(6,8);
	    					var raiseenddate = data.raiseenddate;
	    					var raiseenddate1 = raiseenddate.substring(4,6)+"-"+raiseenddate.substring(6,8);
	    					raiseenddate = raiseenddate.substring(0,4)+"-"+raiseenddate.substring(4,6)+"-"+raiseenddate.substring(6,8);
	    					var repaymentType = data.repaymentType;
	    					if(repaymentType=="1"){
	    						repaymentType="到期一次性还本付息";
	    					}
	    					var interestBeginDate = data.interestBeginDate;
	    					var interestBeginDate1 = interestBeginDate.substring(4,6)+"-"+interestBeginDate.substring(6,8);
	    					interestBeginDate = interestBeginDate.substring(0,4)+"-"+interestBeginDate.substring(4,6)+"-"+interestBeginDate.substring(6,8);
	    					var interestEndDate = data.interestEndDate;
	    					var sysTime = new Date().getFullYear();
	    					var interestEndDate1="";
	    					if(sysTime<interestEndDate.substring(0,4)){
	    						interestEndDate1 = interestEndDate.substring(0,4)+"-"+interestEndDate.substring(4,6)+"-"+interestEndDate.substring(6,8);
	    					}else{
	    						interestEndDate1 = interestEndDate.substring(4,6)+"-"+interestEndDate.substring(6,8);
	    					}
	    					interestEndDate = interestEndDate.substring(0,4)+"-"+interestEndDate.substring(4,6)+"-"+interestEndDate.substring(6,8);
	    					var financeUseVol = Utils.formatCurrency(data.financeUseVol/10000,2);
	    					var financeTotalAmt = Utils.formatCurrency(data.financeTotalAmt/10000,2);
	    					var financeDetail = data.financeDetail;
	    					var tranRateMin = data.tranRateMin;
	    					var tranRateMax = data.tranRateMax;
	    					var tranHoldDays = parseFloat(data.tranHoldDays);
	    					var transferCapital = parseFloat(data.transferCapital);
	    					var tranRate = parseFloat(data.tranRate);
	    					var fundRestDay = data.fundRestDay;
	    					
	    					var tranflag = data.tranflag;
	    					var preStt = data.preStt;
	    					var redDays = data.redDays;
	    					var transferData ={
	    							financeNo:financeNo,
	    							financeName:financeName,
	    							raisebegintime:raisebegintime,
	    							limitamount:limitamount,
	    							raisebegindate:raisebegindate,
	    							raiseenddate:raiseenddate,
	    							repaymentType:repaymentType,
	    							interestBeginDate:interestBeginDate,
	    							interestEndDate:interestEndDate,
	    							financeUseVol:financeUseVol,
	    							financeTotalAmt:financeTotalAmt,
	    							financeDetail:financeDetail,
	    							tranRateMin:tranRateMin,
	    							tranRateMax:tranRateMax,
	    							tranHoldDays:tranHoldDays,
	    							transferCapital:transferCapital,
	    							tranRate:tranRate,
	    							fundRestDay:fundRestDay,
	    							raisebegindate1:raisebegindate1,
	    							raiseenddate1:raiseenddate1,
	    							interestBeginDate1:interestBeginDate1,
	    							interestEndDate1:interestEndDate1,
	    							tranflag:tranflag,
	    							preStt:preStt,
	    							redDays:redDays,
	    							tranFlowNo:tranFlowNo,
	    							state:state,
	    							sysTime:data.sysTime,
	    							financePreInterestRate:financePreInterestRate,
	    							totalAmt:totalAmt
	    					};
	    					App.navigate("account/mycountCtl/goToTransfer",transferData);
	        			}else{
	        				Utils.alertinfo(data.errorMessage);
	        			}
	    				Client.hideWaitPanel(1);
	    			},error:function(){
	    				Utils.alertinfo(data.errorMessage);
	        			Client.hideWaitPanel(1);
	        		}});
			});
    	},
   	
    	tobuy : function(){
    		App.navigate("product/productCtl/saleProducts");
    	},
        
        goBack : function(){
        	App.navigate("account/mycountCtl/mycount");
    	},   	
		
	});
});