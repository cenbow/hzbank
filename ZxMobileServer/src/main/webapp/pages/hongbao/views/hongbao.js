define(function(require, exports, module){
	require("scripts/components/base64.js");
	var hongbaoTpl = require("text!../template/hongbao.html");
	
	var hongbaoView = module.exports = ItemView.extend({
		
		events : {
			"click #myPrize" : "myPrize",
			"click #openBtn" : "chaihongbao",
			"click #shareBtn" : "shareBtn",
			"click #closePrize" : "chaiclose",
			"click #share" : "share",
			"click #ruleBtn" : "hongbaorule",
			
		},
		
		template : hongbaoTpl,
		
		initialize : function(){
			//初始化菜单方法
			var pageTest = {
				  	title:'红包奉上',
					leftButton:{
						name : '返回',
						func : 'curView.toIndex()'
					},
					rightButton:{
						name : ''
					}
				  };
			Client.initPageTitle(pageTest);
			this.init();
			
			this.name = App.storage.get("UserInfo").customerNameCN;
			this.noRedPacketListData = App.storage.get("noRedPacketListData");
			
			this.activityDate = App.storage.get("activityDate");
			if(!this.activityDate){
				this.initActivityDate();
			}else{
				this.begainDate = this.activityDate.begainDate;
				this.endDate = this.activityDate.endDate;
			}
			
			this.iRedPacketList = [];
			this.noRedPacketList = [];
			this.length = 0;
			if(!this.noRedPacketListData){
				this.hongbaoQuery();
			}else{
				//this.iRedPacketList = this.iRedPacketListData.iRedPacketList;
				this.noRedPacketList = this.noRedPacketListData.noRedPacketListData;
				this.show();
				this.qryHideWait();
			}
			
		},
		
		init : function(){
			var doc = document.documentElement;
			window.clientHeight = doc.clientHeight;
			var g = doc.clientWidth;
			var f = 100*(g/640);
			$('.ui-view div').before('<style>html{font-size:'+ f +'px}</style>');
		},
		initActivityDate : function(){
			var $this = this;
        	var param={
        	};
        	Ajax({url:"/redPacket/getActivity",data:param,
				success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var begainDate = data.cd.activityBeginDate;
					var endDate = data.cd.activityEndDate;
					$this.begainDate = begainDate.substring(0,4)+"年"+begainDate.substring(4,6)+"月"+begainDate.substring(6,8)+"日";
					$this.endDate = endDate.substring(0,4)+"年"+endDate.substring(4,6)+"月"+endDate.substring(6,8)+"日";
					App.storage.set("activityDate",{begainDate:$this.begainDate,endDate:$this.endDate});	
				}else{
					Utils.alertinfo(data.errorMessage);
				}
				$this.qryHideWait();
			},error:function(){
				$this.qryHideWait();
			}});
		},
		
		hongbaoQuery : function(){
			var $this = this;
        	var param={
        	};
        	
        	Ajax({url:"/redPacket/queryRedPacketList",data:param,
				success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var cd = data.cd;
					if(!MUI.isEmpty(cd)){
						var RedPacketList = data.cd.iRedPacketList;
						var noRedPacketList = [];
						var iRedPacketList = [];
	    				for(index in RedPacketList){
	    					iRedPacketList.push(RedPacketList[index]);
	    					if(RedPacketList[index].state!="02"){
	    						noRedPacketList.push(RedPacketList[index]);
	    					}
	    				}
	    				App.storage.set("noRedPacketListData",{noRedPacketListData:noRedPacketList});
	    				$this.iRedPacketList = iRedPacketList;
	    				$this.noRedPacketList = noRedPacketList;
	    				
					}
				}else{
					Utils.alertinfo(data.errorMessage);
				}
				$this.show();
				$this.qryHideWait();
			},error:function(){
				$this.show();
				$this.qryHideWait();
			}});
		},
		show : function(){
			$('#number').html(this.noRedPacketList.length);
			
		},
		myPrize : function(){
			// 我的红包
			App.navigate("hongbao/hongbaoCtl/myPrize");
		},
		chaihongbao : function(){
			// 拆红包
			var $this = this;
			var len = this.noRedPacketList.length;
			if(len<=0){
				Utils.alertinfo("邀请好友获得更多红包");
			}else{
				//防止重复点击
				if($("#openBtn").attr('disabled')){ //确定按钮可点击
					return;
				}
				$("#openBtn").attr('disabled',true);
				var thisRemove  = $("#openBtn");
				setTimeout(function(){
					thisRemove.removeClass('disabled').removeAttr('disabled');
				},500);
				//alert(this.noRedPacketList[len-1].redPacketId);
	        	var param={
	            	cardNo:this.getEleCard().cardNo,
	            	accountType:this.getEleCard().accountType,
	        		redPacketId:this.noRedPacketList[len-1].redPacketId
	        	};
	        	Client.openWaitPanel("拼命加载中，请稍候");
				Ajax({url:"/redPacket/openRedPacket",data:param,
					success:function(data){
	    			if(MUI.isEmpty(data.errorCode)){
	    				$this.noRedPacketList.pop();
	    				$('#amt').html(data.cd.productAmt);
	    				var productAmt = Utils.formatCurrency(parseFloat(data.cd.productAmt),2);
	    				$this.productAmt = productAmt;
	    				$('#finalPrize').addClass('show');
	    				App.storage.set("noRedPacketListData",{noRedPacketListData:$this.noRedPacketList});
		    			$this.show();
		    			$this.qryHideWait();
					}else{
						//alert(data.errorMessage);
						//Utils.alertinfo(data.errorMessage);
						if(data.errorCode='ZXEB0035'){
							Utils.alertinfo("您来晚了，红包已经被抢光了");							
						}else{
							Utils.alertinfo("当前抢红包用户过多，请稍后再试。");							
						}
						$this.hongbaoQuery();
					}

				},error:function(){
					$this.show();
					$this.qryHideWait();
				}});

			}
		},
		chaiclose : function(){
			// 关闭红包窗口
			this.show();
			$('#finalPrize').removeClass('show');
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
		share : function(){
			var dataStr = "code="+(App.storage.get("UserInfo").regMobile||"")+"&name="+(this.name||"");
			dataStr = Base64.encode(dataStr);
			
			var opt={
					type:"2",
					imageUrl:"images/hongbao/redshare.png",
					//title:this.name+"送你一个杭银直销的大红包，最高100元，100%中奖，请收好~",
					title:"接受好友邀请，注册即有惊喜！",
					url: basePath + "/shares/song.html?"+dataStr,
					content:"杭州银行直销银行支持多家银行卡，通过互联网即可完成账户注册，享受高收益产品服务，注册赢惊喜，快来注册吧！",
					qrCodeInviter:this.name,
					qrCodeUrl:basePath + "/shares/song.html?"+dataStr,
					qrCodeContent:"我正在杭银直销APP赢奖励、赚收益"
				};
			Client.share(opt);
		},
		shareBtn : function(){
			if($("#shareBtn").attr('disabled')){ //确定按钮可点击
				return;
			}
			$("#shareBtn").attr('disabled',true);
			var thisRemove  = $("#shareBtn");
			setTimeout(function(){
				thisRemove.removeClass('disabled').removeAttr('disabled');
			},500);
			
			var dataStr = "code="+(App.storage.get("UserInfo").regMobile||"")+"&name="+(this.name||"");
			dataStr = Base64.encode(dataStr);
			
			var opt={
					type:"0",
					imageUrl:"images/hongbao/redshare.png",
					//title:this.name+"送你一个杭银直销的大红包，最高100元，100%中奖，请收好~",
					title:"接受好友邀请，注册即有惊喜！",
					mobile:"",
					url: basePath + "/shares/song.html?"+dataStr,
					content:this.name+"送你一个杭银直销的大红包，最高100元，100%中奖，请收好~"
			};
			Client.sharePYQ(opt);
		},
		hongbaorule : function(){
			// 点击查看红包规则
			App.navigate("hongbao/hongbaoCtl/hongbaorule",{begainDate:this.begainDate,endDate:this.endDate});
		},
    	toIndex : function(){
    		Client.menuOpt("1");
			App.navigate("index/index/index");
    	},		
    	qryHideWait: function(){
				
			Client.hideWaitPanel(100);
			Client.hideLucencyPanel();
			
			this.opt ? null : this.opt = {
					callback:"curView.refresh()"
			};
			Client.dragRefresh(this.opt);
			
		},
		refresh : function(){
			this.iRedPacketListData = {};
			this.iRedPacketList = [];
			this.noRedPacketList = [];
			Client.openLucencyPanel();
			this.opt.type = "1";
    		this.hongbaoQuery();
    	}
	
	});
});
