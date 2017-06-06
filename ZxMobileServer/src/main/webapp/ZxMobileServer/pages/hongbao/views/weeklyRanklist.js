define(function(require, exports, module){
	
	var weeklyRanklistTpl = require("text!../template/weeklyRanklist.html");
	
	var hongbaoView = module.exports = ItemView.extend({
		
		events : {
			"click #closeRuleBtn" : "toredPacketInviteIndex"
			
		},
		
		template : weeklyRanklistTpl,
		
		initialize : function(){
			//初始化菜单方法
			var pageTest = {
				  	title:'周周排行榜',
					leftButton:{
						name : '返回',
						func : 'curView.toredPacketInviteIndex()'
					},
					rightButton:{
						name : ''
					}
				  };
			Client.initPageTitle(pageTest);
			//this.init();
			//Client.hideWaitPanel(1);
			this.myPhone = App.storage.get("UserInfo").regMobile.substring(0,3)+'****'+App.storage.get("UserInfo").regMobile.substring(7,11);
			this.myPohot = Utils.checkSession()&&App.storage.get('UserInfo').photo?'<img src="data:image/png;base64,'+App.storage.get('UserInfo').photo+'">':'<img src="images/addressBook/default.png">';
			$('#myPhone').html(this.myPhone);
			$('#myPohot').html(this.myPohot);
			$('#currentNum').html('0');
			$('#totalNum').html('0');
			$('#rank').html('N');
			$('#currentRank').html('N');
			$('#lastRank').html('N');
			$('#day').html('00');
			$('#hour').html('00');
			$('#min').html('00');
			/*this.personRankInfo = App.storage.get("personRankInfo");
			if(!this.personRankInfo){*/
			this.personRankInfoQuery();
			/*}else{
				this.showPersonRankInfo();
			}*/
			
			/*this.weeklyRank = App.storage.get("weeklyRank");
			if(!this.weeklyRank){*/
			this.weeklyRankInfoQuery();
			/*}else{
				//this.showPersonRankInfo();
			}*/
			
			Client.hideWaitPanel(1);
		},
		
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
						$('#currentRank').html(currentRanking);
					}else{
						$('#rank').html('N');
						$('#currentRank').html('N');
					}
					if(lastRanking!='' && lastRanking!='0'){
						$('#lastRank').html(lastRanking);
					}else{
						$('#lastRank').html('N');
					}
					if(currentInvitationNum!=''){
						$('#currentNum').html(currentInvitationNum);
					}else{
						$('#currentNum').html('0');
					}
					if(totalInvitationNum!=''){
						$('#totalNum').html(totalInvitationNum);
					}else{
						$('#totalNum').html('0');
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
		
//		showPersonRankInfo : function(){
//			var currentInvitationNum = this.personRankInfo.currentInvitationNum;
//			var totalInvitationNum = this.personRankInfo.totalInvitationNum;
//			var currentRanking = this.personRankInfo.currentRanking;
//			var lastRanking = this.personRankInfo.lastRanking;
//			var deadline = this.personRankInfo.deadline;
//			if(currentRanking!='' || currentRanking!='0'){
//				$('#rank').html(currentRanking);
//				$('#currentRank').html(currentRanking);
//			}else{
//				$('#rank').html('N');
//				$('#currentRank').html('N');
//			}
//			if(lastRanking!='' || lastRanking!='0'){
//				$('#lastRank').html(lastRanking);
//			}else{
//				$('#lastRank').html('N');
//			}
//			if(currentInvitationNum!=''){
//				$('#currentNum').html(currentInvitationNum);
//			}else{
//				$('#currentNum').html('0');
//			}
//			if(totalInvitationNum!=''){
//				$('#totalNum').html(totalInvitationNum);
//			}else{
//				$('#totalNum').html('0');
//			}
//			$('#day').html(deadline.substring(0,2));
//			$('#hour').html(deadline.substring(2,4));
//			$('#min').html(deadline.substring(4,6));
//		},
		
		
		weeklyRankInfoQuery : function(){
			var $this = this;
        	var param={
        	};
        	Client.openWaitPanel("拼命加载中，请稍候");
        	Ajax({url:"/newRedPacket/queryWeeklyRank", data:param, success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var cd = data.cd;
					var iRankList = [];
					if(!MUI.isEmpty(cd)){
						var iWeeklyRankList = data.cd.iWeekRank;
						//var iRankList = [];
	    				for(index in iWeeklyRankList){
	    					iRankList.push(iWeeklyRankList[index]);
	    				}
	    				$this.iRankList = iRankList;
					}
					//App.storage.set("weeklyRank",$this.iRankList);
					var tbody = $('#rankInfo');
					//var img = '';
					var html = '';
					
					$.each($this.iRankList,function(i,rankList){
						var ranking = rankList.ranking;
						var mobileNo = rankList.mobileNo;
						var currentInvitationNum = rankList.currentInvitationNum;
						var totalInvitationNum = rankList.totalInvitationNum;
//						if(ranking == '1'){
//							img ='<img src="images/hongbao2/num_1.png" alt="" class="num">';
//						}else if(ranking == '2'){
//							img ='<img src="images/hongbao2/num_2.png" alt="" class="num">';
//						}else if(ranking == '3'){
//							img ='<img src="images/hongbao2/num_3.png" alt="" class="num">';
//						}
						
						if(i<=2){
							html +='<tr><td><img src="images/hongbao2/num_'+(i+1)+'.png" alt="" class="num"></td><td>'+mobileNo+'</td><td>'+currentInvitationNum+'</td><td>'
							+totalInvitationNum+'</td></tr>';
						}else{
							html +='<tr><td>'+(i+1)+'</td><td>'+mobileNo+'</td><td>'+currentInvitationNum+'</td><td>'
							+totalInvitationNum+'</td></tr>';
						}
						
					});
					tbody.html(html);
					Client.hideWaitPanel(1);
				}else{
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(1);
				}   
			},error:function(){
				Client.hideWaitPanel(1);
			}});
		},
		
		
		
		
		toredPacketInviteIndex : function(){
			App.navigate("hongbao/hongbaoCtl/redPacketInviteIndex");
    	}
	
	});
});
