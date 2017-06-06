/**
* Created by wangjm
* date: 2015-03-20
*/
	/**
	 *	isDemo		0：DEMO，1：not demo
	 *	type		get OR post
	 *	dataType	json OR xml, json is required in this version
	 *	format		JSON OR XML, JSON is required in this version
	 *	timeout		a timeout (in milliseconds) for the request
	 *	proName		real app path for final user
	 *	
	 */

	var pubParam = {
		    isDemo: "1",
		    isTesting:"0",
		    type:"POST",
		    dataType: "json",
		    format: "JSON",
		    proName: "ZxMobileServer",
		    index: "index/index/index",
		    timeout:20000,
		    pwdHeight:"0",
		    clientHeight:"0",
		    clientVersion:"2.0.1",
		    imageCodeKey:"UNCHECK"
	};
	
	/**
	 * Date: 2015-03-19T 8:11Z
	 */

	(function(){
		
		//获取日期
		window.getDate = function (s,t) {
			
			//s Y-m-d H:i:s
			//t new Date()
			t=t || new Date();
			var re=/Y|m|d|H|i|s/g;
			return s.replace(re,function($1) {
				switch($1) {
					case "Y":return t.getFullYear();
					case "m":return t.getMonth()+1;
					case "d":return t.getDate();
					case "H":return t.getHours();
					case "i":return t.getMinutes();
					case "s":return t.getSeconds();
				}
				return $1;
			});
		};
		
		window.setVersion = function(v){
        	pubParam.clientVersion = v;
        };
	        
		//获取设备信息
		window.Device = (function () {
	        var device = {};
	        var ua = navigator.userAgent;
	        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
	        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
	        var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
	        var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
	        window.PHONE = false;
	        device.ios = device.android = device.iphone = device.ipad = false;

	        device.os='web';
	        // Android
	        if (android) {
	        	device.os = 'android';
	            device.android = true;
	        	try{
	        		window.MsgJs.showWaitPanel("");
	        	}catch(e){
	        		device.os = 'web';
		            device.android = false;
	        	}
	        }
	        if (ipad || iphone || ipod) {
	            device.os = 'iphone';
	            device.ios = true;
	        }
	        // iOS
	        if (iphone && !ipod) {
	            device.osVersion = iphone[2].replace(/_/g, '.');
	            device.iphone = true;
	        }
	        if (ipad) {
	            device.osVersion = ipad[2].replace(/_/g, '.');
	            device.ipad = true;
	        }
	        if (ipod) {
	            device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
	            device.iphone = true;
	        }
	        // iOS 8+ changed UA
	        if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
	            if (device.osVersion.split('.')[0] === '10') {
	                device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
	            }
	        }
	        
	        if(device.iphone&&device.android){
	        	PHONE = true;
	        }
	        
	        return device;
	     })();
		
		
	    //获取当前网址，如：http://www.hzbank.com.cn:80/perbank/index.html
	    var curWwwPath = window.document.location.href;
	    
	    //获取主机地址之后的目录，如：perbank/index.html
	    var pathName = window.document.location.pathname;
	    var pos = curWwwPath.indexOf(pathName); 
	    
	    //获取主机地址，如： http://www.hzbank.com.cn:80  
	    var localhostPath = curWwwPath.substring(0,pos);
	    
	    //获取带"/"的项目名，如：/perbank
	    var projectName = pathName.substring(0,pathName.substr(1).indexOf('/')+1); 
	    
	    //获取项目路径
	    window.basePath = localhostPath + projectName;


	})();	
	
	
/**
 *  项目依赖引用的所有javascript文件路径在此配置;
 */
var requireBaseUrl = {
		
		'webapp':'..',
		'version':basePath+'/scripts/conf/version.js?v='+getDate('YmdHis'),
		'zepto' :basePath+'/scripts/libs/zepto/zepto',
		'zepto-extend':basePath+'/scripts/libs/zepto/zepto-extend',
		'jquery.qrcode':basePath+'/scripts/libs/jquery/jquery.qrcode.min',
		'jquery':basePath+'/scripts/libs/jquery/jquery-2.1.3.min',
		'iscroll' :basePath+'/scripts/libs/iscroll/iscroll',
		'text' :basePath+'/scripts/libs/require/require-text-2.0.4',
		'backbone' :basePath+'/scripts/libs/backbone/backbone',
		'marionette' :basePath+'/scripts/libs/backbone/backbone.marionette',
		'template' :basePath+'/scripts/libs/template/template',
		'mui_ns' :basePath+'/scripts/components/mui_ns',
		'underscore' :basePath+'/scripts/libs/backbone/underscore',
		'mui_bridge' :basePath+'/scripts/mui/bridge/'+Device.os,
		'swipeBanner' :basePath+'/scripts/libs/zepto/swipeBanner',
		'touch.min' :basePath+'/scripts/libs/zepto/touch.min',
		
		
		/*echart Theme Modules*/
		'chart' :basePath+'/scripts/libs/chart/Chart.min',
		'echarts' :basePath+'/scripts/libs/echarts-all'
		
        
};


/**非AMD库，使用shim
 * @example :shim{
 * 						 "zepto": {
 *			                           deps: [ "underscore" ],          
 *				                       exports: "Zepto"
 *       				           }
 *               }
 *@param deps 引入所依赖JS    
 *@param exports 外部库，是一个全局的JS对象。
 */
var requireConfigShim = {
		//模板引擎
        'template': {                               
           exports: 'template'
        },
        //ZeptoJs
       'zepto': {                                   
    	   exports: '$'
        },
        
        //zepto扩展 deferred,callbacks,selector
        'zepto-extend': {
            deps: ["zepto"]
        },
        
        //backbone 依赖库
        "underscore": {
           exports: "_"
        },
        //
        "backbone": { 
           deps: ["underscore", "zepto"], 
           exports: "Backbone" 
        },
        "marionette": { 
           deps: ["backbone", "underscore", "zepto"], 
           exports: "Marionette" 
        },
        
        "chart": { 
            exports: "Chart" 
        },
        
        "iscroll": { 
            exports: "iScroll" 
        },
        
        "jquery.qrcode" : {
        	deps: ["zepto-extend"]
        }
    };


//引用外部css加载插件[css.js]
var requireConfigMap = {
		'*':{
			'cssJs':basePath+'/scripts/libs/cssjs/css.js'                
		}
	};




//模块加载的配置
require.config({
	baseUrl: "scripts/",
	map:requireConfigMap,
    paths: requireBaseUrl,
    shim: requireConfigShim,
    waitSeconds: 15,   									//加载等待时长
    urlArgs:function(moduleName, config, url){
    			var versionTotal = versionMap["all"] || "";
				var versionAdd = versionMap[moduleName] || "";
				var version = versionTotal>=versionAdd?versionTotal:versionAdd;
				
    			if(version)
    				return "v="+version;
    			else
    				return false;
    		}
});


require(["version"],function(){
	
	require(["./libs/index"], function(){
	    
	    require(["./mui/index","./components/index","webapp/css/index"], function(lib,comp){
	        _.extend(window, lib);
	        
	        require(["./app/application"]);
	    });
	});
});


