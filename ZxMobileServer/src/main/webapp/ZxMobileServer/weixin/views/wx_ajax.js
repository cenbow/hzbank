(function(win,doc){
	
	/*
	 * 返回数据处理
	 */
	function checkResultData(data){
		var dataStr = JSON.stringify(data);
		dataStr = dataStr.replace(/"null"/gi,'null');
		data = JSON.parse(dataStr);
		return data;
	}
	
	var ajax = function(opt){
		
		  	//data扩展
			var _data = opt.data || {};
			
			var pubData = {
					//公共报文扩展
					
			    };
			$.extend(_data,pubData);
			opt.data = JSON.stringify(_data);
			
			//备份opt中error和success方法
			var fn = {
				error:function(XMLHttpRequest, textStatus, errorThrown){},
				success:function(data, textStatus){}
			};
			
			if(opt.error){
				fn.error=opt.error;
			}
			if(opt.success){
				fn.success=opt.success;
			}
	
			//处理url
			var url = opt.url;
			if(!url ||!typeof url =='string'|| url.length<1 )
				return url;
			//此处可做url统一处理
			opt.url = url;
			
			//扩展增强处理
			opt.success = function(result, textStatus){
				if(_opt.dataType=='json'){
					result = checkResultData(result);
				}
				
				if(result.errorCode && result.errorCode=="100004"){
					//统一错误处理（如登陆超时）
					
				}else{
					fn.success(result, textStatus);
				}
			};
			
			opt.error=function(XMLHttpRequest, textStatus, errorThrown){
				
				Utils.alertinfo("网络连接异常，请检查网络");
				
				//错误方法增强处理
				fn.error(XMLHttpRequest, textStatus, errorThrown);
			};
			
			var _opt = $.extend({
				dataType: "json",
				contentType:"application/json",
				type:"POST",
				timeout:20000
			},opt);
		  
		  $.ajax(_opt);
	  };
	  
	  win.ajax = ajax;
})(window,document);
