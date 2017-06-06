define(function(require, exports, module){
	
	var goldRecodsTpl = require("text!../template/goldRecods.html");
	
	var goldRecodsView = module.exports = ItemView.extend({
		
		events : {
			"click #back" : "goBack",
		},
		
		template : goldRecodsTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			this.kcoll={};
			var type = Utils.search().type;
			if(type != null && type != ""){
				$(".tab .cell[data-value='"+type+"']").addClass("active").siblings().removeClass("active");
			}
			this.queryRecods();
			
		    var $this = this;
		    $(".tab .cell").on("click",function(){
		    	var index = $(this).attr("data-value");
		    	$(this).addClass("active").siblings().removeClass("active");
		    	if(index == 2){
		    		$this.queryRevoke();
		    	}else{
		    		$this.showList($this.iBoseraGolgDetail,index);
		    	}
		    	
		    });
		},
		
		queryRecods : function() {
			var param = {
					productId : Utils.getParamDisplay("PB_BOSERA", '3'),
					cardNo : Utils.getEleCard().cardNo,
					startTime : Utils.toDateString(new Date(new Date().getTime()-31536000000),"yyyyMMdd"),
					endTime : Utils.toDateString(new Date(),"yyyyMMdd")
			};
			var $this = this;
			Ajax({
				url : "/bosera/boseraGoldDetailQuery",
				data : param,
				success : function(data) {
					if (MUI.isEmpty(data.errorCode)) {
						var type = Utils.search().type;
						if(type != null && type != ""){
							$this.showList(data.iBoseraGolgDetail,type);
						}else{
							$this.showList(data.iBoseraGolgDetail,"01");
						}
						$this.iBoseraGolgDetail = data.iBoseraGolgDetail;
					} else {
						//Utils.alertinfo(data.errorMessage);
						$(".allCnt").hide();
						$("#noData").show();
						Client.hideWaitPanel(1);
					}
				}
			});
		},
		
		queryRevoke : function() {
			var param = {
					productId : Utils.getParamDisplay("PB_BOSERA", '3'),
					cardNo : Utils.getEleCard().cardNo
			};
			var $this = this;
			Ajax({
				url : "/bosera/revokeFlowQuery",
				data : param,
				success : function(data) {
					if (MUI.isEmpty(data.errorCode)) {
						$("#list").empty();
						var iRevokeList = data.iRevokeList;
						$this.showList1(iRevokeList);
//						for(var i=0;i<iRevokeList.length;i++){
//				  			var kcoll=iRevokeList[i];
//				  			$this.addRow(kcoll);
//				  		}
					} else {
						$(".allCnt").hide();
						$("#noData").show();
						Client.hideWaitPanel(1);
					}
				}
			});
		},
		
		
		showList1:function(iRevokeList){
			var html = '',$this=this,monthList=[],mon="";
			
			$.each(iRevokeList,function(i,item){
				if(mon == item.transferDate.split('-')[1]){
					monthList[monthList.length-1].push(item);
				}else{
					monthList.push([item]);
				}
				mon = item.transferDate.split('-')[1];
			});
			
			$.each(monthList,function(i,mons){
				var tmp = "";
				$.each(mons,function(i,item){
					
					var tranAmt = item.tranAmt;
					var showAmt = Utils.formatCurrency(parseFloat(tranAmt),2);
					var showAmt3 = (item.tranSign=='1'?parseFloat(item.tranAmt/100).toFixed(4)+'克':showAmt+'元');
					var flowid = item.flowid;	
					var tranSign = item.tranSign;
						tmp += '<div class="list-item row">'+
								 '<div class="cell">'+
			    	            	'<p>'+$this.tranType(item.tranSign)+'</p>'+
			    	            	'<p class="fc-b9">'+item.transferDate+' '+item.transferTime.substring(0,5)+'</p>'+
			    	            '</div>'+
			    	            '<div class="cell txt-r" data-val="'+flowid+'" data-val1="'+showAmt3+'" data-val2="'+tranSign+'" data-val3="'+item.transferDate+'" data-val4="'+item.transferTime.substring(0,5)+'"data-val5="'+tranAmt+'">'+
			    	            	'<p>'+showAmt3+'</p>'+
			    	            	'<p class="fc-orange" >可撤单</p>'+
			    	            '</div>'
	    	            	+'</div>';
				});
				if(tmp!=""){
					html += '<h1 class="tt">'+mons[0].transferDate.split('-')[1]+'月</h1><div class="list">'+
							tmp+'</div>';
				}
			});
			$("#list").html(html);
			$(".txt-r").off().on("click",function(){
    			var flowid = $(this).attr("data-val");
    			var tranAmt1 = $(this).attr("data-val1");
    			var tranSign = $(this).attr("data-val2");
    			var transferDate = $(this).attr("data-val3");
    			var transferTime = $(this).attr("data-val4");
    			var purchaseAmt = $(this).attr("data-val5");
    			var params={
    					flowid:flowid,
    					tranAmt:tranAmt1,
    					tranSign:tranSign,
    					transferDate:transferDate,
    					transferTime:transferTime,
    					purchaseAmt:purchaseAmt
    			};
    			App.navigate("gold/goldCtl/goldRevoke",params);
    		});
			if(html == ''){
				$(".allCnt").hide();
				$("#noData").show();
			}else{
				$(".allCnt").show();
				$("#noData").hide();
			}
			Client.hideWaitPanel(1);
		},
		
		
		showList:function(iBoseraGolgDetail,type){
			var html = '',$this=this,monthList=[],mon="";
			
			$.each(iBoseraGolgDetail,function(i,item){
				if(mon == item.transferDate.split('-')[1]){
					monthList[monthList.length-1].push(item);
				}else{
					monthList.push([item]);
				}
				mon = item.transferDate.split('-')[1];
			});
			
			$.each(monthList,function(i,mons){
				var tmp = "";
				$.each(mons,function(i,item){
					if(type.indexOf(item.financeType)>=0){
						tmp += '<div class="list-item row">'+
						'<div class="cell">'+
							'<p>'+$this.tranType(item.financeType)+'</p>'+
							'<p class="fc-b9">'+item.transferDate+' '+item.transferTime.substring(0,5)+'</p>'+
						'</div><div class="cell txt-r">'+
							'<p>'+(item.financeType=='1'?parseFloat(item.share/100).toFixed(4)+'克':item.share+'元')+(item.state=='1'?'(含手续费'+item.feeAmount+'元)':'')+'</p>'+
							'<p class="'+(item.state=='1'?'fc-green':'fc-orange')+'">'+$this.tranState(item.state)+'</p>'+
							'</div></div>';
					}
				});
				if(tmp!=""){
					html += '<h1 class="tt">'+mons[0].transferDate.split('-')[1]+'月</h1><div class="list">'+
							tmp+'</div>';
				}
			});
			
			$("#list").html(html);
			if(html == ''){
				$(".allCnt").hide();
				$("#noData").show();
			}else{
				$(".allCnt").show();
				$("#noData").hide();
			}
			Client.hideWaitPanel(1);
		},
		
		tranType : function(type){
			switch(type){
				case '0':
					return '买入';
					break;
				case '1':
					return '卖出';
					break;
				case '2':
					return '收益';
					break;
			}
			return type;
		},
		
		tranState:function(state){
			switch(state){
				case '0':
					return '未确认';
					break;
				case '1':
					return '已确认';
					break;
				case '2':
					return '已撤单';
					break;
				case '3':
				case '4':
					return '交易失败';
					break;
			};
		},
		
		torevoke : function(){
//			alert("flowid"+this.kcoll.flowid);
    		var params = {
    				flowid:this.kcall.flowid
    				};
    		App.navigate("gold/goldCtl/goldRevoke",params);
    	},
		
		goBack : function(){
    		App.back();
		}
	});
});
