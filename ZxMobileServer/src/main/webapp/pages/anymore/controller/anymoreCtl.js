define(function (require, exports, module) {
	
	var anyMoreView = require("../views/any_more");
	var activitiesMoreView = require("../views/activities_more");
	var aboutUsView = require("../views/about_us");
	var messageCenterView = require("../views/helpQuestion");
	var attentionView = require("../views/attention");
	var shareView = require("../views/share");
	var weixinView = require("../views/weixin");
	var checkMoreView = require("../views/checkMore");
	var contactView = require("../views/contact");
	var concernUsView = require("../views/concern_us");
	var identityUploadView = require("../views/identityUpload");
	var share1View = require("../views/share1");
	var queryFriendsView = require("../views/queryFriends");
	//var helpQuestionView = require("../views/helpQuestion");
	//var questionDetailView = require("../views/questionDetail");
	
	var MycountController = module.exports = Controller.extend({
		actions:{
				"anyMore" : "anyMore",
				"activitiesMore" : "activitiesMore",
				"aboutUs" : "aboutUs",
				"messageCenter" : "messageCenter",
				"attention" : "attention",
				"share" : "share",
				"weixin" : "weixin",
				"checkMore" : "checkMore",
				"contact" : "contact",
				"concern" : "concernUs",
				"identityUpload" : "identityUpload",
				"share1" : "share1",
				"queryFriends" : "queryFriends",
				//"helpQuestion" : "helpQuestion",
				//"questionDetail" : "questionDetail"
			},
		
		anyMore : function(){
			Client.menuOpt("4");
			//初始化菜单方法
			var pageTest = {
				  	title:'更多内容',
					leftButton:{
						name : '',
						func : 'curView.toIndex()'
					},
					rightButton:{
						name : '帮助',
						func : 'curView.toHelp()'
					}
				  };
			Client.initPageTitle(pageTest);
			App.container.show(new anyMoreView());
		},
		
		activitiesMore : function(){
			App.container.show(new activitiesMoreView());
		}, 
		aboutUs : function(){
			App.container.show(new aboutUsView());
		}, 
		concernUs : function(){
			App.container.show(new concernUsView());
		}, 
		messageCenter : function(){
			App.container.show(new messageCenterView());
		}, 
		
		attention : function(){
			App.container.show(new attentionView());
		},
		
		share : function(){
			Client.menuOpt("0");
			App.container.show(new shareView());
		},
		
		weixin : function(){
			App.container.show(new weixinView());
		},
		
		checkMore : function(){
			App.container.show(new checkMoreView());
		},
		
		contact : function(){
			App.container.show(new contactView({model:new Model({arr:""})}));
		},
		
		identityUpload : function(){
			Client.menuOpt("0");
			var UserInfo = App.storage.get("UserInfo");
			var param = {
					customerNameCN : UserInfo.customerNameCN,
					certNo : UserInfo.certNo
			};
			App.container.show(new identityUploadView({model : new Model(param)}));
		},
		
		share1 : function(){
			Client.menuOpt("0");
			App.container.show(new share1View());
		},
		
		queryFriends : function(){
			App.container.show(new queryFriendsView());
		},
		
		helpQuestion: function(){
			App.container.show(new helpQuestionView());
		},
		
		/*questionDetail: function(){
			App.container.show(new questionDetailView());
		}*/
		
	});
	
});