define(function(require, exports, module){
	
	var elecAccPwdFindTpl = require("text!../template/elecAccPwdFind.html");
	
	var elecAccPwdFindView = module.exports = ItemView.extend({
		
		template : elecAccPwdFindTpl,
		
		events : {
//			"click .list-item" : "goNext"
		},
		
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    var pageTest = {
				  	title:'找回交易密码',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			  };
			Client.initPageTitle(pageTest);
			var $this = this;
			$(".list-item").off().on("click",function(){
				var attr = $(this).attr("att");
				if(attr=="1"){
					//App.navigate("settings/setCenterCtl/elecAccPwdFindOne");
				}else{
					$this.queryApply();
//					App.navigate("settings/setCenterCtl/elecAccPwdReset");
				}
			}),
			 
		    Client.hideWaitPanel(100);
		},
		
		
		queryApply : function(){
			var $this=this;
	    	var param = {
	    			pageFlag:'0',
	    			turnPageBeginPos:'0',
	    			turnPageShowNum:'20',
	    			operationType:'1'
	    		};
			Client.openWaitPanel("拼命加载中，请稍候");
	    	Ajax({url:"/pubServer/resetTransPwdQuery",data:param,success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var icoll = data.iPwdResetList;
					var sysTime = data.sysTime;
					if(icoll.length <=0){//没有申请过
						App.navigate("settings/setCenterCtl/elecAccPwdReset");
					}else{//1待审批 2审批通过 3审批未通过 4审批作废 5用户已执行
						var isflag =false;
						for(var i=0;i<icoll.length;i++){
							var auditDate = Utils.formatDate(icoll[i].auditDate,"yyyyMMddhhmmss","yyyy/MM/dd hh:mm:ss");
							var sysTime1 = Utils.formatDate(sysTime,"yyyyMMddhhmmss","yyyy/MM/dd hh:mm:ss");
							var sysDate = new Date(sysTime1);
							var valDate = new Date(auditDate);
							var validDate = icoll[i].validDate?icoll[i].validDate:"0";
							var validTime = sysDate.getTime()-(valDate.getTime()+(24*60*60*1000*validDate));
							
							if(validTime<0 && icoll[i].tradeStatus=="2"){//在有效期之内
								isflag = true;
//								if(icoll[i].tradeStatus=="5"){
//									App.navigate("settings/setCenterCtl/elecAccPwdReset");
//								}else{
									var param = {tradeStatus:icoll[i].tradeStatus};
									App.navigate("settings/setCenterCtl/elecAccPwdFindResult",param);
//								}
								break;
							}
						}
						if(!isflag){
							if(icoll[0].tradeStatus=="1"){
								var param = {tradeStatus:icoll[0].tradeStatus};
								App.navigate("settings/setCenterCtl/elecAccPwdFindResult",param);
							}else if(icoll[0].tradeStatus=="2"){
								Client.alertinfo("您的审批已失效,请重新找回交易密码!","提醒","curView.goPwdReset()");
							}else if(icoll[0].tradeStatus=="3"){
								Client.alertinfo("您的审批未通过,请重新找回交易密码!","提醒","curView.goPwdReset()");
							}else if(icoll[0].tradeStatus=="4"){
								Client.alertinfo("您的审批已作废,请重新找回交易密码!","提醒","curView.goPwdReset()");
							}else{
								App.navigate("settings/setCenterCtl/elecAccPwdReset");
							}
						}
					}
				}else{
					Utils.alertinfo(data.errorMessage);
				}
				Client.hideWaitPanel(1);

	    	}});
		},
		
		
		goPwdReset : function(){
			App.navigate("settings/setCenterCtl/elecAccPwdReset");
		},
		 
		goBack : function(){
			App.back();
		},
	
	});
});
