define(function (require, exports, module) {
	
	var MyAddTemplate = require("text!../template/myAdd.html");
	
	var MyAddView = module.exports = ItemView.extend({
		
        template : MyAddTemplate,
        
        events:{
        	'click #financeIn' : "goToFinanceInPage",
        	'click #financeOut' : "goToFinanceOutPage",
        	'click #totalVol1' : "goTototalVol1"
        },
        
        initialize : function(){
        	//初始化菜单方法
	       	 var pageStep1 = {
	       		  	title:'幸福添利',
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
	       	this.dateArr = ["03-12","03-12","03-12","03-12","03-12","03-12","03-12",];
    		this.sevenyieldArr = [0.00,0.00,0.00,0.00,0.00,0.00,0.00,];
    		this.drawPic();
    		
	       	this.initData();
   		    
        },
        initData : function(){
    		
			//幸福添利数据
			var financeNo = this.financeNo = Utils.getParamDisplay("PB_FINANCE_BALANCE","1");
			var financeName = this.financeName = Utils.getParamDisplay("PB_FINANCE_BALANCE","2");
			var financeClass = "yfd";

    		this.paramHappyAdd ={
    				financeNo:financeNo,
        			financeName:financeName,
        			financeClass:financeClass
    		};
    		this.financeTotalVol = "0.00";
			var paramFinanceUserMobBalInfo = {};//幸福添利session传参
			paramFinanceUserMobBalInfo = this.paramFinanceUserMobBalInfo = App.storage.get("paramFinanceUserMobBalInfo");
			if(paramFinanceUserMobBalInfo){
				var state = this.state = paramFinanceUserMobBalInfo.state;	//状态（0：基金未签约；1：个人网银端已签约；2：直销签约	3 幸福添利未签约 4已签约其他产品）					
				if(state == 0 || state == 3){
					App.navigate("finance/financeCtl/financeBalanceSign",this.paramHappyAdd);	//跳转幸福添利签约页面
				}else if(state == 1){
					App.navigate("finance/financeCtl/financeBalancePrompt",this.paramHappyAdd);//跳转幸福添利个人已签约提示页面
					Client.hideWaitPanel(1);	
					return;
				}else if(state == 4){
					if(paramFinanceUserMobBalInfo.financeNo == this.model.get("financeNo")){
						paramFinanceUserMobBalInfo = {};
						this.queryUserMobBalInfo(paramFinanceUserMobBalInfo);
					}else{
						
						App.navigate("finance/financeCtl/financeBalancePrompt2",this.paramHappyAdd);//跳转幸福添利提示页面
						Client.hideWaitPanel(1);						
					}
				}else{
					if(!MUI.isEmpty(this.model.get("financeNo"))&&(paramFinanceUserMobBalInfo.financeNo != this.model.get("financeNo"))){
						App.navigate("finance/financeCtl/financeBalancePrompt2",this.paramHappyAdd);//跳转幸福添利提示页面
						Client.hideWaitPanel(1);	
						return;
					}
					
					var iFinanceBalance = paramFinanceUserMobBalInfo.iFinanceBalance;
					var iSevenRateInfo = paramFinanceUserMobBalInfo.iSevenRateInfo;
					var iBalanceTotal = paramFinanceUserMobBalInfo.iBalanceTotal;
					var totalAmt = "0.00";
					
					
					if(iFinanceBalance.length>0){
						this.financeTotalVol = iFinanceBalance[0].financeVol;
						totalAmt = iFinanceBalance[0].totalAmt;
					}
					var tranAmt="0.00";
					if(iBalanceTotal.length>0){
						var kcoll = iBalanceTotal[0];
						tranAmt = kcoll.tranAmt;
						$(".financeTotalVolTwo").text(Utils.formatCurrency(tranAmt));
					}
					$('.financeTotalVolOne').text(Utils.formatCurrency(this.financeTotalVol));
					$('.sp_tranAmtTotal').text(Utils.formatCurrency(totalAmt));
					
					this.dateArr = [];
		    		this.sevenyieldArr = [];
					for(var a = 0; a < iSevenRateInfo.length; a++){
						var kColl =  iSevenRateInfo[a];
						
						var sevenyield = Utils.toRetentionDigit(kColl.sevenyield,3);
						var updateDate = kColl.updateDate;
						var date = updateDate.substr(4,2)+"-"+updateDate.substr(6,2);
						this.dateArr.push(date);
						this.sevenyieldArr.push(sevenyield);
						
					}
					this.drawPic();
					Client.hideWaitPanel(1); 
				};
			}else{
				paramFinanceUserMobBalInfo = {};
				this.queryUserMobBalInfo(paramFinanceUserMobBalInfo);
			};
			
        	
        },
        
        queryUserMobBalInfo : function(paramFinanceUserMobBalInfo){
    		var cardNo = Utils.getCardNoByFlag("0","cardFlag1");
    		
        	if(MUI.isEmpty(cardNo)){
				App.navigate("finance/financeCtl/financeBalanceSign",this.paramHappyAdd);	//跳转幸福添利签约页面
    			return;
    		}
			var param = {
					cardNo:cardNo,
					fundCode:this.paramHappyAdd.financeNo
			};
			var $this = this;
			Ajax({url:"/finance/queryUserMobBalInfo",data:param, success:function(data){
				if(Utils.isEmpty(data.errorCode)){
					var kcoll;
					var state = $this.state = data.state;	//状态（0：基金未签约；1：个人网银端已签约；2：直销签约	3 幸福添利未签约）
					var financeNo = data.financeNo;
					var iFinanceBalance = data.iFinanceBalance;
					var iFinanceBalanceInfo = data.iFinanceBalanceInfo;
					var iSevenRateInfo = data.iSevenRateInfo;
					//幸福添利昨日收益查询
					var iBalanceTotal = data.iBalanceTotal;

					paramFinanceUserMobBalInfo.state=state;
					paramFinanceUserMobBalInfo.financeNo=financeNo;
					paramFinanceUserMobBalInfo.iFinanceBalance=iFinanceBalance;
					paramFinanceUserMobBalInfo.iFinanceBalanceInfo=iFinanceBalanceInfo;
					paramFinanceUserMobBalInfo.iSevenRateInfo=iSevenRateInfo;
					paramFinanceUserMobBalInfo.iBalanceTotal=iBalanceTotal;
					
					$this.paramFinanceUserMobBalInfo = paramFinanceUserMobBalInfo;
					App.storage.set("paramFinanceUserMobBalInfo",paramFinanceUserMobBalInfo);//将参数放入session
					if(state == 0 || state == 3){
						App.navigate("finance/financeCtl/financeBalanceSign",$this.paramHappyAdd);	//跳转幸福添利签约页面
						return;
					}else if(state == 1){
						App.navigate("finance/financeCtl/financeBalancePrompt",$this.paramHappyAdd);//跳转幸福添利个人已签约提示页面
						Client.hideWaitPanel();
						return;
					}else if(state == 4){
						App.navigate("finance/financeCtl/financeBalancePrompt2",$this.paramHappyAdd);//跳转幸福添利提示页面
						Client.hideWaitPanel();
						return;
					}
					
					if(iFinanceBalance.length>0){
						kcoll = iFinanceBalance[0];
						$this.financeTotalVol = kcoll.financeVol;
						totalAmt = kcoll.totalAmt;
						
					}
					var tranAmt = "0.00";
					//幸福添利昨日收益查询
					if(iBalanceTotal.length>0){
						tranAmt = iBalanceTotal[0].tranAmt;
					}
					$('.financeTotalVolOne').text(Utils.formatCurrency($this.financeTotalVol));
					$('.financeTotalVolTwo').text(Utils.formatCurrency(tranAmt));
					$('.sp_tranAmtTotal').text(Utils.formatCurrency(totalAmt));
					$this.dateArr = [];
					$this.sevenyieldArr = [];
					for(var a = 0; a < iSevenRateInfo.length; a++){
						var kColl_for =  iSevenRateInfo[a];
						
						var sevenyield = Utils.toRetentionDigit(kColl_for.sevenyield*100,2);
						var updateDate = kColl_for.updateDate;
						var date = updateDate.substr(4,2)+"-"+updateDate.substr(6,2);
						$this.dateArr.push(date);
						$this.sevenyieldArr.push(sevenyield);
						
					}
					$this.drawPic();
					$this.state = state;
					Client.hideWaitPanel(1);
				}else{
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(1);
				}
			},error:function(){
				Client.hideWaitPanel(1);
			}});
    	},
        goBack : function(){
        	App.back();
     	  },
     	  
		help : function(){
			  App.navigate("anymore/anymoreCtl/messageCenter");
		},
		drawPic : function(){
			var $this = this;
				var myLine = echarts.init(document.getElementById('lineChart'));  
				var opt = {
				  tooltip: {
					  show :true,
					  formatter: '{c}'
				  },
				  calculable : false,
				  xAxis : [
					  {
						  boundaryGap : false,
						  axisTick : {show:false},
						  axisLine :{
							  lineStyle:{
								 color: '#E5E5E5', 
								 width: 1, 
								 type: 'solid'
							  }
						  },
						  splitLine : {
							  show:true,
							  lineStyle:{
								 color: '#F5F5F5', 
								 width: 1, 
								 type: 'solid'
							  }
						  },
						  axisLabel : {
							  textStyle: { 
								color: '#979797',
								fontSize: 8
							  }
						  },
						  data : $this.dateArr
					  }
				  ],
				  yAxis : [
					  {
						  axisTick : {show:false},
						  axisLine :{
							  lineStyle:{
								 color: '#E5E5E5', 
								 width: 1, 
								 type: 'solid'
							  }
						  },
						  splitLine : {
							  show:true,
							  lineStyle:{
								 color: '#F5F5F5', 
								 width: 1, 
								 type: 'solid'
							  }
						  },
						  type : 'value',
						  axisLabel : {
							  margin : 5,
							  textStyle: { 
								color: '#979797',
								fontSize: 8
							  },
							  formatter: function(value){
								  return (value + '.00');
							  }
						  }
					  }
				  ],
				  grid : {
					borderWidth:0,
					x:35,
					y:10,
					x2:20,
					y2:30
				  },
				  series : [
					  {
						  itemStyle: {
							  normal: {
								  lineStyle: {
									width: 1,
									type:'solid'
								  },
								  label : {  
									  textStyle : {
										  fontSize : '10',
										  fontWeight : 'normal'
									  }
								  },         
								  color : '#FF6C00',
								  areaStyle: {
									 type: 'default', 
									color: 'rgba(255,108,0,0.2)'
								  }
							  }
						  },
						  symbol: 'emptyCircle', // 拐点图形类型
						  symbolSize: 4, //拐点大小,
						  type: 'line',
					  	  data:$this.sevenyieldArr,
						  markPoint : {
							symbol: 'pin',
							symbolSize: 8,
			                data : [
			                    {type : 'max', name: '最高收益'}
			                ],
							itemStyle: {
							  normal: { 
								color: 'rgba(0,0,0,0)',
								label : {
									textStyle: { 
										  color: '#FF6C00',
										  baseline: 'top'
										}
									}
								}
							 }
			            }
					  }
				  ]
				};			
				myLine.setOption(opt);
			 
		},
		goToFinanceInPage : function(){
    		var state = this.state;
    		var param ={
    				financeNo:this.financeNo,
        			financeName:this.financeName
    		};
			if(state == 0 || state == 3){
				App.navigate("finance/financeCtl/financeBalanceSign",param);	//跳转幸福添利签约页面
			}else if(state == 1){
				App.navigate("finance/financeCtl/financeBalancePrompt");//跳转幸福添利个人已签约提示页面
			}else if(state == 4){
//				Client.alertinfo("个人网银已经签约幸福添利！直销不能购买");
				App.navigate("finance/financeCtl/financeBalancePrompt2",param);//跳转幸福添利提示页面
			}else if(state == 2){
				App.navigate("finance/financeCtl/financeBalanceIn",param);	//跳转幸福添利购买页面
			}
    	},
    	
    	goToFinanceOutPage : function(){
    		var state = this.state;
    		var param ={
    				financeNo:this.financeNo,
        			financeName:this.financeName
    		};
			if(state == 0 || state == 3){
				App.navigate("finance/financeCtl/financeBalanceSign",param);	//跳转幸福添利签约页面
			}else if(state == 1){
				App.navigate("finance/financeCtl/financeBalancePrompt");//跳转幸福添利个人已签约提示页面
			}else if(state == 4){
//				Client.alertinfo("个人网银已经签约幸福添利！直销不能转出");
				App.navigate("finance/financeCtl/financeBalancePrompt2",param);//跳转幸福添利提示页面
			}else if(state == 2){
				param.financeTotalVol=this.financeTotalVol;
				App.navigate("finance/financeCtl/financeBalanceOut",param);
			}
    	},
    	
    	goTototalVol1 :function(){
    		var totalAmt=$(".sp_tranAmtTotal").text();
    		var financeNo=this.model.get("financeNo");
    		var param = {
					"totalAmt":totalAmt,
					"financeNo":financeNo
			};
			App.storage.set("param",param);
    		App.navigate("finance/financeCtl/financeBalanceInCome",param);
    	},
        
        
	});
});