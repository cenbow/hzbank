define(function (require, exports, module) {
	
	var MySaveTemplate = require("text!../template/mySave.html");
	
	var MySaveView = module.exports = ItemView.extend({
		
        template : MySaveTemplate,
        
        events:{
        	"click #happySaveBuy":"happySaveBuy",
        	"click #happySaveCancel":"happySaveCancel"
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
        	var setHeight = pubParam.clientHeight - 368; //需要占满屏幕高度所需高度
    		document.querySelector('#noData').style.height = setHeight+ 'px';
        	
        	this.rate = ["一天","七天","三个月","六个月","一年","两年","三年","五年"];
    		this.label = [0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00];
    		this.drawPic();
    		
        	this.initData();

        },
        initData : function(){
        	//收益查询
        	this.queryDepositDetail();
        	
        	var depositRate = App.storage.get("depositRate");
        	if(depositRate){
        		this.rate = depositRate.rate;
        		this.label = depositRate.label;
        		this.drawPic();
        		this.qryIsDone = true;
        	}else{
        		this.queryRate();
        	}
        	
        },
        goBack : function(){
        	App.back();
     	  },
     	  
		help : function(){
			  App.navigate("anymore/anymoreCtl/messageCenter");
		},
		//幸福乐存
		happySaveBuy : function(){
			if(Utils.checkRealUser()){
				Client.menuOpt("2");
	    		App.navigate("deposit/depositCtl/depositIn");
			}
		},
		happySaveCancel : function(){
			if(Utils.checkRealUser()){
				Client.menuOpt("2");
	    		App.navigate("deposit/depositCtl/depositOutDetail");
			}
		},
		queryRate : function(){
        	
        	var rate = [];
        	var label = [];
        	var $this = this;
        	Client.openWaitPanel("拼命加载中，请稍候");
        	Ajax({url:"/finance/queryRmbRate",data:{}, 
    			success:function(data){
    				if(data.errorCode){
    					Utils.alertinfo(data.errorMessage);
    					Client.hideWaitPanel(1);
    				}else{
    					var iApparList = data.iApparList;
    					
    					for(index in iApparList){
    						var appar = iApparList[index];
    						rate.push(appar.aprShowMsg);
    						label.push(appar.aprName);
    					}
    					$this.rate = rate;
    					$this.label = label;
    					$this.drawPic();
    					App.storage.set("depositRate",{rate:rate,label:label});
    				}
    				$this.qryIsDone = true;
    				$this.qryHideWait();
    			},error:function(){
    				$this.qryIsDone = true;
    				$this.qryHideWait();
    			}
        	});
        },
		drawPic : function(){
			var $this = this;
			var myBar = this.myBar= echarts.init(document.getElementById('barChart'));  
			var opt = {
			   tooltip: {
					show : true,
					formatter: '{c}'
				},
				calculable : false,
				xAxis : [{
						axisTick : {show:false},
						axisLine :{
							lineStyle:{
							   color: '#FABA69', 
							   width: 1, 
							   type: 'solid'
							}
						},
						splitLine : {
							show:true,
							lineStyle:{
							   color: '#FFE8CC', 
							   width: 1, 
							   type: 'dotted'
							}
						},
						axisLabel : {
							textStyle: { 
							  color: '#979797',
							  fontSize: 8
							}
						},
						type : 'category',
		            	data : $this.label
				}],
				yAxis : [{
					axisTick : {show:false},
					axisLine :{
						lineStyle:{
						   color: '#FABA69', 
						   width: 1, 
						   type: 'solid'
						}
					},
					splitLine : {
						show:true,
						lineStyle:{
						   color: '#FFE8CC', 
						   width: 1, 
						   type: 'dotted'
						}
					},
					axisLabel : {
						margin : 4,
						textStyle: { 
						  color: '#979797',
						  fontSize: 10
						},
						formatter: function(value){
							return (value + '.00');
						}
						
					}
				}],
				grid : {
				  borderWidth:0,
				  backgroundColor :'rgba(255,145,0,0.08)',
				  x:35,
				  y:10,
				  x2:15,
				  y2:36
				},
				series : [{
					
					barWidth: 15, 
					itemStyle: {
						normal: {                   // 系列级个性化，横向渐变填充
							// barBorderRadius: 3,
							color : '#FF6C00'
						}							  
					},
					type:'bar',
					data:$this.rate,
					markPoint : {
						symbol: 'heart',
						symbolSize: 8,
		                data : [
		                    {type : 'max', name: '最高利率'}
		                ],
						itemStyle: {
						  normal: { 
							color: 'rgba(0,0,0,0)',
							label : {
								textStyle: { 
									  color: '#FF6C00',
									  baseline: 'bottom'
									}
								}
							}
						 }
		            }
				}]
			};
			setTimeout(function(){
				$this.myBar.setOption(opt);
			},300);
		  
		},
		queryDepositDetail : function(){
		    var cardNo = "";
		    var accountType = "";
    		var cardNo = Utils.getEleCard().cardNo;//电子账号
    		var accountType = Utils.getEleCard().accountType;//电子账户类型
    		var param = {
    				accountNo:cardNo,
    				accountType2:accountType
    		};
    		var $this = this;
    		Client.openWaitPanel("拼命加载中，请稍候");
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
    					$this.addRow("listHead",accountNo,balance,interestBeginDate,info);
    				}
    				
    				
    			}else{
    				Utils.alertinfo(data.errorMessage);
    			}
    			if($("#iAccountDetail tr").length<=1){
					$('#noData').show();
				}else{
					$('#noData').hide();
				}
    			$this.addIsDone = true;
				$this.qryHideWait();
    		}});		
    	},
    	addRow : function(id,accountNo,balance,interestBeginDate,info){
    		var balanceTem = balance.replace(/,/g,"");
    		if(parseFloat(balanceTem)/10000 >1){
    			balance = Utils.formatCurrency(parseFloat(balanceTem)/10000,2)+"万";
    		}
    		
    		$("#"+id).after('<tr>'+
    				'<td>'+
    					'<p>'+this.formatAccount(accountNo)+'</p>'+
    					'<p class="ft12 fc-9">起息日：'+interestBeginDate+'</p>'+
    				'</td>'+
    				'<td>'+
						'<p>'+balance+'</p>'+
    				'</td>'+
    				'<td>'+
    					'<p class="fc-orange" id= "'+accountNo+'" name="'+info+'">收益查询</p>'+
    				'</td>'+
    			'</tr>');
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
        
    	qryHideWait : function(){
    		if(this.qryIsDone&&this.addIsDone){
    			Client.hideWaitPanel(100);
    		}
    	}
        
	});
});