/*
*	MUI1.0 JS   核心框架类mui.js(依赖zepto.js,模板template.js)
*	Version	:	1.0.0
*	Author	:	@WANGJM
*/

define(['zepto','template','mui_ns'],function ($,template,NS) {

	var TAG = "MUI";
	var ID = 1;
    
	var MUI = M = {
		version : '1.0.0',
		$ : window.Zepto||window.jQuery,
		Debug : true,
		idSeed : 10000,
		//参数设置
		settings : {
	        //控制日志输出级别
			LOG_LEVEL : 1,			
		},
		//日志级别定义
		logLevel : {
			ERROR : 4,
			WARN  : 3,
			INFO  : 2,
			DEBUG : 1,
			LEVELS : ['UNKNOWN', 'DEBUG', 'INFO', 'WARN', 'ERROR'],
		},
		//MUI NS
		NS : NS,
		//手机或者PC iphone android web
		os : Device.os,
	};
	
	//前端框架全局命名空间 "MUI"
	if (window.MUI == undefined) {
		window.MUI = $.MUI = MUI;
	};

	
	/**
	 * 定义命名空间
	 */
	MUI.namespace = function (ns) {
		if(!ns || !ns.length) {
			return null;
		}
		var levels = ns.split(".");
		var nsobj = MUI;
		//MUI is implied, so it is ignored if it is included
		
		for (var i = (levels[0] == "MUI") ? 1 : 0; i < levels.length; ++i) {
			nsobj[levels[i]] = nsobj[levels[i]] || {};
			nsobj = nsobj[levels[i]];
		}
		return nsobj;
	};
	/**
	 * 返回ID
	 * 
	 * @param {Object}
	 *            v
	 */
	
	MUI.id = function () {
		return 'mui-gen-' + (++MUI.idSeed);
	};
	
	MUI.getGUID = function () {
		var guid = "";
		for (var i = 1; i <= 32; i++){
			var n = Math.floor(Math.random()*16.0).toString(16);
			guid += n;
			if((i==8)||(i==12)||(i==16)||(i==20))
				guid += "-";
		}
		return guid;
	};
	/**
	 * 日志输出
	 * 
	 * @param tag 标志
	 * @param level 级别
	 * @param message 信息
	 * @param exception 错误信息
	 * @param stacktrace 错误堆
	 */
	MUI.log = function(tag, level, message, exception, stacktrace) {
		var currentTime = new Date().toISOString();
		var showMessage = currentTime + '\t ' + MUI.logLevel.LEVELS[level] + '\t'+tag + '\t' + "----"+message+"----";
		if (level >= MUI.settings.LOG_LEVEL) {
			var written = false;
			try {
				var con = window.console;
				if (con) {
					if (level == MUI.logLevel.ERROR && con.error)
						con.error(showMessage);
					else
						con.log(showMessage);
					if (exception)
						con.exception(exception);
					if (stacktrace && con.trace)
						con.trace();
					written = true;
				} else if (window.opera && window.opera.postError) {
					window.opera.postError(showMessage);
					written = true;
				}
			} catch (ex) { /* ignore */ }
		}
		
		/*输出日志到页面
		if (!written) {
			console.log("heaallo"+showMessage);
			var debug = document.getElementById("dwr-debug");
			if (debug) {
				var contents = showMessage + "<br/>" + debug.innerHTML;
				if (contents.length > 2048) contents = contents.substring(0, 2048);
				debug.innerHTML = contents;
			}
		}
        */ 
	};
	
	MUI.pload = function() {
		var func = window['_getParameter'];
		if (func && func("pload") == "true") {
			MUI.log(TAG,"****代码预加载成功****");
			return true;
		}
		return false;
	};
	/**
	 * 属性复制（同jQuery的$.extend）
	 * 
	 * @param {}
	 *            object
	 * @param {}
	 *            config
	 * @param {}
	 *            defaults
	 */
	MUI.apply = function(object, config, defaults) {
		if (defaults) {
			MUI.apply(object, defaults);
		}
		if (object && config && MUI.isObject(config)) {
			for ( var property in config) {
				object[property] = config[property];
			}
		}
		return object;
	};
	/**
	 * 属性复制（仅复制object中不存在的属性）
	 * 
	 * @param {}
	 *            object
	 * @param {}
	 *            config
	 */
	MUI.applyIf = function(object, config) {
		if (object) {
			for ( var p in config) {
				if (!MUI.isDefined(object[p])) {
					object[p] = config[p];
				}
			}
		}
		return object;
	};
	/**
	 * 继承
	 */
	MUI.extend = function() {
		var objectConstructor = Object.prototype.constructor, inlineOverrides = function(
				o) {
			for ( var m in o) {
				if (!o.hasOwnProperty(m)) {
					continue;
				}
				this[m] = o[m];
			}
		};
		return function(subclass, superclass, overrides) {
			if (MUI.isObject(superclass)) {
				overrides = superclass;
				superclass = subclass;
				subclass = overrides.constructor !== objectConstructor ? overrides.constructor
						: function() {
							superclass.apply(this, arguments);
						};
			}
			if (!superclass) {
				return null;
			}
			//
			var F = function() {
			};
			var subclassProto, superclassProto = superclass.prototype;
			F.prototype = superclassProto;
			subclassProto = subclass.prototype = new F();
			subclassProto.constructor = subclass;
			subclass.superclass = superclassProto;
			if (superclassProto.constructor === objectConstructor) {
				superclassProto.constructor = superclass;
			}
			subclass.override = function(overrides) {
				MUI.override(subclass, overrides);
			};
			subclassProto.override = inlineOverrides;
			subclassProto.proto = subclassProto;
			subclass.override(overrides);
			subclass.extend = function(o) {
				return MUI.extend(subclass, o);
			};
			return subclass;
		};
	}();
	/**
	 * 覆盖
	 * 
	 * @param {}
	 *            cls
	 * @param {}
	 *            overrides
	 */
	MUI.override = function(cls, overrides) {
		MUI.apply(cls.prototype, overrides);
	};
	
	
	/**
	 * 获取路径
	 * 
	 * @param {}
	 *            v
	 * @return {}
	 */
	MUI.transUrl = function (url) {

	    if (url.indexOf('/') != 0) {
	        url = '/' + url;
	    }

	    //在首页main.htm.js中会设置isMainFrame的值
	    var projectName = pubParam.proName;
	    var loc = window.location.href;
	    var i = loc.indexOf('/' + projectName);
	    if(i<0){
	    	url = loc.substring(0,loc.indexOf('/html'))+url;
	    }else{
	    	url = loc.substring(0, i + projectName.length + 1) + url;
	    }
	    
	    return url;
	};
	/**
	 * 是否已定义
	 * 
	 * @param {}
	 *            v
	 */
	MUI.isDefined = function(v) {
		return typeof v !== 'undefined';
	};		
	/**
	 * 是否为空
	 * 
	 * @param {}
	 *            v
	 * @param {}
	 *            allowBlank
	 */
	MUI.isEmpty = function(v, allowBlank) {
		return v === null || v === undefined
				|| String(v).toUpperCase() === 'NULL'
				|| ((MUI.isArray(v) && !v.length))
				|| (!allowBlank ? v === '' : false);
	};
	/**
	 * 是否是数组
	 * 
	 * @param {}
	 *            v
	 */
	MUI.isArray = function(v) {
		return MUI.toString(v) === '[object Array]';
	};
	/**
	 * 是否是日期
	 * 
	 * @param {}
	 *            v
	 */
	MUI.isDate = function(v) {
		return MUI.toString(v) === '[object Date]';
	};
	/**
	 * 是否是对象
	 * 
	 * @param {}
	 *            v
	 */
	MUI.isObject = function(v) {
		return !!v && MUI.toString(v) === '[object Object]';
	};
	/**
	 * 是否是函数
	 * 
	 * @param {}
	 *            v
	 */
	MUI.isFunction = function(v) {
		return MUI.toString(v) === '[object Function]';
	};
	/**
	 * 是否是数值型
	 * 
	 * @param {}
	 *            v
	 */
	MUI.isNumber = function(v) {
		return typeof v === 'number' && isFinite(v);
	};
	/**
	 * 是否是字符型
	 * 
	 * @param {}
	 *            v
	 */
	MUI.isString = function(v) {
		return typeof v === 'string';
	};
	/**
	 * 是否是布尔型
	 * 
	 * @param {}
	 *            v
	 */
	MUI.isBoolean = function(v) {
		return typeof v === 'boolean';
	};
	/**
	 * 是否是原始类型
	 * 
	 * @param {}
	 *            v
	 */
	MUI.isPrimitive = function(v) {
		return MUI.isString(v) || MUI.isNumber(v) || MUI.isBoolean(v);
	};
	/**
	 * 是否可迭代
	 * 
	 * @param {}
	 *            v
	 */
	MUI.isIterable = function(v) {
		return (v && typeof v !== 'string') ? MUI.isDefined(v.length) : false;
	},			
	/**
	 * 是否是URL
	 * 
	 * @param {}
	 *            v
	 * @return {}
	 */
	MUI.isUrl = function(v) {
		return /(((^https?)|(^ftp)):\/\/((([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*)|(localhost|LOCALHOST|127.0.0.1))\/?)/i
				.test(v);
	},	
	/**
	 * 页面跳转
	 * 
	 * @param {}
	 *            url
	 * @param {}
	 *            params
	 */
	MUI.redirect = function(url, params) {
		var search = document.location.search;
		if (!MUI.isEmpty(search)) {
			search = search.replace(/(&?)t=[^&]+/g, '');
			search = search.replace(/(&?)parameters=[^&]+/g, '');
			url += search === '?' ? '' : search;
		}
		url += (url.indexOf('?') > 0 ? '&' : '?') + 't=' + new Date().getTime();
		if (!MUI.isEmpty(params)) {
			MUI.sessionCache.save("_parameters", params);
		}
		document.location.href = url;
	};
	
	/**
	 * 返回parameters参数 特指页面跳转间传递的参数
	 */
	MUI.getParameters = function() {
		var params = {}; 
		
		if(!MUI.isEmpty(MUI.sessionCache.get("_parameters"))){
			params = MUI.sessionCache.get("_parameters").data;
		}
		
		return params;
	};
	/**
	 * 遍历数组
	 * 
	 * @param {}
	 *            value
	 * @param {}
	 *            fn
	 * @param {}
	 *            scope
	 */
	MUI.each = function(value, fn, scope) {
		if (MUI.isEmpty(value)) {
			return;
		}
		if (!MUI.isDefined(scope)) {
			scope = value;
		}
		if (MUI.isObject(value)) {
			var i = 0;
			for ( var prop in value) {
				if (value.hasOwnProperty(prop)) {
					if (fn.call(scope || value, prop, value[prop], i++, value) === false) {
						return;
					}
				}
			}
		} else {
			if (!MUI.isIterable(value) || MUI.isPrimitive(value)) {
				value = [ value ];
			}
			for (var i = 0, len = value.length; i < len; i++) {
				if (fn.call(scope || value[i], value[i], i, value) === false) {
					return i;
				}
			}
		}
	};		
	
	
	MUI.JsonToStr = function(json) {
		return JSON.stringify(json);
	};
	
	MUI.JsonEval = function(str) {
		return eval("(" + str + ")");
	};

	MUI.ajaxData = function(url, params, success, failure) {
		success = MUI.getFunctionName(success);
		failure = MUI.getFunctionName(failure);
		
		MUI.Client.post(url, params, success, failure);
	};
	
	MUI.parseEvt = function(evt) {
		if (MUI.os === 'web') {
			evtMap = {
				touchstart : 'mousedown',
				touchend : 'mouseup'
			};
			return evtMap[evt] ? evtMap[evt] : evt;
		}
		return evt;
	};
	
    /**
     * 开启等待层
     * @param msg 消息
     */
	MUI.openWaitPanel = function(msg) {
		
		MUI.Client.openWaitPanel(msg);
	};
    /**
     * 关闭等待层
     * @param timeout
     */
	MUI.hideWaitPanel = function(timeout) {
		MUI.Client.hideWaitPanel(timeout);
	};
    /**
     * 显示时间选择插件
     * @param obj
     */
	MUI.showDatePicker = function(obj) {
		MUI.Client.showDatePicker(obj);
	};
    /**
     * 返回系统首页
     * @param obj
     */
	MUI.gotoHomePage = function(url) {
		MUI.Client.gotoHomePage(url);
	};	
	
	   /**
     * 弹出信息
     * @param msg 消息内容
     * @param title 标题
     * @param okAct ok button 事件
     */
	MUI.alertinfo = function(msg, title, okAct, okName) {
		MUI.log(TAG,"----alertinfo start----");
		
		okAct = MUI.getFunctionName(okAct);
		MUI.Client.alertinfo(msg, title, okAct, okName);
	};
	// 确认信息
	MUI.confirm = function(msg, title, okAct, cancleAct , okName , cancleName) {
		
		okAct = MUI.getFunctionName(okAct);
		cancleAct = MUI.getFunctionName(cancleAct);
		MUI.Client.confirm(msg, title, okAct, cancleAct , okName , cancleName);
	};
	// 弹出窗体
	MUI.showWindow = function(url, title, width, height) {
		MUI.Window.openWindow(url, title, width, height);
	};
	
	MUI.closeWindow = function() {
		MUI.Window.hideWindow();
	};
	
	MUI.showPageArea = function(showHandle, hideHandles, showTitle) {
		if (hideHandles) {
			MUI.each(hideHandles, function(item) {
				$(item).hide();
			});
		}
		$(showHandle).show();
		var initTitle = MUI.Client.initPageTitle;
		//showTitle && initTitle && initTitle(showHandle);
		//不知为何,安卓手机此函数无法调用,故改成下面这种方式
		if(showTitle === true){
			MUI.Client.initPageTitle(showHandle);
		}
	};
	
	MUI.showPopupWindow = function(cfg){
		MUI.Client.showPopupWindow(cfg);
	};
	
	MUI.changCss = function(addHandles, delHandles, css) {
		MUI.log(TAG,"----changCSS load----" + css);
		if (delHandles) {
			delHandles.removeClass(css);
		}
		if (addHandles)
			addHandles.addClass(css);
	};
	
	MUI.showMoneyPicker = function(obj){
		MUI.Client.showMoneyPicker(obj);
	};
	
	MUI.showDatePicker = function(obj){
		MUI.Client.showDatePicker(obj);
	};
	// 显示密码键盘
	MUI.showPwdPicker = function(obj){
		MUI.Client.showPwdPicker(obj);
	};
	
	MUI.removeDivId = function(divId) {
		var handle = document.getElementById(divId);
		if (handle) {
			handle.parentNode.removeChild(handle);
		}
	};
	
	/**
	 * 加载静态资源文件（js、css、img）
	 * @param urls 资源文件url列表
	 * @param callback 加载成功回调函数
	 */
	MUI.loadResoruces = function(urls, callback) {
		consloe.log(TAG,"----loadResoruces start----");
		if(MUI.isString(urls)){
			urls = [urls];
		}
		
		callback = MUI.getFunctionName(callback, true);
		MUI.Client.loadResoruces(urls, callback);
	};
	
	/**
	 * 加载css
	 * @param css 内容
	 */
	MUI.loadCss =  function() {
		var style,head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;
		style = document.createElement( "style" );
		head.appendChild(style);
		
		MUI.each(arguments, function(css) {
			$(style).append(decodeURIComponent(css).replace(/\+/g, ' '));
		});
	};
	
	MUI.dataUrl = function(url) {
		url = (url.indexOf("/") == 0) ? url : ("/" + url);
		if (MUI.Debug) {
			return basePath + "/data/json" + url + ".js?t=" + new Date().getTime();
		} else {
			return basePath + url + ".do";
		}
	};
	
	/*
	MUI.pageVersion = function(vers) {
		seajs.config({
			map : [ [ /^(.*\.(?:css|js))(?:.*)$/i,//
			'$1?v=' + (vers || '') ] ]
		});
	};
	*/
	
	MUI.formatUrl = function(s) {
		return s + (s.indexOf('?') > 0 ? '&t=' : '?t=') + new Date().getTime();
	};
	
	MUI.sessAccts = function(callback) {
		MUI.log(TAG,"----sessAccts start----");
		var sess = sessionStorage;
		var accts = sess.getItem("SESS_ACCTS");
		if (accts) {
			var rst = MUI.JsonEval(accts);
			callback && callback({
				LIST : rst
			});
			MUI.log(TAG,"----sessAccts stp1---" + accts);
		} else {
			MUI.log(TAG,"----sessAccts stp2---");
			var url = MUI.dataUrl("accListQuery");
			MUI.log(TAG,"----sessAccts stp3---");
			 MUI.ajaxData(url, {}, function(rst) {
				if (rst && rst.LIST) {
					sess.setItem("SESS_ACCTS", MUI.JsonToStr(rst.LIST));
					MUI.log("Accs save success ");
					callback && callback({
						LIST : rst.LIST
					});
				}
				MUI.log(TAG,"----sessAccts stp4--");
			});
		}
	};
	/**
	 * 根据函数获取函数名称
	 */
	MUI.getFunctionName = function(func, decodeURL) {
		if(Object.prototype.toString.apply(func) !== '[object Function]'){
			return func;
		}
		
		var funcName = 'func' + (++ID);
	    // 创建可被调用的临时方法
	    window[funcName] = function() {
	    	var args = new Array();
    		MUI.each(arguments, function(arg){
    			if(true == decodeURL){
    				arg = decodeURIComponent(arg);
    			}
    			if('{' == arg.charAt(0) && '}' == arg.charAt(arg.length - 1)){
    				arg = MUI.JsonEval(arg);
    			}
    			
    			args.push(arg);
    		}, this);
	    	func.apply(this, args);
	    	
	    	delete window[funcName];//删除临时方法
	    }; 
	    
	    return funcName;
	};
	/**
	 * 模板解析
	 */
	MUI.templet = function() {
		
		var args = arguments;
		var tpl = args[0];
		
		var render = template.compile(args[0]);
		var html = render(args[1]);
		return html;
		
	};
	
	//-----------------------------------------------------
	/**
	 * 初始化页面组件元素
	 */
	MUI.Element = (function($){
	    var SELECTOR  = {
	        'icon' : '[data-icon]',
	        'scroll' : '[data-scroll="true"]',
	        'toggle' : '.toggle',
	        'range' : '[data-rangeinput]',
	        'progress' : '[data-progress]',
	        'count' : '[data-count]',
	        'checkbox' : '[data-checkbox]'
	    }
	    /**
	     * 初始化容器内组件
	     * @param {String} 父元素的css选择器
	     * @param {Object} 父元素或者父元素的zepto实例
	     */
	    var init = function(selector){
	        if(!selector){
	            //iscroll 必须在元素可见的情况下才能初始化
	            $(document).on('articleshow','article',function(){
	                J.Element.initScroll(this);
	            });
	        };
	        var $el = $(selector || 'body');
	        if($el.length == 0)return;

	        $.map(_getMatchElements($el,SELECTOR.icon),_init_icon);
	        $.map(_getMatchElements($el,SELECTOR.toggle),_init_toggle);
	        $.map(_getMatchElements($el,SELECTOR.range),_init_range);
	        $.map(_getMatchElements($el,SELECTOR.progress),_init_progress);
	        $.map(_getMatchElements($el,SELECTOR.count),_init_badge);
	        $.map(_getMatchElements($el,SELECTOR.checkbox),_init_checkbox);
	    }
	    /**
	     * 自身与子集相结合
	     */
	    var _getMatchElements = function($el,selector){
	        return $el.find(selector).add($el.filter(selector));
	    }
	    /**
	     * 初始化iscroll组件或容器内iscroll组件
	     */
	    var initScroll = function(selector){
	        $.map(_getMatchElements($(selector),SELECTOR.scroll),function(el){J.Scroll(el);});
	    }
	    /**
	     * 构造icon组件
	     */
	    var _init_icon = function(el){
	        var $el = $(el),$icon=$el.children('i.icon'),icon = $el.data('icon');
	        if($icon.length > 0){//已经初始化，就更新icon
	            $icon.attr('class','icon '+icon);
	        }else{
	            $el.prepend('<i class="icon '+icon+'"></i>');
	        }

	    }
	    /**
	     * 构造toggle切换组件
	     */
	    var _init_toggle = function(el){
	        var $el = $(el),$input;
	        if($el.find('div.toggle-handle').length>0){//已经初始化
	            return;
	        }
	        var name = $el.attr('name');
	        //添加隐藏域，方便获取值
	        if(name){
	            $el.append('<input style="display: none;" name="'+name+'" value="'+$el.hasClass('active')+'"/>');
	        }
	        $el.append('<div class="toggle-handle"></div>');
	        $input = $el.find('input');
	        $el.tap(function(){
	            var value;
	            if($el.hasClass('active')){
	                $el.removeClass('active');
	                value = false;
	            }else{
	                $el.addClass('active');
	                value = true;
	            }
	            $input.val(value);
	            //自定义事件：toggle
	            $el.trigger('toggle');
	        })
	    }
	    /**
	     * 构造range滑块组件
	     */
	    var _init_range = function(el){
	        var $el = $(el),$input;
	        var $range = $('input[type="range"]',el);
	        var align = $el.data('rangeinput');
	        var input = $('<input type="text" name="test" value="'+$range.val()+'"/>');
	        if(align == 'left'){
	            $input = input.prependTo($el);
	        }else{
	            $input = input.appendTo($el);
	        }
	        var max = parseInt($range.attr('max'),10);
	        var min = parseInt($range.attr('min'),10);
	        $range.change(function(){
	            $input.val($range.val());
	        });
	        $input.on('input',function(){
	            var value = parseInt($input.val(),10);
	            value = value>max?max:(value<min?min:value);
	            $range.val(value);
	            $input.val(value);
	        })
	    }
	    /**
	     * 构造progress组件
	     */
	    var _init_progress = function(el){
	        var $el = $(el),$bar;
	        var progress = parseFloat($el.data('progress'))+'%';
	        var title = $el.data('title') || '';
	        $bar = $el.find('div.bar');
	        if($bar.length == 0){
	            $bar = $('<div class="bar"></div>').appendTo($el);
	        }
	        $bar.width(progress).text(title+progress);
	        if(progress == '100%'){
	            $bar.css('border-radius','10px');
	        }
	    }
	    /**
	     * 构造count组件
	     */
	    var _init_badge = function(el){
	        var $el = $(el),$count;
	        var count = parseInt($el.data('count'));
	        var orient = $el.data('orient');
	        var className = (orient == 'left')?'left':'';
	        var $markup = $('<span class="count '+className+'">'+count+'</span>');
	        $count = $el.find('span.count');
	        if($count.length>0){
	            $count.text(count);//更新数字
	        }else{
	            $count = $markup.appendTo($el);
	        }
	        if(count == 0){
	            $count.hide();
	        }
	    }

	    var _init_checkbox = function(el){
	        var $el = $(el);
	        var value = $el.data('checkbox');
	        if($el.find('i.icon').length>0){
	            return;
	        }
	        $el.prepend('<i class="icon checkbox-'+value+'"></i>');
	        $el.on('tap',function(){
	            var status = ($el.data('checkbox') == 'checked') ? 'unchecked':'checked';
	            $el.find('i.icon').attr('class','icon checkbox-'+status);
	            $el.data('checkbox',status);
	            //自定义change事件
	            $el.trigger('change');
	        });

	    }

	    return {
	        init : init,
	        initIcon : _init_icon,
	        initToggle : _init_toggle,
	        initProgress : _init_progress,
	        initRange : _init_range,
	        initBadge : _init_badge,
	        initScroll : initScroll
	    }
	})(M.$);	
	
	
	/**
	 * 提供一些简单的模板，及artTemplate的渲染
	 */
	MUI.Template = (function($){
	    /**
	     * 背景模板
	     * @param el  selector
	     * @param title  显示文本
	     * @param icon   图标
	     */
	    var background = function(el,title,icon){
	        var markup = '<div class="back-mask"><div class="icon '+icon+'"></div><div>'+title+'</div></div>';
	        $(el).html(markup);
	    }

	    /**
	     * 无记录背景模板
	     * @param el
	     */
	    var no_result = function(el){
	        background(el,'没有找到相关数据','drawer');
	    }
	    /**
	     * 加载等待背景模板
	     * @param el
	     */
	    var loading = function(el){
	        background(el,'加载中...','cloud-download');
	    }

	    /**
	     * 借助artTemplate模板来渲染页面
	     * @param containerSelector 目标容器
	     * @param templateId  artTemplate模板ID 可选 以后扩展
	     * @param templateSource artTemplate模板内容
	     * @param data 模板数据
	     * @param type replace|add 渲染好的文档片段是替换还是添加到目标容器中
	     */
	    var render = function(containerSelector,templateId,data,type){
	        var el =  $(containerSelector);
	        type = type || 'replace';//replace  add
	        if($.type(data) == 'array' && data.length == 0 ){
	            no_result(el);
	        }else{
	            //var html = $(template(templateId,data));
	        	var render = template.compile(templateId);
	        	var html = render(data);
	            if(type == 'replace'){
	                el.html(html);
	            }else{
	                el.append(html);
	            }
	           MUI.Element.init(html);
	        }
	    };
	    
	    
	    return {
	        render : render,
	        background : background,
	        loading : loading,
	        no_result : no_result
	    };
	})(M.$);
	
	
	/**
	 * 数据缓存 Cache localStorage
	 * todo  对数据进行加密
	 */
	MUI.Cache = (function($){
	    var UNPOST_KEY = '_M_P_',
	        GET_KEY_PREFIX = '_M_';
	
	    /**
	     * 缓存从服务端获取的数据
	     * @param key
	     * @param value
	     */
	    var save = function(key,value){
	        var data = {
	            data : value,
	            cacheTime : new Date()
	        }
	        window.localStorage.setItem(GET_KEY_PREFIX+key,JSON.stringify(data));
	    }
	    /**
	     * 获取本地已缓存的数据
	     */
	    var get = function(key){
	        return JSON.parse(window.localStorage.getItem(GET_KEY_PREFIX+key));
	    }
	
	    /**
	     * 缓存本地待提交到服务端的数据(离线操作)
	     * @param url
	     * @param result
	     */
	    var savePost = function(url,result){
	        var data = getPost();
	        data = data || {};
	        data[url] = {
	            data : result,
	            createdTime : new Date()
	        }
	        window.localStorage.setItem(UNPOST_KEY,JSON.stringify(data));
	    }
	
	    /**
	     *  获取本地尚未提交到服务端的缓存数据
	     * @param url  没有就返回所有未同步的数据
	     */
	    var getPost = function(url){
	        var data = JSON.parse(window.localStorage.getItem(UNPOST_KEY));
	        return (data && url ) ? data[url] : data;
	    }
	    /**
	     * 移除未提交的待提交到服务端的缓存数据
	     * @param url 没有就移除所有未提交的数据
	     */
	    var removePost = function(url){
	        if(url){
	            var data = getPost();
	            delete data[url];
	            window.localStorage.setItem(UNPOST_KEY,JSON.stringify(data));
	        }else{
	            window.localStorage.removeItem(UNPOST_KEY);
	        }
	    }
	    /**
	     * 同步本地未提交的数据到服务端
	     * * @param url 没有就同步所有未提交的数据
	     */
	    var syncPost = function(url,success,error){
	        var dataLen,index = 0;
	        if($.type(url) == 'string'){
	            dataLen = 1;
	            sync(url);
	        }else{
	            var postData = getPost();
	            if(!postData)return;
	            dataLen = postData.length;
	            for(var url in postData){
	                sync(url);
	            }
	        }
	        function sync(url){
	            var data = getPost(url).data;
	            $.ajax({
	                url : url,
	                contentType:'application/json',
	                data : data,
	                type : 'post',
	                success : function(){
	                    index++;
	                    removePost(url);
	                    if(index == dataLen)success(url);
	                },
	                error : function(){
	                    error(url);
	                }
	            })
	        }
	    }
	
	    /**
	     * 清空本地缓存
	     */
	    var clear = function(){
	        var storage = window.localStorage;
	        for(var key in storage){
	            if(key.indexOf(GET_KEY_PREFIX) == 0){
	                storage.removeItem(key);
	            }
	        }
	        storage.removeItem(UNPOST_KEY);
	    }
	
	
	    return {
	        get : get,
	        save : save,
	        getPost : getPost,
	        savePost : savePost,
	        removePost : removePost,
	        syncPost : syncPost,
	        clear : clear
	    }
	
	}
			
    )(M.$);
   
	/**
	 * 数据缓存 sessionCache
	 * todo  对数据进行加密
	 */	
	
	MUI.sessionCache = (function($){
	    var UNPOST_KEY = '_MS_P_',
        GET_KEY_PREFIX = '_MS_';

    /**
     * 缓存从服务端获取的数据
     * @param key
     * @param value
     */
    var save = function(key,value){
        var data = {
            data : value,
            cacheTime : new Date()
        }
        window.sessionStorage.setItem(GET_KEY_PREFIX+key,JSON.stringify(data));
    }
    /**
     * 获取本地已缓存的数据
     */
    var get = function(key){
        return JSON.parse(window.sessionStorage.getItem(GET_KEY_PREFIX+key));
    }

    /**
     * 缓存本地待提交到服务端的数据(离线操作)
     * @param url
     * @param result
     */
    var savePost = function(url,result){
        var data = getPost();
        data = data || {};
        data[url] = {
            data : result,
            createdTime : new Date()
        }
        window.sessionStorage.setItem(UNPOST_KEY,JSON.stringify(data));
    }

    /**
     *  获取本地尚未提交到服务端的缓存数据
     * @param url  没有就返回所有未同步的数据
     */
    var getPost = function(url){
        var data = JSON.parse(window.sessionStorage.getItem(UNPOST_KEY));
        return (data && url ) ? data[url] : data;
    }
    /**
     * 移除未提交的待提交到服务端的缓存数据
     * @param url 没有就移除所有未提交的数据
     */
    var removePost = function(url){
        if(url){
            var data = getPost();
            delete data[url];
            window.sessionStorage.setItem(UNPOST_KEY,JSON.stringify(data));
        }else{
            window.sessionStorage.removeItem(UNPOST_KEY);
        }
    }
    /**
     * 同步本地未提交的数据到服务端
     * * @param url 没有就同步所有未提交的数据
     */
    var syncPost = function(url,success,error){
        var dataLen,index = 0;
        if($.type(url) == 'string'){
            dataLen = 1;
            sync(url);
        }else{
            var postData = getPost();
            if(!postData)return;
            dataLen = postData.length;
            for(var url in postData){
                sync(url);
            }
        }
        function sync(url){
            var data = getPost(url).data;
            $.ajax({
                url : url,
                contentType:'application/json',
                data : data,
                type : 'post',
                success : function(){
                    index++;
                    removePost(url);
                    if(index == dataLen)success(url);
                },
                error : function(){
                    error(url);
                }
            })
        }
    }

    /**
     * 清空本地缓存
     */
    var clear = function(){
        var storage = window.sessionStorage;
        for(var key in storage){
            if(key.indexOf(GET_KEY_PREFIX) == 0){
                storage.removeItem(key);
            }
        }
        storage.removeItem(UNPOST_KEY);
    }


    return {
        get : get,
        save : save,
        getPost : getPost,
        savePost : savePost,
        removePost : removePost,
        syncPost : syncPost,
        clear : clear
      }

    }
    )(M.$)
	
    /**
	 * 返回session参数
	 */
	MUI.getSessionInfo = function() {
		var r = MUI.sessionCache.get("sessionInfo");
		if(r)
			return MUI.sessionCache.get("sessionInfo").data;
		else
			return false;
	};
	
	/*
	;(function($){
		
		$.extend(MUI,{});
		
	})(Zepto);

	
	;(function ($) {})(Zepto);	
	
    
    */
	
	return MUI;
});
