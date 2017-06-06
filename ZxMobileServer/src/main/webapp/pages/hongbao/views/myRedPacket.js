define(function(require, exports, module){
	require("scripts/components/base64.js");
	var myRedPacketTpl = require("text!../template/myRedPacket.html");
	
	
	var myRedPacketView = module.exports = ItemView.extend({
		
		events : {
			"click #closeRuleBtn" : "goBack",
			"click #shareBtn" : "shareBtn",
			"click #closePrize" : "chaiclose"
			
		},
		
		template : myRedPacketTpl,
		
		initialize : function(){
			//初始化菜单方法
			var pageTest = {
				  	title:'红包管理',
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
			$("#packetNum").html('0');
			$("#totalAmt").html('0.00');
			this.begainDate = App.storage.get("activityRulesDate").begainDate;
			this.endDate = App.storage.get("activityRulesDate").endDate;
	    	this.myPhone = App.storage.get("UserInfo").regMobile;
	    	this.myPhoto = App.storage.get('UserInfo').photo;
	    	this.name = App.storage.get("UserInfo").customerNameCN;
	    	this.iRedPacketList = App.storage.get("_parameters").iRedPacketList;
			//this.myRedPacketQuery();
	    	this.show(App.storage.get("_parameters").sysTime);

			Client.hideWaitPanel(1);
		},

		myRedPacketQuery : function(){
			var $this = this;
        	var param={
        			actionFlag:1
        	};
        	
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
    				$this.show(sysTime);
				}else{
					Utils.alertinfo(data.errorMessage);
				}
    			Client.hideWaitPanel(1);
			},error:function(){
				Client.hideWaitPanel(1);
			}});
        	
        	
		},
		
		show : function(sysTime){
			var $this = this;
			var myPhone = $this.myPhone.substring(0,3)+'******'+$this.myPhone.substring(9,11); 
			var html = "";
			var totalAmt = 0;
			var ul = $("#packetInfoList");
			var myPohot = Utils.checkSession()&&App.storage.get('UserInfo').photo?'<img src="data:image/png;base64,'+App.storage.get('UserInfo').photo+'">':'<img src="images/addressBook/default.png">';
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
				var img ='';
				var month=getTime.substring(4,6);
				var day=getTime.substring(6,8);
			    var packetType = '';
			    var date = '';
			    if(redPacketType=="07"){
					packetType = '来自  周周排行榜';
				}else if( source=='' || redPacketType=="05"){  
					packetType = '来自'+myPhone;
				}else{  
				    packetType = '来自'+source;
			    }
			    
			    if(state == '05'){
			    	date = '已过期';
			    }else if(state == '06'){
			    	date = '已失效';
			    }
			    
			    if(redPacketType=="02" || redPacketType=="06"){
			    	img =photo?'<img src="data:image/png;base64,'+photo+'">':'<img src="images/addressBook/default.png">';
			    }else{
			    	img =$this.myPhoto?'<img src="data:image/png;base64,'+$this.myPhoto+'">':'<img src="images/addressBook/default.png">';
			    }
			
			    if(state == "04"){
					totalAmt += parseFloat(redPacketAmt);
					html += '<div class="itm row"><div class="avatar">'+img+'</div><div class="cell"><h1>'
					        +redPacketName+'('+month+'-'+day+')</h1><h2 class="ft12 fc-9">'
					        +packetType+'</h2></div><div class="txt-r pr10"><span class="lbl">'
					        +Utils.formatCurrency(redPacketAmt,2)+'元</span></div></div>';
				}else if(state == "01"){
					html += '<div class="itm row"><div class="avatar">'+img+'</div><div class="cell"><h1>'
			        +redPacketName+'('+month+'-'+day+')</h1><h2 class="ft12 fc-9">'
			        +packetType+'</h2></div><div class="txt-r pr10"><span class="fc-orange">冻结</span><p class="fc-9 ft12">还有'
			        +unlockDays+'天解冻</p></div></div>';
				}else if(state == "00" || state == "03"){
					     if(unlockTime != "" && expireTime != ""){
					    	 if(unlockTime<sysTime<expireTime && openTime=="" ){
					    		 html += '<div class="itm row"><div class="avatar">'+img+'</div><div class="cell"><h1>'
					    		 +redPacketName+'('+month+'-'+day+')</h1><h2 class="ft12 fc-9">'
					    		 +packetType+'</h2></div><div class="txt-r pr10"><span class="openBtn" data="'+redPacketId+'" id="'+redPacketId+'">拆开</span><p class="fc-9 ft12">还有'
					    		 +expireDays+'天过期</p></div></div>';
					    	 }else{
					    		 Utils.alertinfo("该红包目前不能拆开");
					    	 }
					     }else{
					    	 html += '<div class="itm row"><div class="avatar">'+img+'</div><div class="cell"><h1>'
				    		 +redPacketName+'('+month+'-'+day+')</h1><h2 class="ft12 fc-9">'
				    		 +packetType+'</h2></div><div class="txt-r pr10"><span class="openBtn" data="'+redPacketId+'" id="'+redPacketId+'">拆开</span><p class="fc-9 ft12">还有'
				    		 +expireDays+'天过期</p></div></div>';
					     }
				}else if(state == "05" || state == "06"){
					html += '<div class="itm row"><div class="avatar">'+img+'</div><div class="cell"><h1>'
			        +redPacketName+'('+month+'-'+day+')</h1><h2 class="ft12 fc-9">'
			        +packetType+'</h2></div><div class="txt-r pr10"><span class="lbl">'
			        +date+'</span></div></div>';
				}
			    
			});
			ul.html(html);
			this.totalAmt = Utils.formatCurrency(totalAmt,2);
			$("#packetNum").html(this.iRedPacketList.length);
			$("#totalAmt").html(this.totalAmt);
			//拆红包还要根据后端接口修改
			var $this = this;
			ul.find('.openBtn').off().on("click",function(){
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
	    				$('#amt').html(Utils.formatCurrency(parseFloat(data.cd.redPacketAmt),2));
	    				//var productAmt = Utils.formatCurrency(parseFloat(data.cd.redPacketAmt),2);
	    				//$this.productAmt = productAmt;
	    				$('#finalPrize').addClass('show');
	    				//Utils.alertinfo("获得金额："+Utils.formatCurrency(parseFloat(data.cd.redPacketAmt),2)+"元！");
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
			/*var rankListCash = App.storage.get("rankList");
			if(rankListCash){
				this.arr = rankListCash.rankList;
				for(index in this.arr){
					if(this.arr[index].mobileNo == this.myPhone){
						this.arr[index].photo = this.myPhoto;
						break;
					}
				}
				
				this.showRank();
			}*/
			
		},
		chaiclose : function(){
			// 关闭红包窗口
			this.myRedPacketQuery();
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
		
		shareBtn : function(){
			if($("#shareBtn").attr('disabled')){ //确定按钮可点击
				return;
			}
			$("#shareBtn").attr('disabled',true);
			var thisRemove  = $("#shareBtn");
			setTimeout(function(){
				thisRemove.removeClass('disabled').removeAttr('disabled');
			},500);
			
			var dataStr = "code="+(App.storage.get("UserInfo").regMobile||"")+"&name="+(this.name||"")+"&begainDate="+(this.begainDate||"")+"&endDate="+(this.endDate||"");
			dataStr = Base64.encode(dataStr);
			
			var opt={
					type:"0",
					imageUrl:"images/hongbao/redshare.png",
					//title:this.name+"送你一个杭银直销的大红包，最高100元，100%中奖，请收好~",
					title:"接受好友邀请，注册即有惊喜！",
					mobile:"",
					url: basePath + "/shares/sharedFriends.html?"+dataStr,
					content:this.name+"送你一个杭银直销大红包，最高188元，100%中奖，请收好~"
			};
			Client.sharePYQ(opt);
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
