define(function(require, exports, module){
	
	var attentionTpl = require("text!../template/attention.html");
	
	var attentionView = module.exports = ItemView.extend({
		
		events : {
			"click .i-serve-phone" : "telphone",
			"click #ejsh" : "toejsh",
			"click #hyqb" : "tohyqb",
			"click .i-wechat" : "hzwechat"
		},
		
		template : attentionTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    var pageTest = {
				  	title:'关注我们',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			  }
			Client.initPageTitle(pageTest);
		    Client.hideWaitPanel(100);
		},
		
		toejsh : function(){
			if(Device.os=="iphone")
				window.open("https://itunes.apple.com/cn/app/e+sheng-huo-quan/id730200318?mt=8");
			else if(Device.os=="android")
				window.open("http://www.hzbank.com.cn/uploadfiles/HZBANK_CityLife_signed.apk");
		},
		
		tohyqb : function(){
			if(Device.os=="iphone")
				window.open("itms-services://?action=download-manifest&url=https://mbank.hzbank.com.cn/HZBANK_NETServer/hzbank_per2.plist");
			else if(Device.os=="android")
				window.open("http://www.hzbank.com.cn/uploadfiles/hzbank_per2.apk");
		},
		
		telphone : function(){
			Client.callPhone($('#phone').attr("val"));
		},
		
		hzwechat : function(){
			App.navigate("anymore/anymoreCtl/weixin");
		},
		
		goBack : function(){
			App.back();
		}
	
	});
});
