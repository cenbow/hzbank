define(function (require,module,exports) {

	var android = {},
	    W = window;
	
	/**
	 * 开启等待层
	 */
	android.openWaitPanel = function(msg) {
		W.MsgJs.showWaitPanel(msg || "加载中...");
	};
	
	/**
	 * 关闭等待层
	 */
	android.hideWaitPanel = function(timeout) {
		W.MsgJs.hideWaitPanel(timeout || 1);
	};
	
	/**
	 * 弹出信息
	 * 
	 * @example : <br>
	 * 
	 */
	android.alertinfo = function(msg,title,funcOk,tow_btn,funkCancel) {
		var opt = {
			title : title || "系统提示",
			msg : msg,
			ok_btn : "true",
			ok_text : tow_btn?"取消":"",
			ok_func : funkCancel,
			cancel_text : "确定",
			cancel_func : funcOk
		};
		W.MsgJs.setAlertInfo(JSON.stringify(opt));
	};
	/**
	 * 确认信息
	 * 
	 * @example : <br>
	 * 
	 */	
	android.confirm = function(msg, title, okAct, cancleAct, okName, cancleName) {
		var cfg = {
			title : title || "系统提示",
			msg : msg,
			ok_btn : "true",
			ok_text : okName || "确定",
			ok_func : okAct,
			cancel_text : cancleName || "取消",
			cancel_func : cancleAct || "MUI.Client.hideWaitPanel"
		};
		W.MsgJs.setAlertInfo(MUI.JsonToStr(cfg));
	};

	/**
	 * 初始化页标题栏
	 */
	android.initPageTitle = function(pageId) {
		var pageStep = {
				title : '杭银直销',
				leftButton : {
					name : '',
					func : ''
				},
				rightButton : {
   					name : '',
					func : ''
				}
			};
		pageId = $.extend(pageStep,pageId);
		W.SysClientJs.updateTitleBar(MUI.JsonToStr(pageId));
	};
	
	
	/**
	 * 去登录
	 * @param callback 回调函数
	 */
	android.toLogin = function(callback){
		W.SysClientJs.toLogin(callback);
	}
	
	
	/**
	 * 显示安全键盘
	 */
	android.showPwdPicker = function(obj) {
			
			var ele = obj.elem;
			var EN = obj.type;
			var key= obj.randomKey;
			var value = obj.randomValue;
			var callback = obj.callback;
			this._preShowKeyBoard(ele);
			
			var cfg = {
					id : '',//input 文本框ID
					text : '',
					left : "10",
					right : "2",		
					randomNumber : '',
					max : '6',
					min : "6",
					enPW : "N",//密码键盘控制， Y:数字+字母键盘，N:数字键盘
					randomKey : "",//微通密码控件随机数Key
					randomValue : "",//微通密码控件随机数value		
					errorMsg : "",
					nullMsg : "",
					callback : '_savePassword',
					state : 'state',
					confirm : ''
				};
			
			//$.extend(true,cfg,obj);
			var jqObj = $(ele);
			cfg.id = jqObj.attr("id");
			var maxL = obj.max;
			if (maxL) {
				maxL *= 1;
				maxL = Math.max(6, maxL);
			} else {
				maxL = 6;
			}
			cfg.max = maxL;
			if (maxL == 20) {
				cfg.errorMsg = "密码支持6-20位的数字英文字母，大小写敏感，不允许设置纯数字、相同字母等过于简单的密码 ！";
			} else if (maxL == 8) {
				cfg.errorMsg = "密码支持6-8位的数字或英文字母！";
			} else {
				cfg.errorMsg = "密码不能小于6位，请核对后重新输入！";
			}
			
			if(undefined != EN && 'text' == EN){// 密码键盘控制是否允许英文
				cfg.enPW = 'Y';
			}else if(undefined == EN || 'number' == EN){
				cfg.enPW = 'N';
			}
			if(undefined != key && '' != key){// 微通密码控件随机数Key
				cfg.randomKey = key;
			}else{
				cfg.randomKey = '';
			}
			if(undefined != value && '' != value){// 微通密码控件随机数value
				cfg.randomValue = value;
			}else{
				cfg.randomValue = '';
			}
			if(undefined != callback && '' != callback){// 返回数
				cfg.callback = callback;
			}
			cfg.confirm = obj.confirm?obj.confirm:'';
			var p = JSON.stringify(cfg);
			var flag = jqObj.attr("pwd-type");
			W.SysClientJs.showNumber(p);
	};
	
	W._savePassword = function(ps) {
		try {
			var cfg = _WK_DATAS["pwdPick"];
			var elem = $(cfg.id);
			var pass = ps.split("|");
			var passValue = pass[0]; // RSA加密密文
			var md5Value = pass[1]; // MD5 加密密文
			var passLen = pass[2]; // 实际密码长度
			var isSign = pass[3]; // 判断是否中英文组合
			elem.attr("title", passValue); // 返回密码
			// ,设置密码,如果是新客户端就取对应id的title值，为加密密码
			elem.lable = md5Value;
			elem.lang = passLen;
			elem.name = isSign;
			if (passLen != null && passLen != "") {
				var len = passLen;
				var showValue = "";
				for (var i = 0; i < len; i++) {
					showValue += "8";
				}
				elem.val(showValue);
			} else {
				elem.attr("title", "");
				elem.val("");
			}
			var c = $("_KeyBoardDiv");
			if (c && c.dom) {
				c.hide();
			}
		} catch (e) {
			alert("_savePassword:" + e);
		}
	};
	
	android._preShowKeyBoard = function(ele) {
		// return;
		var a = document.body;
		a = a ? a : document.documentElement;
		var h = MUI.Utils.position(ele);
		var toolbar = $("toolbar");
		if (toolbar) {
			h.y = h.y - 56;
		}
		var c = buileFootdiv(ele, a);
		if (c != 0) {
			var d = $("_KeyBoardDiv");
			if (d && d.dom) {
				d.show();
			} else {
				var div = document.createElement("div");
				div.setAttribute("id", "_KeyBoardDiv");
				d = $(div);
				//d = $("_KeyBoardDiv");
			}
			//console.log("====="+d.dom);
			d.height(c);
			//d.style.height = c + "px";
			document.body.scrollTop = h.y - 50;
		} else {
			document.body.scrollTop = ele.scrollHeight + 200;
		}
	};
	
	/**
	 * 确认密码 
	 */
	android.pwdConfirm = function(func) {
		W.SysClientJs.comparePass(func);
	};
	
	
	W.buileFootdiv = function(ele, rootele) {
		var jianpanH = 210;
		var eleHeight = ele.scrollHeight;
		if (eleHeight < jianpanH) {
			var result = jianpanH - eleHeight;
			return result;
		} else {
			return 0;
		}
	};
	
	
	/**
	 * 通知重载随机数
	 */
	android.loadPwdKey = function(){
		W.SysClientJs.notifyGainPassRandom();
	}
	
	
	/**
	 * 关注我们
	 */
	android.attention = function(){
		var opt={
			url1:"/images/area-zs-bg.png"	,
			url2:"/images/zen-spinner-logo.gif"
		}
		W.SysClientJs.attention(MUI.JsonToStr(opt));
	}
	
	/**
	 * 分享
	 */
	android.share = function(opt){
		if(!opt.type){
			opt.type = "";
		}
		if(!opt.imageUrl||opt.imageUrl == ""){
			opt.imageUrl = "images/logoico.png";
		}
		W.SysClientJs.getShare(MUI.JsonToStr(opt));
	}
	
	/**
	 * 朋友圈
	 */
	android.sharePYQ = function(opt){
		if(!opt.type){
			opt.type = "";
		}
		if(!opt.imageUrl||opt.imageUrl == ""){
			opt.imageUrl = "images/logoico.png";
		}
		W.SysClientJs.getSharePYQ(MUI.JsonToStr(opt));
	}
	/**
	 * 版本更新
	 */
	android.updateVersion = function(){
		W.SysClientJs.updateVersion();
	}
	
	/**
	 * 退出登录
	 */
	android.logOut = function(callback){
		W.SysClientJs.logOut(callback);
	}
	
	/**
	 * 手势密码
	 */
	android.handPwd = function(opt){
		W.SysClientJs.selectGesturePassWord(MUI.JsonToStr(opt));
	}
	
	/**
	 * 呼叫号码
	 */
	android.callPhone = function(num){
		W.SysClientJs.callPhone(num);
	}
	
	/**
	 * 底栏控制
	 */
	android.menuOpt = function(opt){
		W.SysClientJs.showNavigationBar(opt);
	}
	
	
	/**
	 * 设置客户端用户信息
	 */
	android.setClientInfo = function(opt){
		var optstr = JSON.stringify(opt);
		try{
			W.SysClientJs.getUserInfo(optstr);
		}catch(e){
			alert(e);
		}
	};
	
	/**
	 * 设置密码键盘高度
	 */
	android.setPwdHeight = function(callback){
		W.SysClientJs.setPwdHeight(callback);
	};
	
	/**
	 * ajax加密
	 */
	android.encryptTransData = function(data,url,callback){
		var opt={};
		opt.data = data;
		opt.callback = callback;
		opt.url = url;
		
		W.SysClientJs.getEncryption(JSON.stringify(opt));
	};
	
	
	/**
	 * 日期键盘
	 */
	W._WK_DATAS = [];
	_WK_DATAS["datePick"] = {
			text : '',
			format : 'yyyy-MM-dd',
			min : '1920-01-01',
			max : '2030-12-31',
			callback : 'getDate'
		};
	
	android.pickDateTime = function(obj) {
		var cfg = _WK_DATAS["datePick"];
		if(obj){
			if(obj.format){
				obj.text = obj.text?Utils.formatDate(obj.text,cfg.format,obj.format):"";
				obj.min = obj.min || Utils.formatDate(cfg.min,cfg.format,obj.format);
				obj.max = obj.max || Utils.formatDate(cfg.max,cfg.format,obj.format);
			}
			_.extend(cfg,obj);
			
			_WK_DATAS["datePick"] = cfg;
		}
		W.SysClientJs.openDatePicker(JSON.stringify(cfg));
	};
	
	W.getDate = function(txt){
		var cfg = _WK_DATAS["datePick"];
		$("#"+cfg.id).val(txt);
	};

	/**
	 * Ocr识别身份证
	 */
	android.ocrCheck = function(callback){
		W.SysClientJs.takeCardIdPhoto(callback);
	};
	
	/**
	 *人脸识别(立思诚)
	 */
	android.faceCheck = function(data,callback){
		W.SysClientJs.personValidate(data.userName,data.certNo,callback);
	};
	
	/**
	 *人脸识别(face++)
	 */
	android.facePlusCheck = function(data,callback){
		if(data){
			data.callback = callback;
		}
		W.SysClientJs.facePersonValidate(JSON.stringify(data));
	};
	
	/**
	 * Ocr识别银行卡
	 */
	android.ocrBankCard = function(callback){
		W.SysClientJs.recBankCard(callback);
	};
	
	/**
	 * 获取位置信息
	 * @param callback
	 */
	android.getLocationInfo = function(callback){
		W.SysClientJs.getLocationInfo(callback);
	};
	
	/**
	 * 更换头像
	 * @param callback
	 */
	android.uploadPhoto = function(callback){
		W.SysClientJs.uploadPhoto(callback);
	};
	
	/**
	 * 指纹设置
	 * @param callback
	 */
	android.setFinger = function(opt){
		var def = {
			type:2,    		//1开关指纹，2获取指纹状态
			isopen:true,	//true打开指纹，false关闭指纹
			callback:"getFinger"	//回调函数
		};
		opt = $.extend(def,opt);
		W.SysClientJs.settingTouch(JSON.stringify(opt));
	};
	
	/**
	 * 复制到剪贴板
	 */
	android.clipboard = function(msg){
		W.SysClientJs.copy(msg);
	};
	
	
	/**
	 * 获取联系人信息
	 */
	android.readContacts = function(callback){
		W.SysClientJs.readContacts(callback);
	};
	
	/**
	 * 获取客户端版本号
	 */
	android.getVersion = function(callback){
		W.SysClientJs.getVersion(callback);
	};
	
	android.getVersion("setVersion");
	/**
	 * 首尾遮罩层
	 * @param callback
	 */
	android.openClientPanel = function(obj){
		obj = obj || {};
		var opt = {
				type:"0",
				color:"0,0,0,0.8"   //rgba()
		};
		opt = $.extend(opt,obj);
		W.SysClientJs.getShowWaiting(JSON.stringify(opt));
	};
	
	android.hideClientPanel = function(callback){
		var opt = {
				type:"1",
				color:"0.76,0.76,0.76,0.62"
		};
		W.SysClientJs.getShowWaiting(JSON.stringify(opt));
	};
	
	/**
	 * 透明遮罩层
	 */
	android.openLucencyPanel = function(){
		W.SysClientJs.getClickWebview("0");
	};
	
	android.hideLucencyPanel = function(){
		W.SysClientJs.getClickWebview("1");
	};
	
	/**
	 * 加载完成
	 */
	android.loadFinished = function(){
		try{
			W.SysClientJs.loadFinished();
		}catch(e){
			
		}
	};
	
	/**
	 * 原生通讯录
	 */
	android.getContact = function(callback){
		W.SysClientJs.getContact(callback);
	};
	
	
	/**
	 * 威通身份验证
	 */
	android.wtTdCheck = function(callback){
		W.SysClientJs.NfcIcCard(callback);
	};
	
	/**
	 * 上送HCE登录随机数
	 */
	android.sendHCERandomKey = function(obj){
		W.SysClientJs.openHce(obj);
	};
	
	/**
	 * 跳转e+生活圈app
	 */
	android.toEJSH = function(){
		try{
			W.SysClientJs.toEJSH();
		}catch(e){
			alert(e);
		}
	};
	
	android.scanLogin = function(){
		W.SysClientJs.scanCodeLogin();
	};
	
	/**
	 * 下拉刷新
	 */
	android.dragRefresh = function(opt){
		var def = {
				callback:"",
				type:"0"
		};
		opt = _.extend(def,opt);
		W.SysClientJs.isRefreshWebView(JSON.stringify(opt));
	};
	
	/**
	 * 客户端上传图片
	 */
	android.imageUpdate = function(callback){
		W.SysClientJs.imageUpdate(callback);
	};
	
	/**
	 * 输入交易密码
	 */
	android.setTransPwd = function(type,titleConent,phone,callback){
		var opt = {
				type:type,
				titleConent:titleConent,
				phone:phone,
				callback:callback
		};
		W.SysClientJs.setTransPwd(JSON.stringify(opt));
	};
	
	/**
	 * 隐藏客户端交易密码框
	 */
	android.hideTransDialog = function(result){
		var opt = {
				result:result//成功0;失败1
		};
		W.SysClientJs.hideTransDialog(JSON.stringify(opt));
	};
	
	/**
	 * 隐藏密码键盘
	 */
	android.pwdHide = function(callback){
		W.SysClientJs.stopPassGuardKeyBoard(callback);
	};
	
	/**
	 * 调起浏览器
	 * @param opt
	 */
	android.openBroswer = function(opt){
		var def = {
				url:"",
				callback:""
		};
		opt = $.extend(def,opt);
		W.SysClientJs.loadWebview(JSON.stringify(opt));
	};
	
	android.showSideslipMenu = function(opt){
		W.SysClientJs.showSideslipMenu(JSON.stringify(opt));
	};
	
	android.loadNewWebview = function(opt){
		W.SysClientJs.loadNewWebview(JSON.stringify(opt));
	};
	
	return android;
});