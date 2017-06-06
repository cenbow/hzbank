define(function(require, exports, module){
	
	var indexView = require("../views/index");
	var mallIndexView = require("../views/mall_index");
	var anyMoreView = require("../../anymore/views/any_more");
	var activitiesMoreView = require("../../anymore/views/activities_more");
	var aboutUsView = require("../../anymore/views/about_us");
	var messageCenterView = require("../../anymore/views/message_center");
	var WantInvView = require("../../product/views/wantInv");
	var indexController = module.exports = Controller.extend({
		
		actions:{
			"index":"index",
			"mall_index":"mall_index"
		},
		
		index : function(){
			var iBankNotice = App.storage.get("iBankNotice");
			if(iBankNotice&&iBankNotice.length>0){
				this.isNoticeShow =true;
			}else{
				this.isNoticeShow =false;
			}
			var pageStep = {
					title:'杭银直销',
					leftButton:{
       					name : '',
       					func : 'scan'
       				},
	       			rightButton:
	       				Utils.checkSession()?{
	       					name : this.isNoticeShow?'活动':'无活动',
							func : 'curView.active()'
		       			}:{
		       				name : '登录',
		       				func : 'curView.login()'
		       			}
			};
			Client.initPageTitle(pageStep);
			Client.menuOpt("1");
			var versions = ["3.0.1","3.0.2","3.0.3","3.0.4","2.0.5"];
			var isIn = versions.indexOf(pubParam.clientVersion);
			if(Device.os == "android" && !pubParam.versionCtl && isIn >= 0){
				Ajax({url:"/pubServer/queryWebClientVersion", data:{platform:"03",appVersion:pubParam.clientVersion}, 
					success:function(data){
						if (data.errorCode) {
							App.container.show(new indexView());
						} else {
							if(data.length > 0){
								pubParam.versionCtl = data[0];
							}
							App.container.show(new indexView());
						}
					},
					error:function(){
						App.container.show(new indexView());
					}
				});
			}else{
				App.container.show(new indexView());
			}
		},
		mall_index : function(){
			App.container.show(new mallIndexView());
		}
	});
});