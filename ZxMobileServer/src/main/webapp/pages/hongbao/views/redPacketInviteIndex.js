define(function(require, exports, module){
	
	var redPacketInviteIndexTpl = require("text!../template/redPacketInviteIndex.html");
	
	var redPacketView = module.exports = ItemView.extend({
		
		events : {
			"click #active_rule" : "toactivityRules",
			"click #myRedPacket" : "tomyRedPacket",
			"click #weeklyRanklist" : "toweeklyRanklist",
			"click #weeklyRank" : "toweeklyRanklist",
			"click #inviteRed" : "inviteRed"
			
		},
		
		template : redPacketInviteIndexTpl,
		
		initialize : function(){
			//初始化菜单方法
			var pageTest = {
				  	title:'邀请好友',
					leftButton:{
						name : '返回',
						func : 'curView.toIndex()'
					},
					rightButton:{
						name : ''
					}
				  };
			Client.initPageTitle(pageTest);
			//this.init();
			$('#rank').html('N');
			$('#day').html('00');
			$('#hour').html('00');
			$('#min').html('00');
			this.name = App.storage.get("UserInfo").customerNameCN;
			/*this.personRankInfo = App.storage.get("personRankInfo");
			if(!this.personRankInfo){*/
			this.personRankInfoQuery();
			/*}else{
				this.showPersonRankInfo();
			}*/
			
			this.activityRulesDate = App.storage.get("activityRulesDate");
			if(!this.activityRulesDate){
				this.initActivityRulesDate();
			}else{
				this.begainDate = this.activityRulesDate.begainDate;
				this.endDate = this.activityRulesDate.endDate;
			}
			Client.hideWaitPanel(1);
			
		},
		
		/*init:function(){
			var doc = document.documentElement;
			window.clientHeight = doc.clientHeight;
			var g = doc.clientWidth;
			var f = 100*(g/640);
			$('.ui-view div').before('<style>html{font-size:'+ f +'px}</style>');
		},*/
		
		personRankInfoQuery : function(){
			var $this = this;
        	var param={
        	};
        	Ajax({url:"/newRedPacket/queryPersonRankInfo",data:param,
				success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var currentInvitationNum = data.cd.currentInvitationNum;
					var totalInvitationNum = data.cd.totalInvitationNum;
					var currentRanking = data.cd.currentRanking;
					var lastRanking = data.cd.lastRanking;
					var deadline = data.cd.deadline;
					$this.personRankInfo={
							currentInvitationNum:currentInvitationNum,
							totalInvitationNum:totalInvitationNum,
							currentRanking:currentRanking,
							lastRanking:lastRanking,
							deadline:deadline
					};
					//App.storage.set("personRankInfo",$this.personRankInfo);
					if(currentRanking!='' && currentRanking!='0'){
						$('#rank').html(currentRanking);
					}else{
						$('#rank').html('N');
					}
					$('#day').html(deadline.substring(0,2));
					$('#hour').html(deadline.substring(2,4));
					$('#min').html(deadline.substring(4,6));
					//App.navigate("hongbao/hongbaoCtl/weeklyRanklist",$this.personRankInfo);
				}else{
					Utils.alertinfo(data.errorMessage);
				}
				$this.qryHideWait();
			},error:function(){
				$this.qryHideWait();
			}});
		},
		
		/*showPersonRankInfo : function(){
			var deadline = this.personRankInfo.deadline;
			if(this.personRankInfo.currentRanking!='' && this.personRankInfo.currentRanking!='0'){
				$('#rank').html(this.personRankInfo.currentRanking);
			}else{
				$('#rank').html('N');
			}
			$('#day').html(deadline.substring(0,2));
			$('#hour').html(deadline.substring(2,4));
			$('#min').html(deadline.substring(4,6));
		},*/
		
		
		initActivityRulesDate : function(){
			var $this = this;
        	var param={
        	};
        	Ajax({url:"/newRedPacket/getActivityTime",data:param,
				success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var begainDate = data.cd.activityBeginDate;
					var endDate = data.cd.activityEndDate;
					$this.begainDate = begainDate.substring(0,4)+"年"+begainDate.substring(4,6)+"月"+begainDate.substring(6,8)+"日";
					$this.endDate = endDate.substring(0,4)+"年"+endDate.substring(4,6)+"月"+endDate.substring(6,8)+"日";
					App.storage.set("activityRulesDate",{begainDate:$this.begainDate,endDate:$this.endDate});	
				}else{
					Utils.alertinfo(data.errorMessage);
				}
				$this.qryHideWait();
			},error:function(){
				$this.qryHideWait();
			}});
	},
		
    	
    	toactivityRules : function(){
			App.navigate("hongbao/hongbaoCtl/activityRules");
    	},
    	
    	
    	tomyRedPacket : function(){
    		var $this = this;
        	var param={
        			actionFlag:1
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
    				//$this.show(sysTime);
					App.navigate("hongbao/hongbaoCtl/myRedPacket",{iRedPacketList:$this.iRedPacketList,sysTime:sysTime});
				}else{
					Utils.alertinfo(data.errorMessage);
				}
    			Client.hideWaitPanel(1);
			},error:function(){
				Client.hideWaitPanel(1);
			}});
        	
    	},
    	
    	toweeklyRanklist : function(){
    		App.navigate("hongbao/hongbaoCtl/weeklyRanklist");
    	},
    	
    	inviteRed : function(){
    		var dataStr = "code="+(App.storage.get("UserInfo").regMobile||"")+"&name="+(this.name||"")+"&begainDate="+(this.begainDate||"")+"&endDate="+(this.endDate||"");
    		dataStr = Base64.encode(dataStr);
			var opt={
					type:"2",
					imageUrl:"images/hongbao/redshare.png",
					//title:this.name+"送你一个杭银直销的大红包，最高100元，100%中奖，请收好~",
					title:"注册赢惊喜",
					url: basePath + "/shares/sharedFriends.html?"+dataStr,
					content:"杭州银行直销银行支持多家银行卡，通过互联网即可完成账户注册，享受高收益产品服务，注册赢惊喜，快来注册吧！",
					qrCodeInviter:this.name,
					qrCodeUrl:basePath + "/shares/sharedFriends.html?"+dataStr,
					qrCodeContent:"我正在杭银直销APP赢奖励、赚收益"
				};
			Client.share(opt);
    	},
    	
    	toIndex : function(){
    		Client.menuOpt("1");
			App.navigate("index/index/index");
    	},		
	
	});
});
