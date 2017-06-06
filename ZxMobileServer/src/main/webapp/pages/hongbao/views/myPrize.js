define(function(require, exports, module){
	require("scripts/components/base64.js");
	var myPrizeTpl = require("text!../template/myPrize.html");
	
	
	var myPrizeView = module.exports = ItemView.extend({
		
		events : {
			"click .mbtn" : "redPacketList",
			"click .fbtn" : "rankList"
			
		},
		
		template : myPrizeTpl,
		
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
			this.init();
	    	this.myPhone = App.storage.get("UserInfo").regMobile;
	    	this.myPhoto = App.storage.get('UserInfo').photo;
	    	this.name = App.storage.get("UserInfo").customerNameCN;
			this.hongbaoQuery();

		},

		init:function(){
			var doc = document.documentElement;
			window.clientHeight = doc.clientHeight;
			var g = doc.clientWidth;
			var f = 100*(g/640);
			window.rootSize = f;
			$('.ui-view div').before('<style>html{font-size:'+ f +'px}</style>');
			var pads = $('.pad .inner');
			pads.css('height', window.clientHeight - window.rootSize*4.9 + 'px');
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
    				$this.show();
				}else{
					Utils.alertinfo(data.errorMessage);
				}
    			Client.hideWaitPanel(1);
			},error:function(){
				Client.hideWaitPanel(1);
			}});
        	
        	
		},
		
		show : function(){
			var html = "";
			var totalAmt = 0;
			var ul = $("#packetInfoList");
			var myPohot = Utils.checkSession()&&App.storage.get('UserInfo').photo?'<img src="data:image/png;base64,'+App.storage.get('UserInfo').photo+'">':'<img src="images/addressBook/default.png">';
			$.each(this.iRedPacketList,function(i,product){
				var inviteCode = product.inviteCode;
				var state = product.state;
				var photo = product.photo;
				var tranAmt = product.tranAmt;
				var openTime = product.openTime;
				var img = "";
				var packetType = "";
			
				if(product.redPacketType=="1"){
					if(product.inviteCode=="999999"){   //杭州移动微信开户
						packetType = '移动新手专属';
					}else{
						packetType = '注册红包';
					}
					img = myPohot;
				}else if(product.redPacketType=="2"){
					packetType = '乐存红包';
					img = myPohot;
				}else if(product.redPacketType=="4"){  //杭州老用户
					packetType = '移动专属';
					img = myPohot;
				}else{
					packetType = '来自于'+inviteCode;
					img = photo?'<img src="data:image/png;base64,'+photo+'">':'<img src="images/addressBook/default.png">';
				}
	/*			if(state == "00"){
					html += '<div class="row"><div class="avatar">'+img+'</div><div class="cell">'
							+packetType+'</div><div class="end"><a class="btn chai" data="'+product.redPacketId+'" id="'+product.redPacketId+'">拆开</a></div></div>';
					*/
				/*}else if(state == "01"){
					//totalAmt += parseFloat(tranAmt);
					html += '<div class="row"><div class="avatar">'+img+'</div><div class="cell">'
							+packetType+'</div><div class="end"><div class="rzt"><h2>'
							+Utils.formatCurrency(tranAmt,2)+'元</h2><h3>'+'未入账'+'</h3></div></div></div>';
				}else if(state == "02"){*/
/*				}else{
					totalAmt += parseFloat(tranAmt);
					html += '<div class="row"><div class="avatar">'+img+'</div><div class="cell">'
							+packetType+'</div><div class="end"><div class="rzt"><h2>'
							+Utils.formatCurrency(tranAmt,2)+'元</h2><h3>'+openTime.substring(4,6)+'-'+openTime.substring(6,8)+'</h3></div></div></div>';
				}*/
				
				if(state == "02"){
					totalAmt += parseFloat(tranAmt);
					html += '<div class="row"><div class="avatar">'+img+'</div><div class="cell">'
							+packetType+'</div><div class="end"><div class="rzt"><h2>'
							+Utils.formatCurrency(tranAmt,2)+'元</h2><h3>'+openTime.substring(4,6)+'-'+openTime.substring(6,8)+'</h3></div></div></div>';
				}else{
					html += '<div class="row"><div class="avatar">'+img+'</div><div class="cell">'
					+packetType+'</div><div class="end"><a class="btn chai" data="'+product.redPacketId+'" id="'+product.redPacketId+'">拆开</a></div></div>';
				}
			});
			
			ul.html(html);
			this.totalAmt = Utils.formatCurrency(totalAmt,2);
			$("#packetNum").html(this.iRedPacketList.length);
			$("#totalAmt").html(this.totalAmt);
			$("#totalAmt2").html(this.totalAmt);
			
			var $this = this;
			ul.find('.btn.chai').off().on("click",function(){
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
				Ajax({url:"/redPacket/openRedPacket",data:param,
					success:function(data){
	    			if(MUI.isEmpty(data.errorCode)){
	    				//alert("获得金额："+data.cd.productAmt);
	    				Utils.alertinfo("获得金额："+Utils.formatCurrency(parseFloat(data.cd.productAmt),2)+"元！");
	    				$this.hongbaoQuery();
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
					$this.hongbaoQuery();
				}});
				
			});
			var rankListCash = App.storage.get("rankList");
			if(rankListCash){
				this.arr = rankListCash.rankList;
				for(index in this.arr){
					if(this.arr[index].mobileNo == this.myPhone){
						this.arr[index].photo = this.myPhoto;
						break;
					}
				}
				
				this.showRank();
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
		redPacketList : function(){
			$('#rankList').hide();
			$('#packetList').show();
			$('.tab .fbtn').removeClass('active');
			$('.tab .mbtn').addClass('active');
		},
		rankList : function(){
			var rankListCash = App.storage.get("rankList");
			if(!rankListCash){
				 Client.readContacts("curView.getData");
			}else{
				this.arr = rankListCash.rankList;
				for(index in this.arr){
					if(this.arr[index].mobileNo == this.myPhone){
						var tranAmtIn = Utils.formatCurrency(this.arr[index].tranAmt,2);
						if( tranAmtIn != this.totalAmt){
							this.arr[index].tranAmt = this.totalAmt;
							App.storage.set("rankList",{rankList:this.arr});
							this.rankAgain();
							this.showRank();
							break;
						}
					}
				}
			}
			
			$('#packetList').hide();
			$('#rankList').show();
			$('.tab .mbtn').removeClass('active');
			$('.tab .fbtn').addClass('active');
		},
		getData : function(data){
	    	if(data.length<=0){
	    		this.myRank = 0;
				$("#rankNum").html(this.myRank);
	    		return false;
	    	}

	    	var param = {contacts : data};
	    	var $this = this;
	    	Client.openWaitPanel("拼命加载中，请稍候");
	    	Ajax({url:"/redPacket/redPacketRank", data:param, success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					$this.arr = [];
					var flag = "0";
					for(index in data){
						if(data[index].mobileNo == $this.myPhone){
							flag = "1";
							break;
						}
					}
					//alert($this.myPhone);
					if(flag == "0"){
						var temp = {};
						temp.mobileNo = $this.myPhone;
						temp.tranAmt = $this.totalAmt;
						temp.state = "1";
						temp.key = "";
						temp.name = $this.name;
						temp.photo = $this.myPhoto; 
						data.push(temp);
					}
					var amtList = [];
					var keyList = [];
					for(index in data){
						if(data[index].state == "0"){
							keyList.push(data[index]);
						}else{
							amtList.push(data[index]);
						}
					}
					amtList.sort(function(a,b){return parseFloat(a.tranAmt)<parseFloat(b.tranAmt)?1:-1});
					keyList.sort(function(a,b){return a.key>b.key?1:-1});
					var len = amtList.length;
					for(index in data){
						if(index < len){
							$this.arr.push(amtList[index]);
						}else{
							$this.arr.push(keyList[index-len]);
						}
					}
					App.storage.set("rankList",{rankList:$this.arr});
					$this.showRank();
					Client.hideWaitPanel(1);
				}else{
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(1);
				}   
			},error:function(){
				Client.hideWaitPanel(1);
			}});
	    },
	    showRank : function(){
			var html = "";
			var ul = $("#rankInfoList");
			var myRank = "";
			var rankLen = this.arr.length;
			var rankLenLen = rankLen.toString().length;
			$.each(this.arr,function(i,product){
				var name = product.name;
				var state = product.state;
				var photo = product.photo;
				var tranAmt = product.tranAmt;
				tranAmt = Utils.formatCurrency(parseFloat(tranAmt),2);
				var mobileNo = product.mobileNo;
				var myPhone = App.storage.get("UserInfo").regMobile;
				var rankTemp = (i+1).toString();
				if(mobileNo == myPhone){
					myRank = rankTemp;
				}
				rankTemp = (Array(rankLenLen).join(0)+rankTemp).slice(-rankLenLen);
				var img = photo?'<img src="data:image/png;base64,'+photo+'">':'<img src="images/addressBook/default.png">';
			
				if(state == "0"){
					html += '<div class="row inviteTT" data="'+mobileNo+'"><span>'+rankTemp+'.</span><div class="avatar">'
						 +img+'</div><div class="cell">'+name+'</div><div class="end"><a class="btn invite" data="'+mobileNo+'" id="'+i+'">邀请TA</a></div></div>';
				}else if(state == "1"){
					html += '<div class="row"><span>'+rankTemp+'.</span><div class="avatar">'
					 +img+'</div><div class="cell">'+name+'</div><div class="end">'+tranAmt+'元</div></div>';
				}
			});
			
			ul.html(html);
			this.myRank = myRank;
			$("#rankNum").html(this.myRank);

			
			var $this = this;
			ul.find('.row.inviteTT').off().on("click",function(){
				if($(this).attr('disabled')){ //确定按钮可点击
					return;
				}
				$(this).attr('disabled',true);
				var thisRemove  = $(this);
				setTimeout(function(){
					thisRemove.removeClass('disabled').removeAttr('disabled');
				},500);
				var mobileNo = $(this).attr("data");
				var dataStr = "code="+(App.storage.get("UserInfo").regMobile||"")+"&name="+($this.name||"");
				dataStr = Base64.encode(dataStr);
				var opt={
						type:"1",
						mobile:mobileNo,
						imageUrl:"images/hongbao/redshare.png",
						//title:$this.name+"送你一个杭银直销的大红包，最高100元，100%中奖，请收好~",
						title:"接受好友邀请，注册即有惊喜！",
						url: basePath + "/shares/song.html?"+dataStr,
						content:$this.name+"送你一个杭银直销的大红包，最高100元，100%中奖，请收好~"
				};
				Client.sharePYQ(opt);
			});
	    },
	    rankAgain : function(){
	    	var data = this.arr;
			var amtList = [];
			var keyList = [];
			for(index in data){
				if(data[index].state == "0"){
					keyList.push(data[index]);
				}else{
					amtList.push(data[index]);
				}
			}
			amtList.sort(function(a,b){return parseFloat(a.tranAmt)<parseFloat(b.tranAmt)?1:-1});
			keyList.sort(function(a,b){return a.key>b.key?1:-1});
			var len = amtList.length;
			var lenSum = data.length;
			this.arr = [];
			for(var index=0;index<lenSum;index++){
				if(index < len){
					this.arr.push(amtList[index]);
				}else{
					this.arr.push(keyList[index-len]);
				}
			}
			App.storage.set("rankList",{rankList:this.arr});
	    },
        goBack : function(){
        	App.back();
     	}

	
	});
});
