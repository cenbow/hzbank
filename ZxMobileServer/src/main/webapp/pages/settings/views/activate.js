define(function(require, exports, module){
	
	var activateTpl = require("text!../template/activate.html");
	
	var activateView = module.exports = ItemView.extend({
		
	template : activateTpl,
	events:{
		"click #activateBtn":"elecAccActivate",
	},
	initialize : function(){
		//初始化菜单方法
		 var pageStep1 = {
			  	title:'账户激活',
				leftButton:{
					name : '返回',
					func: 'curView.goBack()'
				}
		  };
		 Client.initPageTitle(pageStep1);
		 this.bindCardNo="";
		 this.bankName="";
		 this.queryBackCard();

	},
	queryBackCard : function(){
		//获取登录信息
		  var params={
				  cardNo : Utils.getEleCard().cardNo
		  };
		  var $this = this;
		  Ajax({url:"/myBankCard/queryBindCard", data:params, 
			  success:function(data){
		    	  Client.hideWaitPanel(1);
				  if(MUI.isEmpty(data.errorCode)){
					  $this.bindCardNo=data.cd.bindCardNo;
					  $this.bankName=data.cd.bankName;
					  $("#bindCardNoFoot").text($this.getFootCard($this.bindCardNo));
				  }
			  },error:function(){
		    	  Client.hideWaitPanel(1);
	    	}});
	},
	goBack : function(){
		Client.menuOpt("5");
		App.back();
	},
	 //激活
	 elecAccActivate:function(){
		 	$this =this;
			var cardNo = Utils.getEleCard().cardNo;
			var param = {
					cardNo:cardNo
			};
			Client.openWaitPanel("");
			Ajax({url:"/pubServer/elecAccActivate",data:param, success:function(data){
				Client.hideWaitPanel(1); 
				if(MUI.isEmpty(data.errorCode)){
					var userInfo = App.storage.get("UserInfo");					
					userInfo.iCardInfo[Utils.getEleCard().elecAccIndex].cardStatus = '01';
					App.storage.set("UserInfo",userInfo);//将参数放入session
//					$this.goBack();
					Client.alertinfo("激活成功", "提醒","curView.gotoIndex()");

				}else{
					if(MUI.isEmpty($this.bankName)){
						Client.alertinfo("温馨提示:请您使用绑定卡通过绑定银行的手机银行、网银或柜面，往本电子账户转入任意资金，以便激活电子账户。");
					}else{
						Client.alertinfo("温馨提示:请您使用绑定卡(尾号"+$this.getFootCard($this.bindCardNo)+")通过"+$this.bankName+"的手机银行、网银或柜面，往本电子账户转入任意资金，以便激活电子账户。");
					}
				}
			}});
	 },	
	getFootCard : function(cardNo){
		var footCard ="****";
		footCard = cardNo.substring(cardNo.length-4);
		return footCard;
	},
	gotoIndex : function(){
		App.navigate("index/index/index");
	}
	});
});



