define(function (require, exports, module) {
	
	var LoginTemplate = require("text!../template/login.html");
	
	var LoginView = module.exports = ItemView.extend({
	  
		template : LoginTemplate,
		
		events: {
			"click #pwd" : "showPwd",
			"click #login" : "login",
			"click #forget" : "toforget",
			"click #register" : "toReg",
			"click #getCodeImg" : "getCodeImg",
			"click #reg" : "loginwx"
		},
		
		initialize : function(){
			this.clearPwd();
			this.isUse = true;
			var userId = MUI.Cache.get("userId");
			if(userId){
				$("#userId").val(userId.data);
			}
			Utils.clearInput('.fm-del');
			$("#userId").on("focus",function(){
				$(this).parent().addClass("focusState");
			}).on("blur",function(){
				$(this).parent().removeClass("focusState");
			});
			
			if(pubParam.imageCodeKey=="UNCHECK"){
				$("#codeImgDiv").addClass("hidden");
			}else{
				this.getCodeImg();
			}
			Client.hideWaitPanel(1);
			document.querySelector('.content').addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
			
		},
		
		showPwd : function(){
			Utils.focusPosition($("#pwd").parent(),100);
			$("#pwd").parent().addClass("focusState");
			var opt = {
				elem:"#pwd",//当前对像
				type:'text',//text 字母与数字 number数字键盘
				max:'20',
				callback:'curView.savePassword'
			};
			Client.showPwdPicker(opt);
		},
		
		savePassword : function(obj){
			this.pwd = obj.pwd;
			this.pwdKey = obj.pwdKey;
			if(MUI.isEmpty(this.pwd)){
				this.isUse = false;
			}

			var $pwd = document.getElementById("login-pswd");
			var Input = $pwd.querySelector('input'); 
			var tarValLength = Input.value.length;
			var clear = $pwd.querySelector('i');
			tarValLength>0 ? (clear.style.display="block") : (clear.style.display="none");
			clear.addEventListener('click',function(e){
				Input.value = "";
				clear.style.display="none";
			},false);
   		
		},
		
		clearPwd : function(){
    		$("#pwd").val("");
    		this.pwd = null;
    		this.pwdKey = null;
			Client.loadPwdKey();
			$("#login-pswd i").hide();
    	},
    	
		validate : function(){
			var userId = $("#userId").val();
			var checkLen = $("#pwd").val().length>=6;
			if(this.pwd&&this.pwdKey&&userId&&checkLen){
				$("#login").removeAttr("disabled","disabled");
			}else{
				$("#login").attr("disabled","disabled");
			}
		},
		
		login : function(){
			
			var userId = $("#userId").val();
			var validCode = $("#validCode").val();
			
			if(!userId){
				Utils.alertinfo("请输入用户名！");
				return false;
			}

			if(!(this.pwd&&this.pwdKey)){
				if(this.isUse){
					Utils.alertinfo("请输入登录密码！");					
				}
				this.isUse = true;
				return false;
			}else{
				this.isUse = true;
			}
			
			if(pubParam.imageCodeKey!="UNCHECK"&&!validCode){
				Utils.alertinfo("请输入验证码！");
				return false;
			}

			var param = {
				customerId : $("#userId").val(),
				pwdkey : this.pwdKey,
				password : this.pwd,
				imageCodeKey : pubParam.imageCodeKey,
				imageCode : validCode,
			};
			var $this = this;
			Client.openWaitPanel("正在提交中，请稍候");
			Ajax({url:"/userSign/signIn", data:param, 
				success:function(data){
					if(data.errorCode){
						if(data.errorMessage.indexOf("无法获取交易代码")>=0){
							Utils.alertinfo("用户名或密码错");
							return false;
						}						
						Utils.alertinfo(data.errorMessage);
						$this.getCodeImg();
						
						Client.hideWaitPanel(1);
					}else{
						pubParam.imageCodeKey = "UNCHECK";
						$this.cleanSession();
						App.storage.set("UserInfo",data);
						$this.checkBoseSign();
						Client.setClientInfo(data);
						if(document.getElementById("remember").checked){
							MUI.Cache.save("userId",param.customerId);
						}else{
							MUI.Cache.clear();
						}
						
						//判断开始
						var batchAccParam = {
								mobileNo:data.regMobile,
								userName : data.customerNameCN,
						};

						if( data.hasResetPwd == "10"){
							App.navigate("userRegister/userRegisterCtl/batchPassWordSetting",batchAccParam);
							$this.clearPwd();
							return;
						}else if(data.hasResetPwd == "11" && !data.batchNo){
							App.navigate("userRegister/userRegisterCtl/ocrCredit");
							$this.clearPwd();
							return;
						}else{
							
							if((data.userType=='01'||data.userType=='02')&&data.handPwdSwitch == '9'){
								//手势初始化 
								 var opt = {
										 type:4,    	//1开关手势，2设置手势，3获取手势状态,4提示设置手势
										 url:"/#settings/setCenterCtl/finger",
										 isopen:true,	//true打开手势，false关闭手势
										 callback:"curView.getHandPwd"	//回调函数
									 };
								 Client.handPwd(opt);
							}
							
							var fragment = App.history.fragment;
							if(fragment.indexOf("type=account")>0){
								Client.menuOpt("3");
								App.navigate("account/mycountCtl/mycount");
							}else{
								if(App.storage.get("_parameters")!="fainance")
									Client.menuOpt("5");
								App.back();
							}
							$('.ui-view').removeAttr('style');
						}
						//判断结束
						
					}
					
					$this.clearPwd();
				}
			});
		},
		
		checkBoseSign : function(){
			//预查询博时基信息
			if(!Utils.getEleCard().cardNo){
				return;
			}
			var sessionInfo = App.storage.get("UserInfo");
	  	    var cardStatus = Utils.getEleCard().cardStatus;
			if(!MUI.isEmpty(sessionInfo)&&!MUI.isEmpty(sessionInfo.userType)&&(sessionInfo.userType=='01'||sessionInfo.userType=='02')&&cardStatus && cardStatus=="01"){
				var param = {
						productId:Utils.getParamDisplay("PB_BOSERA",'1'),
						cardNo : Utils.trim(Utils.getEleCard().cardNo),
			    		accountType : Utils.trim(Utils.getEleCard().accountType)
				};
				Ajax({url:"/bosera/queryBoseraFinance",data:param,
					success:function(data){
						if(MUI.isEmpty(data.errorCode)){
							App.storage.set("iBoseraIncome",data.iBoseraQuery);
		    			}
				}});
			}
		},
		
		toforget : function(){
			App.navigate("settings/setCenterCtl/logonPasswordReset1");
		},
		
		toReg : function(){
			App.navigate("userRegister/userRegisterCtl/userRegisterStep1");
		},
		loginwx : function(){
			App.navigate("login/wxloginCtl/wxlogin");
		},
		goBack : function(){
			$('.ui-view').removeAttr('style');
			var fragment = App.history.fragment;
			if(fragment.indexOf("type=account")>0&&Device.os=="android"){
				Client.menuOpt("1");
				App.navigate("index/index/index");
			}else{
				Client.menuOpt("5");
				App.back();
			};
        },
        
        help : function(){
     		App.navigate("anymore/anymoreCtl/messageCenter");
     	},
     	getCodeImg : function(){
     		pubParam.imageCodeKey = "ZXCK"+new Date().getTime()+this.getRandom(6);
    		$('#verifyImg').attr('src','/'+pubParam.proName+'/userSign/imageCode?key='+pubParam.imageCodeKey);//验证码重新生成
    		$("#validCode").val("");
    		$("#codeImgDiv").removeClass("hidden");
     	},
     	getRandom : function(n){
     		var res ="";
     	    for(var i = 0; i < n ; i ++) {
     	    	res += Math.floor(Math.random()*10);
     	    }
     	    return res;
     	},
     	cleanSession : function(){
    		var ad = App.storage.get("adList");
    		var aprShowMsg = App.storage.get("aprShowMsg");
    		var boseRate = App.storage.get("boseRate");
    		var boseGold = App.storage.get("boseGold");
    		App.storage.clear();
    		App.storage.set("adList",ad);
    		App.storage.set("boseRate",boseRate);
    		App.storage.set("aprShowMsg",aprShowMsg);
    		App.storage.set("boseGold",boseGold);
    	}
		
	});
	
});


