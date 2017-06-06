define(function(require,module,exports){
	var webos = {};
    var TAG = "MUI.web";
	window.EVT = {
			TOUCH_START : "mousedown",
			TOUCH_END : "mouseup",
			TOUCH_MOVE: "scroll"
		};
	
	function confTitleButton(cfg) {
		if (cfg && cfg.length == 3) {
			return {
				exist : cfg[0],
				name  : cfg[1],
				func  : cfg[2]
			};
		}
		return {
			exist : false
		};
	};
	
	function confPageTitle(obj) {
		var page = $(pageId);
		var cfg = {
			title : page.attr("title")
		};
		var leftCfg = page.attr("data-leftButton").split("|");
		cfg.leftButton = confTitleButton(leftCfg);
		var rightCfg = page.attr("data-rightButton").split("|");
		cfg.rightButton = confTitleButton(rightCfg);
		return cfg;
	};	
	
	/**
	 * 开启等待层
	 */
	webos.openWaitPanel = function(msg) {
		MUI.log(TAG,"----openWaitPanel----");
		MUI.Layer.openWaitPanel(msg);
	};


	/**
	 * 关闭等待层
	 */
	webos.hideWaitPanel = function(timeout) {
		/*MUI.log(TAG,"----hideWaitPanel----");
		MUI.Layer.hideWaitPanel(timeout);*/
	};
	/**
	 * 弹出信息
	 * 
	 * @example : <br>
	 * 
	 */
	webos.alertinfo = function(msg, title, okAct) {
		MUI.log(TAG,"----alertinfo callback----");
		MUI.MsgBox.hideMsgBox();
		MUI.MsgBox.alertinfo(msg, title, function() {
			MUI.log(TAG,okAct, TAG);
			if (okAct) {
				eval("(" + okAct + "())");
			} else {
				MUI.MsgBox.hideMsgBox();
			}
		});
	};
	
	webos.confirm = function(msg, title, okAct, cancleAct, okName, cancleName) {
		MUI.log(TAG,"----confirm----");
		MUI.MsgBox.hideMsgBox();
		MUI.MsgBox.confirm(msg, title, function() {
			MUI.log(TAG,"----MsgBox.confirm----");
			okAct && eval("(" + okAct + ")");
			//MUI.MsgBox.hideMsgBox(); 执行后关闭窗口
		}, function() {
			MUI.log(TAG,"----MsgBox.confirm stp2----", TAG);
			if (cancleAct) {
				eval("(" + cancleAct + ")");
				//MUI.MsgBox.hideMsgBox(); 执行后关闭窗口
			} else {
				MUI.MsgBox.hideMsgBox();
			}
		},okName,cancleName);
	};
	/**
	 * 弹出菜单层
	 */
	webos.showPopupWindow = function(cfg){
		var me = this;
		var tpl = 
			'<div style="z-index: 1100;display: inline-block;position: absolute;' +
				'padding: 0;outline: 0;max-width: 1336px; top: 2%; left: 4%;">' +
				'<div style="min-width: 22em;border-width: 1px;border-style: solid;' +
					'background-color: #fff;border-color: #ddd;color: #333;text-shadow: 0 1px 0 #f3f3f3;' +
					'position: relative;box-shadow: 0 0 12px rgba(0,0,0,.6);">' +
					'<ul style="list-style: none;display: block;">' +
						'{@each data as item}' +
							'<li style="border: 1px solid #ddd;line-height:50px;text-align:center;">' +
								'<a href="javascript:${item.func}(' +
									'{@each item.params as param}' +
										'\'${param}\',' +
									'{@/each}' +
								'\'\')" style="font-size: 16px;padding: .5em 3em;' +
								'display: block;position: relative;text-align: center;text-overflow: ellipsis;' +
								'overflow: hidden;white-space: nowrap;">${item.name}</a>' +
							'</li>' +
					    '{@/each}' +
						'<li style="border: 1px solid #ddd;line-height:50px;text-align:center;background-color:red;">' +
							'<a href="javascript:MUI.Client._hidePopupWindow();" style="font-size: 16px;' +
							'padding: .5em 3em;display: block;position: relative;text-align: center;text-overflow: ellipsis;' +
							'overflow: hidden;white-space: nowrap;">取   消</a>' +
						'</li>' +
					'</ul>' +
				'</div>' +
			'</div>';
		tpl = MUI.template(tpl);
		$("#popupwindow").html(tpl.render({
			data: cfg
		}));
		$("#popupwindow").show();
	};
	
	webos._hidePopupWindow = function(){
		$("#popupwindow").hide();
	};
	
	/**
	 * 初始化标题
	 */
	webos.initPageTitle = function(obj) {
		/*MUI.log(TAG,"----initPageTitle----");
		//var conf = confPageTitle(pageId);
		MUI.Titlebar.change(obj);*/
	};
	
	/*弹出提示条*/
	webos.alertTips = function(obj){
	  MUI.tips.create(obj);
	}
	/**
	 * 返回系统首页
	 */
	webos.gotoHomePage = function(url) {
	  MUI.redirect(url);
	};
	/**
	 * 九宫格页面
	 */
	webos.gotoIndexPage = function() {

	};
	/**
	 * 登录成功后跳转到欢迎页
	 */
	webos.gotoWelcomePage = function() {

	};
	/**
	 * 显示日期键盘
	 * 
	 * @param obj
	 * @example <br>
	 *          &lt;input type="text" id="startDate" data-min="" data-max=""
	 *          data-startId="" data-endId="" readOnly
	 *          onclick="MUI.Client.showDatePicker(this)"&gt; <br>
	 */
	webos.showDatePicker = function(obj) {
		var handle = $(obj);
		if (handle.attr("data-init")=="true")
			return;
		handle.attr("data-init","true");
		handle.val("2014-01-01").attr("type", "date").on("click", null);
		handle.attr("pattern", "yyyy-MM-dd");
		handle.attr("readOnly", null).attr("readonly", null);
	},
	/**
	 * 显示安全键盘
	 * 
	 * @example <br>
	 *          &gt;input type="password" id="password" data-maxlength=""
	 *          data-minlength="" data-kind="" （键盘模式）
	 *          onclick="MUI.Client.showPwdPicker(this)"&gt; <br>
	 */
	webos.showPwdPicker = function(obj) {
		var handle = $(obj);
		if (handle.attr("data-init")=="true")
			return;
		handle.attr("data-init","true");
		handle.attr("type", "password").on("click", null);
		handle.attr("readOnly", null).attr("readonly", null);
	};
	/**
	 * 显示金额键盘
	 * 
	 * @param obj
	 */
	webos.showMoneyPicker = function(obj) {
		var handle = $(obj);
		if (handle.attr("data-init")=="true")
			return;
		handle.attr("data-init", "true").on("click", null);
		handle.attr("readOnly", null).attr("readonly", null);
	};
	/**
	 * 加密数据
	 * 
	 * @param obj
	 */
	webos.encryptTransData = function(obj) {
	};
	/**
	 * 服务端超时
	 */
	webos.sessionTimeOut = function() {
	};
	/**
	 * 显示联系人
	 */
	webos.showContactPerson = function(num, typename, func) {
	};
	
	/**
	 * 选取日期
	 */
	webos.pickDateTime = function(func) {

	};
	
	
	/**
	 * 打开附件
	 */
	webos.openAttach = function(url, title, mm) {
	};
	
	webos.post = function(url, params, success, failure) {
		new MUI.TransAjax().loadData({
			url : url,
			params : params, 
			success : function(rpdata){
				eval(success + '(\'' + MUI.JsonToStr(rpdata) + '\')');
			},
			failure : function() {
				eval(failure + '()');
			}
		});
	};
	
	/**
	 * 加载静态资源文件（js、css、img）
	 * @param urls 资源文件url列表
	 * @param callback 加载成功回调函数
	 */
	webos.loadResoruces = function(urls, callback) {
		if(!MUI.isArray(urls) || urls.length == 0) {
			return;
		}
		
		var count = 1, index = 1, img = [];
		var head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;
		
		var func = function() {
			if(urls.length == 0){
				return;
			}
			
			url = basePath + "/" + urls.shift();
			MUI.log(TAG,"loadSrc url: " + url);
			
			var src = null;
			if(url.indexOf('.js') != -1){
				src = document.createElement( "script" );
				src.type = 'text/javascript';
				src.src = url;
			} else if(url.indexOf('.css') != -1){
				src = document.createElement( "link" );
				src.type = 'text/css';
				src.rel = 'stylesheet';
				src.href = url;
			} else {
				img.push(encodeURIComponent(url));
				func();
				return;
			}
			
			count++;
			src.onload = src.onreadystatechange = function(){
				if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
					index++;
					func();
					
					if(count == index){
						eval(callback + ".apply(this, img)");
					}
				}
			};
			head.appendChild(src);
		};
		//func();
		
		/*$.get(url, function(){
			eval(callback + '()');
		});*/
	};
	
	
	webos.menuOpt = function(opt){
		
	};
	
	webos.setPwdHeight = function(opt){
		
	};
	
	return webos;

});
