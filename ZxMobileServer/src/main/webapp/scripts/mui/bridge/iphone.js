define(function(require, exports, module){
	
	var W = window;
	W._WK_DATAS = [];
	
	/*---------------------------------事件队列start----------------------------------*/
	W._mevents = new Array();
	W.setWebitEvent = function(evtName, evtCode) {
		if (evtName == "") {
			return;
		}
		_mevents.push(JSON.stringify({
			code : evtCode,
			name : evtName
		}));
	};	
	W.getWebkitEventCode = function() {
		return _mevents.length > 0 ? _mevents.shift() : "0";
	};
	W.getWebkitEvent = function() {
		return "";
	};
	/*---------------------------------事件队列end----------------------------------*/
	
	
	/*---------------------------------密码键盘----------------------------------*/
	W._isShowMuiKeyBoard = false;
	
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
	
	W._WK_DATAS["pwdPick"] = {
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
		confirm : '',  //确认密码原密码序列  不确认传空
		height : 0
	};
	W._getPwdPicker = function() {
		_isShowMuiKeyBoard = false;

		return JSON.stringify(_WK_DATAS["pwdPick"]);
	};
	// 密码回调方法
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
	/*-------------------------------------------------------------------*/	
	
	
	
	//IPHONE 操作方法
	var iphone = {};
	
	/**
	 * 开启等待层
	 */
	iphone.openWaitPanel = function(cfg) {
		_WK_DATAS["wait"] = cfg;
		setWebitEvent('showWaitPanel()', '04');
	};
	
	/**
	 * 关闭等待层
	 */
	iphone.hideWaitPanel = function() {
		setWebitEvent('closeWaitPanel()', '04');
	};
	
	W._WK_DATAS["wait"] = "{'msg':'','callback':'','touchable':'false'}";
	
	W.showWaitPanel = function() {
		return JSON.stringify(_WK_DATAS["wait"]);
	};
	W.closeWaitPanel = function() {
		_WK_DATAS["wait"] = "{}";
	};
	
	/**
	 * 弹出信息
	 * 
	 * @example : <br>
	 * 
	 */
	iphone.alertinfo = function(msg, title, funcOk,tow_btn,funkCancel) {
		if (!funcOk) {
			funcOk = "Client.hideWaitPanel";
	    }
		var cfg = {
			title : title || "系统提示",
			msg : msg,
			two_btn : tow_btn?"true":"false",
			ok_text : tow_btn?"取消":"",
			ok_func : funkCancel,
			cancel_text : "确定",
			cancel_func : funcOk
		};
		_WK_DATAS["alert"] = JSON.stringify(cfg);
		setWebitEvent("getAlertInfo()", "05");
	};
	
	W._WK_DATAS["alert"] = {
		'title' : '温馨提示',
		'msg' : '测试信息'
	};
	
	W.getAlertInfo = function() {
		return _WK_DATAS["alert"];
	};
	
	/**
	 * 返回系统首页
	 */
	iphone.gotoHomePage = function() {
		setWebitEvent("{'name':''}", "01");
	}, 
	
	/**
	 * 显示安全键盘
	 */
	iphone.showPwdPicker = function(obj) {
		try {
			if (_isShowMuiKeyBoard)
				return;
			_isShowMuiKeyBoard = true;
			
			var ele = obj.elem;
			var EN = obj.type;
			var key= obj.randomKey;
			var value = obj.randomValue;
			var callback = obj.callback;

			this._preShowKeyBoard(ele);
			
			var cfg = _WK_DATAS["pwdPick"];
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
			cfg.confirm = obj.confirm;
			var flag = jqObj.attr("pwd-type");
			_WK_DATAS["pwdPick"] = cfg;
			
			/*
			 * 密码键盘事件 1001
			 */
			setWebitEvent('_getPwdPicker()',(flag == "2" ? '1001' : '1001'));
		} catch (e) {
			alert("showPwdPicker:" + e);
		}
	};
	
	
	//创建密码键盘DIV并设置相关高度
	iphone._preShowKeyBoard = function(ele) {
		// return;
		var a = document.body;
		a = a ? a : document.documentElement;
		var h = Utils.position(ele);
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
	 * 客户端事件码：1014
	 */
	iphone.pwdConfirm = function(func) {
		setWebitEvent(func, '1014');
	};
	
	/**
	 * 初始化页标题栏
	 */
	iphone.initPageTitle = function(obj) {
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
		obj = $.extend(pageStep,obj);
        setWebitEvent(obj,"02");
	};
	
	/**
	 * 弹出提示条
	 */
	iphone.alertTips = function(obj){
		
	  setWebitEvent(obj,"07");
	};

	/**
	 * 选取日期
	 */
	iphone.pickDateTime = function(obj) {
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
		setWebitEvent(JSON.stringify(cfg), '08');
	};
	
	W._WK_DATAS["datePick"] = {
		text : '',
		format : 'yyyy-MM-dd',
		min : '1920-01-01',
		max : '2030-12-31',
		callback : 'getPickDate'
	};
	
	W.getPickDate = function(txt){
		var cfg = _WK_DATAS["datePick"];
		$("#"+cfg.id).val(txt);
	};
	 
	
	/**
	 * 登录
	 * 客户端事件码：1003
	 */
	iphone.toLogin = function(callback){
		setWebitEvent(callback,'1003');
	}
	
	/**
	 * ajax加密data参数
	 * @param data,callback
	 * 客户端事件码：1004
	 */
	iphone.encryptTransData = function(data,url,callback){
		var opt={};
		opt.data = data;
		opt.callback = callback;
		opt.url = url;
		
		setWebitEvent(JSON.stringify(opt), '1004');
	}
	
	
	/**
	 * 版本更新
	 * 客户端事件码：1005
	 */
	iphone.updateVersion = function(callback){
		setWebitEvent(callback,'1005');
	}
	
	/**
	 * 退出登录
	 * 客户端事件码：1006
	 */
	iphone.logOut = function(callback){
		setWebitEvent(callback,'1006');
	}
	
	/**
	 * 分享
	 * 客户端事件码：1008
	 */
	iphone.share = function(opt){
		if(!opt.type){
			opt.type = "";
		}
		if(!opt.imageUrl||opt.imageUrl == ""){
			opt.imageUrl = "images/logoico.png";
		}
		setWebitEvent(MUI.JsonToStr(opt),'1008');
	}
	/**
	 * 分享朋友圈
	 * 客户端事件码：1033
	 */
	iphone.sharePYQ = function(opt){
		if(!opt.type){
			opt.type = "";
		}
		if(!opt.imageUrl||opt.imageUrl == ""){
			opt.imageUrl = "images/logoico.png";
		}
		setWebitEvent(MUI.JsonToStr(opt),'1033');
	}
	/**
	 * 通知重载随机数
	 * 客户端事件码：1009
	 */
	iphone.loadPwdKey = function(){
		setWebitEvent("pwdKey",'1009');
	}
	
	/**
	 * 手势密码
	 * 客户端事件码：1010
	 */
	
	W._WK_DATAS["handPwd"] = {
		type:3,    		//1开关手势，2设置手势，3获取手势状态
		isopen:true,	//true打开手势，false关闭手势
		callback:"App.getHandPwd"	//回调函数
	};
	
	W._getHandPwd = function() {
		return MUI.JsonToStr(_WK_DATAS["handPwd"]);
	};
		
	iphone.handPwd = function(opt){
		_WK_DATAS["handPwd"] = opt;
		setWebitEvent("_getHandPwd()",'1010');
	}
	
	
	/**
	 * 关注我们
	 * 客户端事件码：1011
	 */
	iphone.attention = function(){
		setWebitEvent("attention",'1011');
	}
	
	/**
	 * 加载完成
	 * 客户端事件码：1012
	 */
	iphone.loadFinished = function(){
		setWebitEvent("done",'1012');
	}
	
	/**
	 * 呼叫号码
	 */
	iphone.callPhone = function(num){
		setWebitEvent(num,'1013');
	};
	
	/**
	 * 底栏控制
	 */
	iphone.menuOpt = function(opt){
		setWebitEvent(opt,'1015');
	};
	
	/**
	 * 设置客户端用户信息
	 */
	iphone.setClientInfo = function(opt){
		var optstr = JSON.stringify(opt);
		setWebitEvent(optstr,'1016');
	};
	
	/**
	 * 设置密码键盘高度
	 */
	iphone.setPwdHeight = function(callback){
		setWebitEvent(callback,'1017');
	};
	
	/**
	 * 复制到剪贴板
	 */
	iphone.clipboard = function(msg){
		setWebitEvent(msg,'1018');
	};
	
	/**
	 * 更换头像
	 * @param callback
	 */
	iphone.uploadPhoto = function(callback){
		setWebitEvent(callback,'1019');
	};
	
	
	/**
	 * 指纹操作
	 * @param callback
	 */
	W._WK_DATAS["finger"] = {
		type:2,    		//1开关指纹，2获取指纹状态
		isopen:true,	//true打开指纹，false关闭指纹
		callback:"getFinger"	//回调函数
	};
	
	W._getFinger = function() {
		return JSON.stringify(_WK_DATAS["finger"]);
	};
		
	iphone.setFinger = function(opt){
		_WK_DATAS["finger"] = opt;
		setWebitEvent("_getFinger()",'1020');
	};
	
	
	/**
	 * Ocr识别身份证
	 */
	iphone.ocrCheck = function(callback){
		setWebitEvent(callback,'HZB100');
	};
	
	/**
	 *人脸识别
	 */
	iphone.facePlusCheck = function(data,callback){
		if(data){
			data.callback = callback;
			setWebitEvent(JSON.stringify(data),'HZB101');
		}else{
			Utils.alertinfo("身份证信息为空");
		}
	};
	
	/**
	 * Ocr识别银行卡
	 */
	iphone.ocrBankCard = function(callback){
		setWebitEvent(callback,'HZB104');
	};
	
	/**
	 * 获取联系人信息
	 */
	iphone.readContacts = function(callback){
		setWebitEvent(callback,'1021');
	};
	
	
	/**
	 * 获取位置信息
	 * @param callback
	 */
	iphone.getLocationInfo = function(callback){
		setWebitEvent(callback,'1022');
	};
	
	/**
	 * 获取客户端版本号
	 * @param callback
	 */
	iphone.getVersion = function(callback){
		setWebitEvent(callback,'1023');
	};
	
	/**
	 * 首尾遮罩层
	 * @param callback
	 */
	iphone.openClientPanel = function(obj){
		obj = obj || {};
		var opt = {
				type:"0",
				color:"0,0,0,0.8"   //rgba()
		};
		opt = $.extend(opt,obj);
		setWebitEvent(JSON.stringify(opt),'1024');
	};
	
	iphone.hideClientPanel = function(callback){
		var opt = {
				type:"1",
				color:"0.76,0.76,0.76,0.62"
		};
		setWebitEvent(JSON.stringify(opt),'1024');
	};
	
	/**
	 * 透明遮罩层
	 */
	iphone.openLucencyPanel = function(){
		setWebitEvent("0",'1025');
	};
	
	iphone.hideLucencyPanel = function(){
		setWebitEvent("1",'1025');
	};
	
	/**
	 * 跳转e+生活圈app
	 */
	iphone.toEJSH = function(){
		setWebitEvent('toEJSH','1026');
	};
	
	/**
	 * 扫码登录
	 */
	iphone.scanLogin = function(){
		setWebitEvent('1','1027');
	};
	
	/**
	 * 下拉刷新
	 */
	iphone.dragRefresh = function(opt){
		var def = {
				callback:"",
				type:"0"
		};
		opt = _.extend(def,opt);
		setWebitEvent(opt,'1028');
	};
	
	/**
	 * 图片上传
	 * @param callback
	 */
	iphone.imageUpdate = function(callback){
		setWebitEvent(callback,'1029');
	};
	
	/**
	 * 输入交易密码
	 * @param callback
	 */
	iphone.setTransPwd = function(type,titleConent,phone,callback){
		var opt = {
				type:type,//1:交易密码；2：验证码
				titleConent:titleConent,
				phone:phone,
				callback:callback
		};
		setWebitEvent(JSON.stringify(opt),'1030');
	};
	
	/**
	 * 隐藏密码键盘
	 * @param callback
	 */
	iphone.pwdHide = function(callback){
		var opt = {
				callback:callback
		};
		setWebitEvent(JSON.stringify(opt),'1031');
	};
	
	/**
	 * 调起浏览器
	 * @param opt
	 */
	iphone.openBroswer = function(opt){
		var def = {
				url:"",
				callback:""
		};
		opt = $.extend(def,opt);
		setWebitEvent(JSON.stringify(opt),'1034');
	};
	
	/**
	 * 隐藏客户端交易密码框
	 */
	iphone.hideTransDialog = function(result){
		var opt = {
				result:result//成功0;失败1
		};
		setWebitEvent(JSON.stringify(opt),'1032');
	};
	
	iphone.showSideslipMenu = function(opt){
		setWebitEvent(JSON.stringify(opt),'HZB106');
	};
	
	iphone.loadNewWebview = function(opt){
		setWebitEvent(JSON.stringify(opt),'HZB106');
	};
	
	module.exports = iphone;
	
});