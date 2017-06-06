define(function(require, exports, module){
	
	var myBankCardTpl = require("text!../template/myBankCard.html");
	
	var myBankCardView = module.exports = ItemView.extend({
		
	template : myBankCardTpl,
	
	events: {
		"click #chage" : "chage",
		"click #addCard" : "addCard",
		"click #keyBack" : "keyBack"
	},
		//定义日志TAG便于错误信息查找
	initialize : function(){
		//白名单控制流程开始
		var iWhiteList = App.storage.get("UserInfo").iWhiteList;
		var len = 0;
		if(iWhiteList == null || iWhiteList.length == 0){
			
		}else{
			len = iWhiteList.length;
		}
		this.whiteFlow = 0;//0可以解除绑定卡，是白名单流程，1不能解除绑定卡，不是白名单流程
		for(var i=0;i<len;i++){
			if("ZX0054" == iWhiteList[i].whiteBsnCode){
				if("01" == iWhiteList[i].whiteBsnState){
					break;
				}else if("00" == iWhiteList[i].whiteBsnState){
					if("00" == iWhiteList[i].whiteUserState){
						//能访问
						break;
					}else{
						//不能访问
						this.whiteFlow = 1;
						break;
					}
					
				}
				else if("02" == iWhiteList[i].whiteBsnState){
					var dataNow = new Date();
					var whiteBeginTime = Utils.parseDate(iWhiteList[i].whiteBeginTime,"yyyyMMddhhmmss").getTime();
					var whiteEndTime = Utils.parseDate(iWhiteList[i].whiteEndTime,"yyyyMMddhhmmss").getTime();
					if("00" == iWhiteList[i].whiteUserState&&whiteBeginTime<=dataNow&&dataNow<=whiteEndTime){
						//能访问
						break;
					}else{
						//不能访问
						this.whiteFlow = 1;
						break;
					}
				}
			}
		}
	
		//白名单控制流程结束
		var iCardList = App.storage.get("userCardList");
		var pageTest = {
			  	title:'银行卡管理',
				leftButton:{
					name : '返回',
					func: 'curView.goBack()'//goToHome  顶层返回首页
				},
				rightButton:(iCardList && iCardList.length>this.whiteFlow)?{
					name : '管理',
					func : 'curView.cardManage()'
				}:{
					name : '',
					func : ''
				}
		  };
		Client.initPageTitle(pageTest);
	    this.param = {};
	    this.cardNo = "";
	    this.bindCardNo = "";
	    this.init();
	},
	init : function(){
		if(!MUI.isEmpty(App.storage.get("balanceInfo"))){
			$("#balance").html(Utils.formatCurrency(App.storage.get("balanceInfo").balanceAvailable,2));
		}else if(!MUI.isEmpty(App.storage.get("paramAccount"))){
			$("#balance").html(App.storage.get("paramAccount").balance);
		}else{
			 var sendStr={
					 "accountNo":Utils.getEleCard().cardNo,
					 "accountType":Utils.getEleCard().accountType
			 };
			 
			 Ajax({url:"/account/life_accountBalanceQueryAjax", data:sendStr, success:function(data){
				 if(MUI.isEmpty(data.errorCode)){
					 var balance = data.cd.balanceAvailable;
					 $("#balance").html(Utils.formatCurrency(balance,2));

				 }else{
					 $("#balance").html("0.00");
				 }
			 }});
		}
		var iCardList = App.storage.get("userCardList");
		if(MUI.isEmpty(iCardList)){
			this.queryCardList();
		}else{
			$("#cardList").empty();
	  		for(var i=0;i<iCardList.length;i++){
	  			var kcoll=iCardList[i];
	  			this.addRow(kcoll);
	  		}
			Client.hideWaitPanel(1);
		}
	},
	
	pwdDeal:function(){
		var me = $("#password1");	
		var s = me.val();
		s.length > 6 ? s = s.substring(0, 6) : null;
		me.val(s);	
		this.fixL(s.length);
	},
	fixL : function(n){
		n > 6 ? n = 6 : null;
		for(var i = 0; i<6; i++){
			i+1 > n ? 
			$('.tradePswd .cell').eq(i).removeClass('active') :
			$('.tradePswd .cell').eq(i).addClass('active');
		}
	},
	
	queryCardList : function(){
		  var params={
				  cardNo:Utils.getEleCard().cardNo
		  };
		  var $this = this;
		  Ajax({url:"/cardManage/cardListQuery", data:params, 
			  success:function(data){
				  
				  if(MUI.isEmpty(data.errorCode)){
				  		var iCardList=data.iCardList;
				  		$("#cardList").empty();
				  		for(var i=0;i<iCardList.length;i++){
				  			var kcoll=iCardList[i];
				  			$this.addRow(kcoll);
				  		}
				  		App.storage.set("userCardList",iCardList);
				  		var pageTest = {
							  	title:'银行卡管理',
								leftButton:{
									name : '返回',
									func: 'curView.goBack()'//goToHome  顶层返回首页
								},
								rightButton:(iCardList && iCardList.length>$this.whiteFlow)?{
									name : '管理',
									func : 'curView.cardManage()'
								}:{
									name : '',
									func : ''
								}
						  };
				  		Client.initPageTitle(pageTest);
				  }else{
				  		Utils.alertinfo(data.errorMessage);
				  }
				  Client.hideWaitPanel(1);

			  },
			error : function() {
				Client.hideWaitPanel();
				Utils.alertinfo("服务器异常！");
			}
		  });
	},
	deleteCard : function(){
		if(MUI.isEmpty(this.cardNo)){
			Utils.alertinfo("银行卡号不能为空！");
			return;
		}
		  var params={
				  cardNo:this.cardNo
		  };
		  var $this = this;
		  Client.openWaitPanel("拼命加载中，请稍候");
		  Ajax({url:"/cardManage/deleteUserCard", data:params, 
			  success:function(data){
				  
				  if(MUI.isEmpty(data.errorCode)){
						Utils.alertinfo("银行卡删除成功！");
						$this.queryCardList();
				  		
				  }else{
				  		Utils.alertinfo(data.errorMessage);
				  }
				  Client.hideWaitPanel(1);

			  },
			error : function() {
				Client.hideWaitPanel();
				Utils.alertinfo("服务器异常！");
			}
		  });
	},
	setNotActive : function(){
		//设置本地未激活
	    var userInfo = App.storage.get("UserInfo");		
	    userInfo.iCardInfo[Utils.getEleCard().elecAccIndex].cardStatus = '00';
	    App.storage.set("UserInfo",userInfo);//将参数放入session	
		//设置未绑卡
	    userInfo.bindCardNo = "";
		App.storage.set("UserInfo",userInfo);
		
	},
	dosubmit : function(){
		Client.pwdHide("");
		var params = {
	   	 		password : this.pwd,
	   	 		pwdkey : this.pwdKey,
	   	 		cardNo : Utils.trim(Utils.getEleCard().cardNo),
	   	 		accountType : Utils.trim(Utils.getEleCard().accountType)
	   	 	};
	   	 var $this = this;
		  Client.openWaitPanel("拼命加载中，请稍候");
		  Ajax({url:"/cardManage/deleteBindCard", data:params, 
			  success:function(data){
				  
				  if(MUI.isEmpty(data.errorCode)){
						Utils.alertinfo("绑定卡删除成功！");
						$this.setNotActive();//设置本地存储未激活
						$this.queryCardList();
				  		
				  }else{
				  		Utils.alertinfo(data.errorMessage);
				  }
				  $this.clearPwd();//重载随机数
				  Client.hideWaitPanel(1);
	
			  },
			error : function() {
				$this.clearPwd();//重载随机数
				Client.hideWaitPanel(1);
				Utils.alertinfo("服务器异常！");
			}
		  });
	},
	
	clearPwd : function(){
	  	 $("#password1").val("");
		 this.pwd = "";
 		 this.pwdKey = "";
		 Client.loadPwdKey();
  	},
	
  	getPassword : function(obj){
   	 	this.pwd = obj.pwd;
   	 	this.pwdKey = obj.pwdKey;
   	 	this.dosubmit();	
    },
      
	deleteBindCard : function(){
		var totalProperty=App.storage.get("paramAccount").totalProperty;
	    totalProperty=Utils.removeComma(totalProperty);
		if(totalProperty>0){
			Client.alertinfo("您持有产品或电子账户有余额，无法解绑，请先将产品赎回至电子账户并将所有资金转出至银行卡，再进行解绑操作","温馨提示","curView.cardManage()",true,"curView.cardManage()");
		}else{

			if(pubParam.clientVersion <= "3.0.8"){
				//老版本用页面输入交易密码
				$("#codeInput").show();
				//页面输入密码框，兼容老版本开始
				var iptRow = $('.tradePswd .row');
				var ht = iptRow.width()/6;
				iptRow.css({
					height: ht + 'px',
					lineHeight: ht + 'px'
				});	 
				var codeInput = $('#codeInput');
				//页面输入密码框，兼容老版本结束
				this.inputPassword();
			}else{
				//新版本有客户端输入交易密码
				Client.setTransPwd("1",'请输入您的杭银直销交易密码','','curView.getPassword');
			}

		}
	},
	savePassword : function(data){
   	 	this.pwd = data.pwd;
   	 	this.pwdKey = data.pwdKey;
   	 	this.pwdDeal();
        var password=$("#password1").val();
        if(!Utils.isEmpty(password)&&password.length==6){  
        	Client.hideClientPanel();
        	this.dosubmit();
        } 	 		
    },
	inputPassword : function(){
		var opt = {
			 elem:"#password1",//当前对像
			 type:'number',//text 字母与数字 number数字键盘
			 max:'6',
			 callback:'curView.savePassword',
			 confirm:'1'
		 };
		 Client.showPwdPicker(opt);
		 Client.openClientPanel();

   },
	
	addRow : function(kcoll){
		var html="";
		var html2="";
		var className="";
		if(kcoll.bandFlag=="1"){
			html = '<i id ="chage" class="md">修改绑卡</i>';
			html2 = ' <span class="fc-9">(绑定卡)</span>';
			className=" bindCard";
			this.bindCardNo = kcoll.cardNo;
		}else{
			className=" comCard";
		}
		var bankIconUrl = kcoll.bankIconUrl;
		var bankClass = 'ar-'+bankIconUrl.split('_')[1];			  						
		$("#cardList").append('<li>'+
	            	'<div class="card '+bankClass+className+'">'+
	            	'<i class="ico-bnk-x2"></i>'+
	            	'<h1>'+kcoll.bankName+html2+'</h1>'+
	                '<p class="fc-9">'+Utils.protectAcc(kcoll.cardNo)+'</p>'+
	                html+
	                '<i class="del" data-val="'+kcoll.cardNo+'"></i>'+
	            '</div>'+
	        '</li>');
		var $this = this;
		$(".del").off().on("click",function(){
			$this.cardNo = $(this).attr("data-val");
			if($this.cardNo == $this.bindCardNo){
				//删除绑定卡
				$this.deleteBindCard();
			}else{
				//删除非绑定卡
				Client.alertinfo("确定要删除该银行卡么？","提示","curView.deleteCard()",true);
			}
			
		});
	},
	
	chage : function(){
		var totalProperty=App.storage.get("paramAccount").totalProperty;
		    totalProperty=Utils.removeComma(totalProperty);
		if(totalProperty>0){
			Utils.alertinfo("请将电子账户资金全部转回绑定卡后再变更");	
		}else{
			var params={bindCardNo:this.bindCardNo}; 
			App.navigate("myBankCard/myBankCardCtl/changeCard",params);
		}
		
	},	
	
	goBack : function(){
		App.back();
	},
	
	addCard : function(){
		App.navigate("myBankCard/myBankCardCtl/addCard");
	},
	
	help:function(){
		App.navigate("anymore/anymoreCtl/messageCenter");
	},
	
	cardManage:function(){

		if($(".comCard").length > 0){
			//先删除非绑定卡
			if($(".comCard").attr("data-val")=="1"){
				$(".comCard").removeClass("active").attr("data-val","0");
				this.showManage();
			}else{
				$(".comCard").addClass("active").attr("data-val","1");
				this.showFinish();
			}
		}else{
			//删除绑定卡
			if($(".bindCard").attr("data-val")=="1"){
				$(".bindCard").removeClass("active").attr("data-val","0");
				this.showManage();
			}else{
				$(".bindCard").addClass("active").attr("data-val","1");
				this.showFinish();
			}
		}
	},
	
	showFinish : function(){
		var pageTest = {
			  	title:'银行卡管理',
				leftButton:{
					name : '返回',
					func: 'curView.goBack()'//goToHome  顶层返回首页
				},
				rightButton:{
					name : '完成',
					func : 'curView.cardManage()'
				}
		  };
		Client.initPageTitle(pageTest);
	},
	
	showManage : function(){
		var pageTest = {
			  	title:'银行卡管理',
				leftButton:{
					name : '返回',
					func: 'curView.goBack()'//goToHome  顶层返回首页
				},
				rightButton:{
					name : '管理',
					func : 'curView.cardManage()'
				}
		  };
		Client.initPageTitle(pageTest);
	},
	
	keyBack : function(){
		$("#codeInput").hide();
		Client.hideClientPanel();
		this.clearPwd();
	}
	
	});
});