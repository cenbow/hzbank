define(function(require, exports, module) {
    var nativeBroadcast = window.nativeBroadcast = _.extend({}, Backbone.Events);
    
    var App = window.App = new Application();
    App.storage.set("UserInfo", "");
    
    //获取客户单版本号
    window.setVersion = function(v){
    	pubParam.clientVersion = v;
    };
    Client.getVersion("setVersion");
    
    // APP LAYOUT DEFINITION
    // =====================

    App.addRegions({
        container : ".ui-view",
        header : "#header",
        footer : ".footer"
    });
    
    App.container.on("show", function() {
        window.scrollTo(0, 0);
    });
    
    
    
    //SET ROUTER LISTENER
    //====================
    
    App.history.route(/^\s*$/, function() {
        App.navigate(pubParam.index, {
            trigger : true,
            replace : true
        });
    });
    
    Backbone.history.on("beforeRoute", function(){
    	if(	Device.os == 'android'){
    		var opt = {
    				type:"2"
    		};
    		Client.dragRefresh(opt);
    	}
    });
    
    App.start();
    App.history.start();
    
    
    var W = window;
    W.setSession = function(obj){//GET SESSION INFO
    	
    	App.storage.set("UserInfo", obj);
  	  	if(!Utils.getEleCard().cardNo){
			return;
		}
  	  	var sessionInfo = App.storage.get("UserInfo");
  	    var cardStatus = Utils.getEleCard().cardStatus;
		if(!MUI.isEmpty(sessionInfo)&&!MUI.isEmpty(sessionInfo.userType)&&(sessionInfo.userType=='01'||sessionInfo.userType=='02')&&cardStatus && cardStatus=="01"){		
			var param = {
					cardNo : Utils.trim(Utils.getEleCard().cardNo)
			};
			Ajax({url:"/bosera/boseraAssetQuery",data:param,
				success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						App.storage.set("goldSign",data);
	    			}
			}});
		}
    };
    
    //调启App后页面处理
    W.startAppfunc = function(obj){
    	if(obj.indexOf("code")>=0){
			Client.menuOpt("0");
    		App.navigate("userRegister/userRegisterCtl/userRegisterStep1?"+obj);
    	}else{
    		App.navigate("index/index/index");
    	}
    };
    
    //消息推送跳转回调方法
    W.msgPushFunc = function(url){
    	if(url.indexOf("#")>=0){
    		url = url.split("#")[1];
    	}
    	App.navigate(url);
    };
    
    //App调用直销页面
    W.startContact = function(){
		App.navigate("anymore/anymoreCtl/contact");
    }
    
    //fastclick
    FastClick.attach( document.body );
    
    
    //设置密码键盘高度
    Client.setPwdHeight("setHeight");
    window.setHeight = function(h){
    	pubParam.pwdHeight = h;
    };
    
    //为禁止触摸提供阻挡层
    document.getElementById('forbitTouchLayer').addEventListener('touchstart', function(e){
    	ev.preventDefault();
  	    ev.stopPropagation();
  	    return false;
    }, false);
    //sidebar
    /*App.mainView = $('.ui-view');
    Client.alertinfo("sdf");
    App.mainView.on('swipeLeft',function(){
        App.mainView.addClass('hide');
    }).on('swipeRight',function(){
    	App.mainView.removeClass('hide'); 
    }).on('click',function(){
    	App.mainView.removeClass('hide'); 
    })*/
    
  //基金搜索回调函数
    W.fundSearch = function(fundCode){
    	var param = {
				taCode:"00",
				fundName:fundCode,
				fundType:"0",
				fundSellState:"0",
				resultSort:"10",
				turnPageBeginPos:"1",
				turnPageShowNum:"1",
				actionFlag:""
		};
		Ajax({url:"/fund/fundQuery",data:param,success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var icoll = data.iFundInfo;
					 App.navigate("fund/fundCtl/fundDetaill",{iEFundBaseinfo:icoll[0]});
    			}else{
    				Client.alertinfo(data.errorMessage,"提醒");
    			}
    			
		}});
    };
    
    
}); 