define(function(require, exports, module) {

	var resultTpl = require("text!../template/result.html");

	var resultView = module.exports = ItemView.extend({

		events : {
			"click #next" : "next",
			"click #back" : "back"
		},

		template : resultTpl,
		// 定义日志TAG便于错误信息查找
		initialize : function() {

			var pageTest = {
				title : '贷款申请',
				leftButton : {
					name : '返回',
					func : 'App.back()'
				},
				rightButton:{
					name : '取消',
					func :'curView.cancel()'
				}
			}
			Client.initPageTitle(pageTest);
			Client.hideWaitPanel(10);

			this.param = App.storage.get("_parameters");
			if (this.param.res == "fail") {
				$(".sucState").addClass("disabled");
				$("#next").hide();
				$("#back").show();
			}
			/*
			 * if(this.param.action == "填写实名信息"){ $(".tp2 li").hide(); $("#certNo").parents("li").show();
			 * $("#userName").parents("li").show(); }else if(this.param.action == "账户升级"){ $("#next").text("升级账户"); }
			 */
		},

		/*
		 * next:function(){ if(this.param.url.indexOf("upgrade")>=0){ var param = { cardNo:Utils.getEleCard().cardNo, }; var $this = this;
		 * Client.openWaitPanel("请稍候"); Ajax({url:"/specialFinance/accountUpgrade",data:param, success : function(data) {
		 * App.navigate("special/specialCtl/upgrade?result="+data.result+"&em="+data.errorMessage); if(data.result=="success"){ var userinfo =
		 * App.storage.get("UserInfo"); userinfo.userType = "02"; App.storage.set("UserInfo",userinfo); } } }); return; }
		 * App.navigate(this.param.url,this.param); },
		 */

		cancel : function(){
			
			var index = App.browseList.indexOf("houseloan/houseloanCtl/loanCenter");
    	  	App.browseList.splice(1,index-1);
			App.back();
			
		},		
		
		next : function() {
			var newparam = {
				certNo : App.storage.get( "_parameters").certNo,
				 busiType:"1"
			};
			App.storage.set("CetrNo",newparam.certNo);
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({
				url : "/houseloan/housecontractquery",
				data : newparam,
				success : function(data) {
					if (MUI.isEmpty(data.errorCode)) {

						var housecontract = data.icontractinfo;
						App.storage.set("housecontract", housecontract);

						if (housecontract.length == "1") {
							
							var houseconsec = data.icontractinfo[0].contractnum;

							var param2 = {

									certNo : App.storage.get( "CetrNo"),
								contractnum : houseconsec

							};
							Client.openWaitPanel("拼命加载中，请稍候");
							Ajax({
								url : "/houseloan/housestatusAjax",
								data : param2,
								success : function(data) {
									if (MUI.isEmpty(data.errorCode)) {
										App.storage.set("firstinfo", data);
										App.navigate("houseloan/houseloanCtl/houseinfo");
									} else {
										Client.alertinfo(data.errorMessage, "提醒");
									}
									Client.hideWaitPanel(1);

								}
							});


						} else if (housecontract.length > 1) {
							
							App.navigate("houseloan/houseloanCtl/houseConcern");

						} else if (housecontract.length == "0") {
							
							App.navigate("houseloan/houseloanCtl/noLoaninfo");

						}

					}
				}
			})

		},

		back : function() {
			if (Utils.search().from == "ocr") {
				App.back(2);
			} else {
				App.back();
			}
		}

	});
});
