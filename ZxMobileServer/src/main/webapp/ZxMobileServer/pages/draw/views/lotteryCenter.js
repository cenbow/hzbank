define(function(require, exports, module){
	var lotteryCenterTpl = require("text!../template/lotteryCenter.html");
	
	
	var myRedPacketView = module.exports = ItemView.extend({
		
		events : {
			"click #closeRuleBtn" : "goBack",
		    "click .drawRztClose" : "closeLottery"
				
			
		},
		
		template : lotteryCenterTpl,
		
		initialize : function(){
			//初始化菜单方法
			var pageTest = {
				  	title:'奖品中心',
					leftButton:{
						name : '返回',
						func : 'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
				  };
			Client.initPageTitle(pageTest);
		
			this.cleanFlag= false;
	    	this.myPhone = App.storage.get("UserInfo").regMobile;
	    	this.myPhoto = App.storage.get('UserInfo').photo;
	    	this.name = App.storage.get("UserInfo").customerNameCN;
	        this.drawResultList = App.storage.get("_parameters").drawResultList;
	        var $this = this;
	    	$('.tab div').on('click', function(){
				var idx = $(this).index();
				$this.loadTabData(idx,$(this));
			});
	    	$this.showPrize();
			Client.hideWaitPanel(1);
		},
		loadTabData:function(index,tab){
			var $this = this;
			if(index ==1){ //红包
				if(MUI.isEmpty($this.iRedPacketList)){
					this.myRedPacketQuery(tab);
				}else{
					$this.switchTab(index, tab);
				}
			}else{//奖品
				$this.switchTab(index, tab);
			}
			
		},
		switchTab:function(index,tab){
			var cur = $('.subPage').eq(index);
			tab.addClass('active').siblings().removeClass('active');
			cur.show().siblings('.subPage').hide();
		},
		myRedPacketQuery : function(tab){
			var $this = this;
        	var param={
        			actionFlag:0
        	};
        	Client.openWaitPanel("拼命加载中，请稍候");
        	Ajax({url:"/newRedPacket/queryMyRedPacket",data:param,
				success:function(data){
				var sysTime ="";
    			if(MUI.isEmpty(data.errorCode)){
    				var cd = data.cd;
					if(!MUI.isEmpty(cd)){
						var iUserRedPacketList = data.cd.iUserRedPacketList;
						sysTime = data.cd.sysTime;
						var iRedPacketList = [];
	    				for(index in iUserRedPacketList){
	    					iRedPacketList.push(iUserRedPacketList[index]);
	    				}
	    				$this.iRedPacketList = iRedPacketList;
					}
					Ajax({url:"/newRedPacket/getActivityTime",data:param,
						success:function(data){
						if(MUI.isEmpty(data.errorCode)){
							var begainDate = data.cd.activityBeginDate;
							var endDate = data.cd.activityEndDate;
							$this.begainDate = begainDate.substring(0,4)+"年"+begainDate.substring(4,6)+"月"+begainDate.substring(6,8)+"日";
							$this.endDate = endDate.substring(0,4)+"年"+endDate.substring(4,6)+"月"+endDate.substring(6,8)+"日";
							App.storage.set("activityRulesDate",{begainDate:$this.begainDate,endDate:$this.endDate});	
							MUI.Cache.save("myRedPacketIsLoaded", true);
							$this.showRed(sysTime);
						}else{
							Utils.alertinfo(data.errorMessage);
						}
//						$this.qryHideWait();
						if(!MUI.isEmpty(tab)){
							$this.switchTab(1, tab);
						}
						Client.hideWaitPanel(1);
					},error:function(){
						Client.hideWaitPanel(1);
//						$this.qryHideWait();
					}});
    				//$this.show(sysTime);
				}else{
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(1);
				}
			},error:function(){
				Client.hideWaitPanel(1);
			}});
        	
		},

		showRed : function(sysTime){
			var $this = this;
			var myPhone = $this.myPhone.substring(0,3)+'******'+$this.myPhone.substring(9,11); 
			var html = "";
			var totalAmt = 0;
			var ul = $("#packetInfoList");
			var myPohot = Utils.checkSession()&&App.storage.get('UserInfo').photo?'<img src="data:image/png;base64,'+App.storage.get('UserInfo').photo+'">':'<img src="images/addressBook/default.png">';
			if(!MUI.isEmpty($this.iRedPacketList) && $this.iRedPacketList.length > 0){
		    	$.each(this.iRedPacketList,function(i,product){
		    		var redPacketId = product.redPacketId;
		    		var redPacketName = product.redPacketName;
		    		var redPacketType = product.redPacketType;
		    		var redPacketAmt = product.redPacketAmt;
		    		var source = product.source;
		    		var state = product.state;
		    		var photo = product.photo;
		    		var getTime = product.getTime;
		    		var unlockTime = product.unlockTime;
		    		var unlockDays = product.unlockDays;
		    		var expireTime = product.expireTime;
		    		var expireDays = product.expireDays;
		    		var openTime = product.openTime;
		    		var img =photo?'<img src="data:image/png;base64,'+photo+'">':'<img src="images/addressBook/default.png">';
		    		var month=getTime.substring(4,6);
		    		var day=getTime.substring(6,8);
		    		var packetType = '';
		    		var date = '';
		    		if(state == '99'){
		    			return true;
		    		}
		    		if(redPacketType=="07"){
		    			packetType = '来自  周周排行榜';
		    		}else if( source=='' || redPacketType=="05"){  
		    			packetType = '来自'+myPhone;
		    		}else if(redPacketType=="08"){  
		    			packetType = '来自 幸运转转赚';
		    		}else{  
		    			packetType = '来自'+source;
		    		}
		    		
		    		if(state == '05'){
		    			date = '已过期';
		    		}else if(state == '06'){
		    			date = '已失效';
		    		}
		    		
		    		var imgicon="";
		    		if(state == "05" || state == "06"){
		    			imgicon = '<i class="hongbao outdated"></i>';
		    		}else{
		    			imgicon = '<i class="hongbao"></i>';
		    		}
		    		
		    		html+= '<li class="list-item row">';
		    		html+= imgicon;
		    		html+= '<div class="cell">';
		    		
		    		if(state == "04"){//入账
		    			totalAmt += parseFloat(redPacketAmt);
		    			html+='	<h1>'+redPacketName+'(<span class="ft12">'+month+'-'+day+'</span>)</h1>';
		    			html+=' <h2 class="fc-9 mt10 ft12">'+packetType+'</h2>';
		    			html+=' </div> <div class="txt-r"><h1 class="ft16 pt15">'+Utils.formatCurrency(redPacketAmt,2)+'元</h1>';
		    		}else if(state == "01"){//不可拆
		    			html += '<h1>'+redPacketName+'(<span class="ft12">'+month+'-'+day+'</span>)</h1>';
		    			html +=' <h2 class="fc-9 mt10 ft12">'+packetType+'</h2>';
		    			html += '</div><div class="txt-r"><h1 class="mb10 fc-orange">冻结</h1>';
		    			html += '<h2 class="ft12 fc-9">还有'+unlockDays+'天解冻</h2>';
		    		}else if(state == "00" || state == "03"){//未拆、已拆
		    			html += '<h1>'+redPacketName+'(<span class="ft12">'+month+'-'+day+'</span>)</h1>';
		    			html +=' <h2 class="fc-9 mt10 ft12">'+packetType+'</h2>';
		    			html+=  '</div><div class="txt-r"><button class="btn" data="'+redPacketId+'" id="'+redPacketId+'">拆开</button>';
		    			html += '<h2 class="ft12 fc-9">还有' +expireDays+'天过期</h2>';
		    		}else if(state == "05" || state == "06"){
		    			html += '<h1>'+redPacketName+'(<span class="ft12">'+month+'-'+day+'</span>)</h1>';
		    			html +=' <h2 class="fc-9 mt10 ft12">'+packetType+'</h2>';
		    			html+='</div> <div class="txt-r">';
		    			html+=' </div> <div class="txt-r"><h1 class="ft16 pt15">已过期</h1>';
		    		}
		    		
		    		html +='</div></li>';
		    	});
		    	ul.html(html);
		    }else{
		    	var $noData=$('<li class="noData">什么也没有</li>');
		    	ul.append($noData);
		    }
			this.totalAmt = Utils.formatCurrency(totalAmt,2);
			$("#packetNum").html("共收到"+this.iRedPacketList.length+"个红包");
			$("#totalAmt").html("共"+this.totalAmt+"元");
			//拆红包还要根据后端接口修改
			ul.find('.btn').off().on("click",function(){
				if($(this).attr('disabled')){ //确定按钮可点击
					return;
				}
				$(this).attr('disabled',true);
				var thisRemove  = $(this);
				setTimeout(function(){
					thisRemove.removeClass('disabled').removeAttr('disabled');
				},500);
				var redPacketId = $(this).attr("data");

	        	var param={
	            	cardNo:$this.getEleCard().cardNo,
	            	accountType:$this.getEleCard().accountType,
	        		redPacketId:redPacketId
	        	};
	        	Client.openWaitPanel("拼命加载中，请稍候");
				Ajax({url:"/newRedPacket/openRedPacketBus",data:param,
					success:function(data){
	    			if(MUI.isEmpty(data.errorCode)){
	    				//alert("获得金额："+data.cd.productAmt);
	    				$('#amt').html(data.cd.redPacketAmt);
//	    				var productAmt = Utils.formatCurrency(parseFloat(data.cd.redPacketAmt),2);
//	    				$this.productAmt = productAmt;
	    				$('#finalPrize').addClass('show');
	    				$this.cleanFlag = true;
	    				$this.myRedPacketQuery();
					}else{
						//alert(data.errorMessage);
						//Utils.alertinfo(data.errorMessage);
						if(data.errorCode='ZXEB0035'){
							Utils.alertinfo("您来晚了，红包已经被抢光了");							
						}else{
							Utils.alertinfo("当前抢红包用户过多，请稍后再试。");							
						}
						$this.myRedPacketQuery();
					}
				},error:function(){
					$this.myRedPacketQuery();
				}});
				
			});
			
			
		},
		showPrize : function(){
			var $this = this;
			var myPhone = $this.myPhone.substring(0,3)+'******'+$this.myPhone.substring(9,11); 
			var totalAmt = 0;
			var ul = $("#lotteryList");
		    $("#totoLottery").append("共收到"+this.drawResultList.length+"个礼品");
		    ul.empty();
			if (!MUI.isEmpty(this.drawResultList) && this.drawResultList.length > 0) {
		    	$.each(this.drawResultList,function(i,product){
		    		var orderFlowNo = product.orderFlowNo;
		    		var actId = product.actId;
		    		var sactId = product.sactId;
		    		var mobile = product.mobile;
		    		var prizeId = product.prizeId;
		    		var couponCode = product.couponCode;
		    		var photo = product.photo;
		    		var prizeType = product.prizeType;
		    		var prizeName = product.prizeName;
		    		var prizePrice = product.prizePrice;
		    		var providedTime = product.providedTime;
		    		var prizeStatus = product.prizeStatus;
		    		var createTime = product.createTime;
		    		var goldActivityTime = product.remain1;
		    		var expireTime = !MUI.isEmpty(product.expireTime)?
		    				Utils.formatDate(product.expireTime, "yyyyMMdd", "yyyy-MM-dd"):"";
    				var month=createTime.substring(4,6);
    				var day=createTime.substring(6,8);
    				var source=!MUI.isEmpty(product.source)?product.source:myPhone;
    				var $drawResult =$('<li class="list-item row">'
    						+' <i class="award"></i>'
    						+' <div class="cell">'
    						+'<h1>'+prizeName+'(<span class="ft12">'+month+'-'+day+'</span>)</h1>'
    						+' <h2 class="fc-9 mt10 ft12">来自'+source+'</h2>'
    						+'</div>'
    						+'<div class="txt-r">'
    						+'<button class="btn big mt10 lotteryDetail" id="'+prizeId+'">查看详情</button>'
    						+'</div> </li>') ;
    				//拆红包还要根据后端接口修改
    				$drawResult.off().on("click",function(){
    					if(prizeType=='02'){
    						$('#lotteryTime').html("使用期限:"+expireTime);
    						$('#lotteryDescrible').html(prizeName);
    						$('#lotteryCode').html("券码："+couponCode);
    						if(prizeName.indexOf('京东')!=-1){
    							$('#lotteryTip').html('说明：可在京东商城购买京东自营商品，详细规则以京东官方声明为准。');
    						}else if(prizeName.indexOf('爱奇艺')!=-1){
    							$('#lotteryTip').html('说明：可在爱奇艺视频使用，有效期一个月，详细规则以爱奇艺视频官方声明为准。');
    						}else{
    							$('#lotteryTip').html('说明：可在官网购买服务，详细规则以官方声明为准。');
    						}
    						$('#lotteryDetailid').addClass('show');
    					}else if(prizeType=='04'){
    						$('#lecunGoldPrize').find("#prizePrice").html(prizePrice);
    						goldActivityTime=(goldActivityTime==''||goldActivityTime==null||goldActivityTime==undefined)
    										 ?'20170526':goldActivityTime;
    						$('#lecunGoldPrize').find("#goldActivityTime").html($this.formatDate(goldActivityTime));
    						if(prizeStatus=='00'){
    							$("#goldPrizeStatus").addClass('undo');
    						}else{
    							$("#goldPrizeStatus").removeClass('undo');
    						}
    						$('#lecunGoldPrize').addClass('show');
    					}
    				});
    				ul.append($drawResult);
		    	});
		    }else{
		    	var $noData=$('<li class="noData">什么也没有</li>');
		    	ul.append($noData);
		    }
		},
		getEleCard : function(){
			var cardCategory = "";
			var cardSeries = "";
			var cardNo = "";
			var accountType = "";
			var iCardInfo  = App.storage.get("UserInfo").iCardInfo;
			for(var len=0;len<iCardInfo.length;len++){
				cardCategory = iCardInfo[len].cardCategory;
				cardSeries = iCardInfo[len].cardSeries;
				if("03" == accountType )continue;
				val = cardCategory + cardSeries;
				if(val=="9901"||val=="9902"){
					cardNo = iCardInfo[len].cardNo;
					accountType = iCardInfo[len].accountType;
				}
			}
			return {cardNo:cardNo,accountType:accountType};
		},
		closeLottery:function(){
			$('.drawRztPageWrap').removeClass('show');
			//奖品详情弹出框
			$('#lotteryTime').html("");
			$('#lotteryDescrible').html("");
			$('#lotteryCode').html("");
			//红包弹出框
			$('#amt').html("");
			$('#amt').html("");
			//博时黄金
			$('#prizePrice').html("");
		},
		formatDate : function(date){
			if (date == "" || date == null || date == undefined) {
				return "";
			}
			var year=parseInt(date.substring(0,4));
			var month=parseInt(date.substring(4,6));
			var day=parseInt(date.substring(6));
			return year+"年"+month+"月"+day+"日";
		},
        goBack : function(){
        	if(this.cleanFlag){
        		App.storage.remove("paramAccount");
        		this.cleanFlag = false;
        	}
        	App.back();
     	}

	
	});
});
