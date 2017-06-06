define(function (require, exports, module) {
	
	var LoanapplyfirstTemplate = require("text!../template/loanapplyfirst.html");
	
	var LoanapplyfirstView = module.exports = ItemView.extend({
		
        template : LoanapplyfirstTemplate,

		events: {
			"click #pwd" : "showPwd",
			"click #login" : "login",
			"click #forget" : "toforget",
			"click #getCodeImg" : "getCodeImg",
			"click #identifycheck" : "itCheck"
		},
        
        initialize : function(){
    	    var pageTest = {
    			  	title:'贷款申请',
    				leftButton:{
    					name : '返回',
    					func :'curView.goToBack()'
    				},
    				rightButton:{
    					name : '取消',
    					func :'curView.cancel()'
    				}
    		  }
    		Client.initPageTitle(pageTest);
    	    Client.hideWaitPanel(10);
    	    
    	    this.isUse = true;
			var userId = MUI.Cache.get("userId");
			if(userId){
				$("#userId").val(userId.data);
			}
			Utils.clearInput('.fm-del');
			$("#userId").on("focus",function(){
				$(this).parent().addClass("focusState");
				$("#pwd").parent().removeClass("focusState");
			}).on("blur",function(){
				$(this).parent().removeClass("focusState");
			});
			
			if(pubParam.imageCodeKey=="UNCHECK"){
				$("#codeImgDiv").addClass("hidden");
			}else{
				this.getCodeImg();
			}
			
			Client.hideWaitPanel(1);
			//document.querySelector('.content').addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
			
			if(Utils.checkSession()){
				$('.tab').hide();
				$(".swpage li").hide().eq(1).show();
			}else{
				$('.tab .cell').on('click', function(){
					$(this).addClass('active').siblings().removeClass('active');
					var curp = $('.swpage li').eq($(this).index());
					curp.show().siblings().hide();
				});
			}
			
    	},
      
    	goToBack : function(){
    		App.back();
    	},
    	
      cancel : function(){
    	  	var index = App.browseList.indexOf("houseloan/houseloanCtl/loanCenter");
    	  	App.browseList.splice(1,index-1);
			App.back();
			
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
    		this.pwdKey = null;
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
						Client.setClientInfo(data);
						if(document.getElementById("remember").checked){
							MUI.Cache.save("userId",param.customerId);
						}else{
							MUI.Cache.clear();
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
					$this.clearPwd();
				}
			});
		},		
	  toforget : function(){
			App.navigate("settings/setCenterCtl/logonPasswordReset1");
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

     	itCheck : function(){
			Client.ocrCheck("curView.getPhotoResFront");
		},
     	getPhotoResFront : function(obj){
     		this.param = {};
			Client.hideWaitPanel(1);
			obj.birth = obj.year+'-'+obj.month+'-'+obj.day;
			_.extend(this.param,obj);
			if(this.param.action == "填写实名信息"){
				App.navigate("userReg/userRegCtl/userRegisterStep1",this.param);
				return;
			}
			App.navigate("houseloan/houseloanCtl/identifycheck",this.param);
		},
		cleanSession : function(){
    		var ad = App.storage.get("adList");
    		var aprShowMsg = App.storage.get("aprShowMsg");
    		App.storage.clear();
    		App.storage.set("adList",ad);
    		App.storage.set("aprShowMsg",aprShowMsg);
    	}
    	
    	
	});
	  
});