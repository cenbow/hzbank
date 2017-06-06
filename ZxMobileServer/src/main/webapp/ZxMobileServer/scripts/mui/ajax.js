define(function(require, exports, module){
	function submitTime(){
		this.submitTimeStamp = new Date().getTime();
		this.refurbish = function(){
			this.submitTimeStamp = new Date().getTime();
		}
	}
	
	var submitTimeObj = new submitTime();
	
	/*
	 * 返回数据处理
	 */
	function checkResultData(data){
		var dataStr = JSON.stringify(data);
		dataStr = dataStr.replace(/"null"/gi,'null');
		data = JSON.parse(dataStr);
		return data;
	}
	
	function transUrl(url) {

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
	window.ajaxArray = {};
	var _ajax = Backbone.ajax;
	var Ajax = module.exports = function(opt){
			var curUrl = opt.url + "|"+Math.random();
			ajaxArray[curUrl] = opt;
		  	//处理data
			var pubData1;
			if(App.storage.get("UserInfo")){
				pubData1 = {
						submitTimestamp:submitTimeObj.submitTimeStamp,
						sessionToken:App.storage.get("UserInfo").appKey
				    };
					$.extend(opt.data,pubData1);
			}
			//opt.data = JSON.stringify(opt.data);
			var _data = opt.data || {};
			
		  	Client.encryptTransData(_data,curUrl,"transDataBack");
		  	
			window.transDataBack = function(transdata,curUrl){
				
				var opt = ajaxArray[curUrl];
				opt.data = transdata;
				
				//备份opt中error和success方法
				var fn = {
					error:function(XMLHttpRequest, textStatus, errorThrown){},
					success:function(data, textStatus){}
				}
				if(opt.error){
					fn.error=opt.error;
				}
				if(opt.success){
					fn.success=opt.success;
				}
				opt.type= opt.type || pubParam.type;
				pubParam.timeout = 30000;
				opt.timeout = opt.timeout || pubParam.timeout;
		
				//处理url
				var url = opt.url;
				if(!url ||!typeof url =='string'|| url.length<1 )return url;
				var urlType= url.substring(url.lastIndexOf('.')+1);
				if(urlType=='do'){
					if(pubParam.isDemo=='0'){
						var urlArr = $.trim(url).split('/');
						var index = urlArr.length -1;
						opt.url = "/"+pubParam.proName+"/data/json/"+urlArr[index]+"."+pubParam.dataType;
					}else{
						opt.url = '/'+pubParam.proName+'/'+url;
						// do nothing
					}
				}else{
					if(pubParam.isDemo=='0'){
						var urlArr = $.trim(url).split('/');
						var urlStr = '';
						$.each(urlArr,function(index,val){
							if(index==0){
								urlStr += val;	
							}else{
								val = val.charAt(0).toUpperCase()+val.substring(1);
								urlStr += val;
							}
						});		
						opt.url = transUrl('data/json/'+urlStr+'.do.json');
					}else{
						opt.url = transUrl('/service'+url);
					}
					// do nothing
				}
				
				//扩展增强处理
				opt.success = function(result, textStatus){
					if(_opt.dataType=='json'){
						result = checkResultData(result);
					}
					var lasthref = location.href.substring(0,location.href.indexOf(pubParam.proName)+pubParam.proName.length+1);
					
					if(result.errorCode && result.errorCode=="100004"){
						
						//登录超时处理
						Client.hideWaitPanel(1);
						Client.logOut("1");//1:只清空缓存
						Utils.checkSession()?Client.alertinfo(result.errorMessage):null;
						cleanSession();
					}else if(result.errorCode && result.errorCode=="100005"){
						//单点登录
						Client.hideWaitPanel(1);
						Client.alertinfo(result.errorMessage);
						Client.logOut("1");//1:只清空缓存
						cleanSession();
					}else{
						fn.success(result, textStatus);
					}
				};
				
				opt.error = function(XMLHttpRequest, textStatus, errorThrown){
					Utils.alertinfo("网络连接异常，请检查网络");
					Client.hideWaitPanel(1);
					fn.error(XMLHttpRequest, textStatus, errorThrown);
				};
				opt.contentType="application/json";
				var _opt = $.extend({
					error:function(XMLHttpRequest, textStatus, errorThrown){
						Utils.alertinfo("网络连接异常，请检查网络");
						Client.hideWaitPanel(1);
						//错误方法增强处理
						fn.error(XMLHttpRequest, textStatus, errorThrown);
					},				
					data:transdata,
					dataType: pubParam.dataType
				},opt);
			  
			  _ajax(_opt);
			};
	  };
	  
	  function cleanSession(){
			var ad = App.storage.get("adList");
			App.storage.clear();
			App.storage.set("adList",ad);	
		};
});
