define(function(require, exports, module){
	
	var concernUsTpl = require("text!../template/concern_us.html");
	var concernUsView = module.exports = ItemView.extend({
	template : concernUsTpl,
	events:{
		"click #spit" : "suggestion",
		"click #spitSubmit" : "spitSubmit",
		"keyup #spitContent" : "numController",
		"blur #spitContent" : "numController",
		"click #about-us" : "aboutUs",
		"click #attention" : "attention"
	},
	initialize : function(){
		if(Utils.checkSession()){
			$('#spit').show();
		};
		var pageTest = {
			  	title:'关于我们',
				leftButton:{
					name : '返回',
					func :'curView.goToBack()'
				},
				rightButton:{
					name : '',
					func : ''
				}
		  }
		Client.initPageTitle(pageTest);
		Client.hideWaitPanel(1); 
	},
	goToBack : function(){
		App.back();
	},
	help : function(){
  		App.navigate("anymore/anymoreCtl/messageCenter");
  	},
	attention:function(){
		App.navigate("anymore/anymoreCtl/attention");
	},
	numController : function(){
		var words=150-$('#spitContent').val().length;
		if(words<=0){
			words=0;
			$('#spitContent').val($('#spitContent').val().substring(0,150));
		}
		$('#txt-words').html("您还可以输入"+words+"字");
	},
	 spitSubmit : function(){
		var pa = App.storage.get("UserInfo");
		var param = {};
		var time=new Date();
		
		if($('#spitContent').val()){
			param.customerMessage=$('#spitContent').val();
		}else{
			Utils.alertinfo("请输入反馈信息！");
			return false;
		}
		
		if($('#spitContent').val().length>150){
			Utils.alertinfo("您输入的信息过长！");
			return false;
		}
		
		
		var managerInfo=NS.PB_FEEDBACK_MANAGERINFO[0].text.split('|');
		
		param.customerAlias=pa.customerAlias;
		param.customerNameCN=pa.customerNameCN;
		param.customerMobile=pa.regMobile;
		param.customerEmail="";
		param.sendTime=time;
		param.userId=managerInfo[1];//ID
		param.userName=managerInfo[2];//姓名
		param.email=managerInfo[4];//email
		Client.openWaitPanel("拼命加载中，请稍候");
		Ajax({url:"/anyMore/spitSubmit", data:param, success:function(data){
			Client.hideWaitPanel();
			if(MUI.isEmpty(data.errorCode)){
				Utils.alertinfo("提交成功！");
				curView.goBack();
			}else{
				Utils.alertinfo(data.errorMessage);
			}   
		}});
	},
	goBack:function(){
		//初始化菜单方法
		var pageTest = {
			  	title:'更多内容',
				leftButton:{
					name : '',
					func : 'curView.toIndex()'
				},
				rightButton:{
					name : ''
				}
			  }
		Client.initPageTitle(pageTest);
		App.container.show(this);
		this.initialize();
	},
	 aboutUs : function(){
		 App.navigate("anymore/anymoreCtl/aboutUs");
	},
	 suggestion : function(){
		 var pageTest = {
				  	title:'意见反馈',
					leftButton:{
						//exist : 'false',
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
				  };
		 Client.initPageTitle(pageTest);
		$('#spitboard').show();
		$('#anymore').hide();
	},
	toIndex : function(){
		Client.menuOpt("1");
		App.navigate("index/index/index");
	},
	});
});


