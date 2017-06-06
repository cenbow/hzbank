define(function (require, exports, module) {
	
	var saveDetailTemplate = require("text!../template/saveDetail.html");
	
	var saveDetailView = module.exports = ItemView.extend({
		
        template : saveDetailTemplate,
        
        events:{
        	
        },
        
        initialize : function(){
        	//初始化菜单方法
	       	 var pageStep1 = {
	       		  	title:'交易明细',
	       			leftButton:{
	       				name : '返回',
	       				func: 'curView.goBack()'
	       			},
	       			rightButton:{
	       				name : '',
	       				func : ''
	       			}
	       	  };
        	Client.initPageTitle(pageStep1);
        	var $this = this;
        	$this.saveDetailQuery('0','0');
    	  	
        	Client.hideWaitPanel(1);
        	
        	this.initDrag();
        	
        },
        
        saveDetailQuery : function(pos,num){
        	var $this = this;
        	var ul = $("#detailList");
        	var param = {
        			eleAccount : App.storage.get("_parameters").eleAccount,
        			pageFlag:num,
        			turnPageBeginPos:pos,
        			turnPageShowNum:'9',
        	};
        	Ajax({url:"/saveAccount/querySaveDetailList",data:param,
				success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						var iSaveDetailList = data.iSaveDetailList;
						$("#iSaveDetailList").empty();
				  		for(var i=0;i<iSaveDetailList.length;i++){
				  			var kcoll=iSaveDetailList[i];
				  			$this.addRow(kcoll);
				  		}
						var totalCount = data.totalCount;
						var iSaveDetailListParam = {
								iSaveDetailList:iSaveDetailList,
								totalCount:totalCount
						};
				  		App.storage.set("iSaveDetailListParam",iSaveDetailListParam);
				  		if(ul.find('.list-item').length>=totalCount){
							$this.mysc.dragLoad = false;
							$(".pullUp").hide();
						}else{
							$this.mysc.dragLoad = true;
							$(".pullUp").show();
						}
						
						if(totalCount=="0"){
							$this.mysc.dragLoad = false;
							$("#wrapper").hide();
							$('#noData').show();
						}else{
							$('#noData').hide();
							$("#wrapper").show();
							$this.mysc.dragLoad = true;
						}
				  		$this.mysc.refresh();	//DOM 加载结束后必须调用
				  		ul.attr("total",totalCount);
   					}else{
   						Utils.alertinfo(data.errorMessage);
   						if(param.pageFlag != "1"){
   							$("#wrapper").hide();
   							$('#noData').show();
   						}
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
				p2pName = '通卡联城';
			}
			
			var transDate = kcoll.transDate;
			var transTime = kcoll.transTime;
			var busiType = kcoll.busiType;
			var amount = kcoll.amount;
			var amountNum = parseFloat(amount);
			amount = Utils.formatCurrency(amountNum/100,2);
			var busiTypeName ;
			var pigid ;
			if(busiType =='01'){
				busiTypeName = '充值';
				pigid = 'g';
				amount = "+"+amount;
			}else if(busiType =='02'){
				busiTypeName = '提现';
				pigid = 'g';
				amount = "-"+amount;
			}else if(busiType =='03'){
				busiTypeName = '购买';
				pigid = 'i';
				amount = "-"+amount;
			}else if(busiType =='04'){
				busiTypeName = '赎回';
				pigid = 'i';
				amount = "+"+amount;
			}else if(busiType =='07'){
				busiTypeName = '撤销';
				pigid = 'i';
				amount = "+"+amount;
			}
		
			
			var nowDate = new Date();
			var year = nowDate.getFullYear();
			var nowMonth = nowDate.getMonth() + 1 < 10 ? "0"+(nowDate.getMonth() + 1):nowDate.getMonth() + 1;
			var nowDay = nowDate.getDate() < 10 ? "0"+nowDate.getDate() : nowDate.getDate();
			var taday = year+nowMonth+nowDay+"000000";
			var mydate = transDate .replace(/\-/g,"")+"000000";
			
			var nowDate1 = Utils.parseDate(taday,'yyyyMMddhhmmss').getTime();
			var myDate1 = Utils.parseDate(mydate,'yyyyMMddhhmmss').getTime();
			var subTime = Math.floor((nowDate1 - myDate1)/(24*3600*1000));
			
			if(subTime == 0){
				week = "今天";
				time = transTime(0,5);
			}else if(subTime == 1){
				week = "昨天";
				time = transTime(0,5);
			}else{
				week = Utils.getWeek(Utils.parseDate(mydate,'yyyyMMddhhmmss').getDay());
				time = transDate.substring(5,10);
			}
			
    		$("#detailList").append('<div class="list-item row">'+
					    			 	'<div class="fc-9 ml5">'+
					    			 		'<h1 class="ft16">'+week+'</h1>'+
					    			 		'<p class="ft12">'+time+'</p>'+
					    				'</div>'+
					    				'<div class="iconBox"><i class="'+pigid+'"></i></div>'+
					    	            '<div class="cell">'+
					    	            	'<h1 class="ft20">'+amount+'</h1>'+
					    	            	'<p class="fc-9 ft12">'+p2pName+busiTypeName+'</p>'+
					    	            '</div>'+
					    	            '<div>'+
					    	            	'<h1 class="ft12 fc-9">交易成功</h1>'+
					    	            '</div>'+
					    	        '</div>');
					    	        
    	},
    	
    	initDrag : function(){
		    
		    /*********************调用滚动插件**************************/
			
			var el = document.querySelector('#wrapper');
			el.style.height = pubParam.clientHeight - 0 + 'px';
			document.getElementById('noData').style.height= pubParam.clientHeight - 0 + 'px';
			var $this = this;
			this.mysc = MUI.loadRefresh(el, {
				
				dragRefresh : false,
				loadCallback : function(){
		    	   var pos = $('#detailList').find('.list-item').length+1;
		    	   if(pos <= $('#detailList').attr("total")){
						 $this.saveDetailQuery(pos,"1");
		    	   }
		   	    }
		    });

		    /***********************************************/
		},
    	
        goBack : function(){
        	App.back();
     	  },
	});
});