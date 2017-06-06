define(function(require, exports, module){
	
	var checkMoreTpl = require("text!../template/checkMore.html");
	
	var checkMoreView = module.exports = ItemView.extend({
		
	template : checkMoreTpl,
		//定义日志TAG便于错误信息查找
	initialize : function(){
	    var pageTest = {
			  	title:'已邀请好友',
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
				turnPageShowNum : "20"
		};
		Ajax({url:"/userSetting/queryInvitePeople",data:param, success:function(data){
			if(MUI.isEmpty(data.errorCode)){
				var list = data.invitePeopleList;
				var html = "";
				for(var i =0;i<list.length;i++){
					html+='<li><h2>姓名：'+list[i].customerNameCN+'<span class="ft12 fc-8">（昵称：'+
						list[i].customerAlias+')</span></h2><h3>'+
			            '<span>电话：'+Utils.getFmtMobile(list[i].mobileNo)+'</span>'+
			            '<span class="fr">注册时间：'+Utils.formatDate(list[i].createTime,'yyyyMMdd','yyyy-MM-dd')+'</span></h3></li>';
				}
				$(".invited ul").html(html);
			}else{
				Utils.alertinfo(data.errorMessage);
			}
			Client.hideWaitPanel(1);
		}});
	},
	
	goBack : function(){
		App.back();
	}
	
	});
});
