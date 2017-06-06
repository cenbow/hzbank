define(function(require, exports, module){
	
	var queryFriendsTpl = require("text!../template/queryFriends.html");
	
	var queryFriendsView = module.exports = ItemView.extend({
		
	template : queryFriendsTpl,
		//定义日志TAG便于错误信息查找
	initialize : function(){
	    var pageTest = {
			  	title:'好友列表',
				leftButton:{
					name : '返回',
					func :'curView.goBack()'
				},
				rightButton:{
					name : ''
				}
		  }
		Client.initPageTitle(pageTest);
	    this.queryInvitePeople();
	},
	
	queryInvitePeople : function(){
		var param = {
				turnPageBeginPos : "1",
				turnPageShowNum : "1000"
		};
		Ajax({url:"/userSetting/queryInvitePeople",data:param, success:function(data){
			if(MUI.isEmpty(data.errorCode)){
				var list = data.invitePeopleList;
				var turnPageTotalNum = data.turnPageTotalNum;
				var html = "";
				var number = 0;
				for(var i =0;i<list.length;i++){
					var photo = list[i].photo;
					var images = 'data:image/png;base64,'+photo+'';
					var images1 = "images/addressBook/default.png";
					if(photo==null){
						images = images1;
					}
					var customerAlias = list[i].customerAlias;
					if(customerAlias){
						customerAlias = "("+list[i].customerAlias+")";
						
					}else{
						customerAlias = "";
					}
					number++;
					html += '<div class="list-item">'+
								'<div class="avatar"><img src="'+images+'"/></div>'+
								'<div class="ft16 mb5">'+list[i].customerNameCN+'<span class="fc-9 ml5">'+customerAlias+'</span></div>'+
									'<div class="row ft13 fc-9">'+
									'<div class="cell">注册时间:'+Utils.formatDate(list[i].createTime,'yyyyMMdd','yyyy-MM-dd')+'</div>'+
								'<div>电话:'+Utils.getFmtMobile(list[i].mobileNo)+'</div>'+
			                    '</div>'+
		                    '</div>';
				}
				$("#number").text(number);
				if(number=="1"){
					$("#friendsList").html(html);
				}
				else if(number>="2"){
					$("#friendsList").append(html);
				}
				
				if(turnPageTotalNum=="0"){
					$("#noData").show();
					$("#wrapper").hide();
				}else{
					$("#noData").hide();
					$("#wrapper").show();
				}
				
			}else{
				Utils.alertinfo(data.errorMessage);
			}
		    Client.hideWaitPanel(100);
		}});
	},
	
	goBack : function(){
		App.back();
	},
	

	
	
	
	});
});
