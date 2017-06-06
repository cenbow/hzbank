define(function(require, exports, module){
	
	var anyMoreTpl = require("text!../template/any_more.html");
	var anyMoreView = module.exports = ItemView.extend({
	template : anyMoreTpl,
	events:{
		"click #message-center" : "queryNotice",
		"click #help-center" : "helpCenter",
		"click #about-us" : "aboutUs",
		"click .update" : "update",
		"click #share" : "share",
		"click #logout" : "logout",
		"click #login" : "login",
		"click .concat-phone" : "callPhone",
		"click .special" : "special",
		"click .zen-list-2" : "toCenter",
		"click #loancenter" : "toloancenter",
		"click #identityUpload" : "identityUpload"
	},
	initialize : function(){
		if(Utils.checkSession()){
			$('#logout').show();
			$('.zen-list-2').show();
			
			if( Utils.checkRealUser("1")){
				var recommendNum = App.storage.get("recommendNum");
				if(!recommendNum){
					this.createRecommedNUM();
				}				
			}
		}else{
			$('#login').show();
		};
		
		var shareUnNew = MUI.Cache.get("shareUnNew");
		if(!shareUnNew || !shareUnNew.data){
			$("#share").addClass("midd-dot");
		}else{
			$("#share").addClass("zen-fold-arr");
		}
		
		Client.hideWaitPanel(1); 
	},
	update:function(){
		Client.updateVersion();
	},
	share:function(){
		if (Utils.checkSession()) {
			if(Utils.checkRealUser()){
				if(!Utils.checkActivate()){
					return;
				}
				var param = {
				};
				Client.openWaitPanel("加载中");
				Ajax({url:"/anyMore/isActivity",data:param, success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						var param = {
								"url":data.url,
								"isFlag":data.isFlag
						};
						App.storage.set("param",param);
						MUI.Cache.save("shareUnNew", true);
						if(data.isFlag=="1"){
							//有红包
							App.navigate("anymore/anymoreCtl/share",param);
						}else {
							//没有红包
							App.navigate("anymore/anymoreCtl/share1",param);
						}
						
					}else{
						Utils.alertinfo(data.errorMessage);
					}
					Client.hideWaitPanel(1);
				}});
			}
		} else {
			Client.toLogin("curView.share()");
		}
	},
	 aboutUs : function(){
		 App.navigate("anymore/anymoreCtl/concern");
	},
	
	 helpCenter : function(){
		 App.navigate("anymore/anymoreCtl/messageCenter");
	},
	
	 queryNotice : function(){
		 App.navigate("anymore/anymoreCtl/activitiesMore");
	},
	
	//退出登录
	logout:function(){
		
		Client.openWaitPanel("正在退出...");
		Client.logOut("curView.cleanSession");
		
	},
	
	//立即登录
	login:function(){
		Client.toLogin("curView.reload()");
	},
	
	cleanSession : function(data){
		Client.hideWaitPanel(1);
		var ad = App.storage.get("adList");
		var aprShowMsg = App.storage.get("aprShowMsg");
		App.storage.clear();
		App.storage.set("adList",ad);
		App.storage.set("aprShowMsg",aprShowMsg);
		App.container.show(this);
	},
	
	reload : function(){
		App.reload();
	},
	
	callPhone : function(){
		Client.callPhone($('.concat-phone').attr("val"));
	},
	
	initPhoto : function(){
		//点击头像触发头像修改功能
		$('.user-detail-ifo .avatar').on('click',function(){
			$('.changeHeadMask').addClass('show');
		});
	  
		//翻页功能 
		$('.pageCtl i').on('click',function(){
			var cbtn = $(this);
			var turnType = cbtn.attr('class');
			var list = $('.listWrap .list');
			var maxPgNum = list.find('.tbl').size();
			//获取当前页面页数
			var curPgNum = list.attr('data-currentPage')*1;
			//每次点击清空选中
			list.find('td.select').removeClass('select');
	   
			if(turnType == 'up' && curPgNum>1){
				list.attr('style','-webkit-transform:translate3d(0,-'+((curPgNum-2)*154+1)+'px,0)');
				list.attr('data-currentPage', curPgNum-1);
			}else if(turnType == 'down' && curPgNum<maxPgNum){
				list.attr('style','-webkit-transform:translate3d(0,-'+(curPgNum*154+1)+'px,0)');
				list.attr('data-currentPage', curPgNum+1);
			}
		});
	 
		//头像点选功能
		$('.listWrap .list .tbl td').on('click',function(){	 
			$(this).parents('.tbl').find('td').removeClass('select');
			$(this).addClass('select');
			//头像选中后 to do something...
		});
	},
	
	createRecommedNUM:function(){
		var param = {
		};
		Ajax({url:"/userSetting/createRandomNUm",data:param, success:function(data){
			if(MUI.isEmpty(data.errorCode)){
				var recommendNum = data.cd.RecommendNum;
				if(recommendNum){
					App.storage.set("recommendNum",recommendNum);
				}
			}else if(data.errorCode == "EBLN0000"){
				//游客无邀请码
			}else{
				Utils.alertinfo(data.errorMessage);
			}
			Client.hideWaitPanel(1);
		}});
	},
	toCenter : function(){
		
		Client.menuOpt("3");
		App.navigate("settings/setCenterCtl/setCenter");
	},
	
	toIndex : function(){
		Client.menuOpt("1");
		App.navigate("index/index/index");
	},
	
	special : function(){
		Client.menuOpt("0");
		var v = Utils.search().version;
		App.navigate("special/specialCtl/special",{v:v});
	},

	toloancenter: function(){
		App.navigate("houseloan/houseloanCtl/loanCenter");
	},
	contact : function(){
		App.navigate("anymore/anymoreCtl/contact");
	},
	
	loan : function(){
		App.navigate("houseloan/houseloanCtl/loanCenter");
	},
	
	identityUpload : function(){
		App.navigate("anymore/anymoreCtl/identityUpload");
	},
	
	toHelp : function(){
		App.navigate("anymore/anymoreCtl/messageCenter");
	}
	
	});
});


