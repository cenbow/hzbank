define(function(require, exports, module){
	
	var handTpl = require("text!../template/hand.html");
	
	var handView = module.exports = ItemView.extend({
		
		template : handTpl,
		
		events : {
			"click #hand" : "openHand",
			"click #chageHand" : "changeHand"
		},
		
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    var pageTest = {
				  	title:'设置手势',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			  };
			Client.initPageTitle(pageTest);
			if (Utils.checkRealUser("1")) {
				$("#chageHandSwitch").show();
				// 手势初始化
				this.opt = {
					type : 3, // 1开关手势，2设置手势，3获取手势状态
					isopen : true, // true打开手势，false关闭手势
					callback : "curView.getHandPwd" // 回调函数
				};
				Client.handPwd(this.opt);
			}
		    Client.hideWaitPanel(100);
		},
		
		changeHand : function() {// 修改手势
			this.opt.type = 2;
			Client.handPwd(this.opt);
		},
		
		getHandPwd : function(isopen, iset) {
			this.iset = iset;
			if (isopen == 0) {// 未开启
				document.getElementById("hand").checked = true;
				$("#hand").removeClass("checked");
				$("#chageHand").hide();
			} else {
				document.getElementById("hand").checked = false;
				$("#hand").addClass("checked");
				$("#chageHand").show();
			}
		},
		
		openHand : function() {// 开关手势

			var handChecked = !document.getElementById("hand").checked;
			var state = handChecked ? "1" : "0";

			var $this = this;
			var param = {
				state : state
			};
			Client.openWaitPanel("");
			Ajax({
				url : "/pubServer/pwdSwitchUpdate",
				data : param,
				success : function(data) {
					if (MUI.isEmpty(data.errorCode)) {
						var actionFlag = data.actionFlag; // 状态（0：未设置 1 ：已设置）
						$this.opt.isopen = handChecked;

						if (actionFlag == "1") {
							$this.opt.type = 1;
							if (handChecked == true) {
								$("#hand").removeClass("checked");
								$("#chageHand").show();
							} else {
								$("#hand").addClass("checked");
								$("#chageHand").hide();
							}
						} else {
							$this.opt.type = 2;
						}

						Client.handPwd($this.opt);
						Client.hideWaitPanel(1);
					} else {
						Utils.alertinfo(data.errorMessage);
						Client.hideWaitPanel(1);
					}
				}
			});
		},
		
		 
		goBack : function(){
			App.back();
		}
	
	});
});
