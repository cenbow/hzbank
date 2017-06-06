define(function(require, exports, module){
	var drawlotteryTpl = require("text!../template/drawIndex.html");
	
	var drawlotteryView = module.exports = ItemView.extend({
		
		events : {
			"click #myPrize" : "lotteryCenter",
			"click #ruleBtn" : "showRule",
			"click #toFund" : "toFund",
			"click #toDeposit" : "toDeposit",
			"click #toDesign" : "toDesign",
			"click .doBtn" : "drawLottery"
			
		},
		
		template : drawlotteryTpl,
		
		initialize : function(){
			//初始化菜单方法
			var pageTest = {
				  	title:'幸运抽奖',
					leftButton:{
						name : '返回',
						func : 'curView.toIndex()'
					},
					rightButton:{
						name : ''
					}
				  };
			Client.initPageTitle(pageTest);
			this.init();
		},
		
		init : function(){
			var awardRotate = $('#awardRotate');
			var awardRule = $('#awardRule');
			var initPage = function() {
				var clientHeight = document.documentElement.clientHeight;
				var clientWidth = document.documentElement.clientWidth;
				awardRotate.css({
					height : clientHeight + 'px',
					fontSize : clientWidth + 'px'
				});
				awardRule.css({
					height : clientHeight + 'px'
				});
			};
			$(window).on('resize', initPage);
			initPage();
			// 检查活动有效性
			var drawActivityInfo = App.storage.get("drawActivityInfo");
			if (!drawActivityInfo)
				this.checkDrawActivity();
			else {
				this.initActivity(drawActivityInfo);
			}
		},
		initActivity : function(drawActivityInfo){
			var $this = this;
			$(".activityTime").html(drawActivityInfo.activityTime);
			if(drawActivityInfo.isLater){
				$this.showLater();
			}
			$this.qryHideWait();
		},
		checkDrawActivity : function(){
			var $this = this;
        	var param={
        			actId:'A000002',
        			sactId:'B000000'
        	};
        	var isLater=false,activityTime='';
        	Ajax({url:"/draw/checkDrawActivity",data:param,
				success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var beginDate=MUI.isEmpty(data.beginDate)?"20170420":data.beginDate;
					var endDate=MUI.isEmpty(data.endDate)?"20170630":data.endDate;
//					var activityTime=Utils.formatDate(beginDate, "yyyyMMdd", "yyyy年MM月dd日")+"-"+Utils.formatDate(endDate, "yyyyMMdd", "yyyy年MM月dd日");
					activityTime=$this.formatDate(beginDate)+"-"+$this.formatDate(endDate);
					$(".activityTime").html(activityTime);
					isLater=false;
				}else{
					$this.showLater();
					isLater=true;
//					Utils.alertinfo(data.errorMessage);
				}
				 App.storage.set("drawActivityInfo",{isLater:isLater,activityTime:activityTime});
				$this.qryHideWait();
			},error:function(){
				$this.showLater();
				$this.qryHideWait();
			}});
		},
		formatDate : function(date){
			var year=parseInt(date.substring(0,4));
			var month=parseInt(date.substring(4,6));
			var day=parseInt(date.substring(6));
			return year+"年"+month+"月"+day+"日";
		},
		showLater : function(){
			$('#later').removeClass('hide');
		},
		drawLottery : function(){
			if(Utils.checkSession()){
				if(Utils.checkRealUser()){
					if(!Utils.checkActivate()){
						return;
					}
					App.navigate("draw/drawCtl/drawLottery");
				}
			}else{
				Client.toLogin("curView.drawLottery()");
			}
		},
		lotteryCenter : function(){
			if(Utils.checkSession()){
				if(Utils.checkRealUser()){
					if(!Utils.checkActivate()){
						return;
					}
					var $this = this;
				    var param={
								actionFlag:'1'
				        	};
		        	Client.openWaitPanel("拼命加载中，请稍候");
		        	Ajax({url:"/draw/queryUserDrawResult",data:param,
						success:function(data){
		    			if(MUI.isEmpty(data.errorCode)){
		    				var cd = data.drawResultList;
							if(!MUI.isEmpty(cd)){
			    				$this.drawResultList = cd;
			    				App.navigate("draw/drawCtl/lotteryCenter",{drawResultList:$this.drawResultList});
						     }else{
						    	 App.navigate("draw/drawCtl/lotteryCenter",{drawResultList:[]});
						     }
		    			
						}else{
							Utils.alertinfo(data.errorMessage);
						}
		    			Client.hideWaitPanel(1);
					},error:function(){
						Client.hideWaitPanel(1);
					}});
				}
			}else{
				Client.toLogin("curView.lotteryCenter()");
			}
		},
		showRule : function(){
			var pageTest = {
    			  	title:'活动细则',
    				leftButton:{
    					name : '返回',
    					func :'curView.gotoDrawIndex()'
    				}
    			  };
    		Client.initPageTitle(pageTest);
    		$('#awardRotate').addClass('hide');
    		$('#awardRule').removeClass('hide');
			
		},
		gotoDrawIndex : function(){
        	var pageTest = {
    			  	title:'幸运抽奖',
    				leftButton:{
    					name : '返回',
    					func :'curView.toIndex()'
    				}
    			  };
    		Client.initPageTitle(pageTest);
    		$('#awardRotate').removeClass('hide');
    		$('#awardRule').addClass('hide');
		},
    	toIndex : function(){
    		Client.menuOpt("1");
			App.navigate("index/index/index");
    	},		
    	toFund : function(){
    		App.navigate("fund/fundCtl/fundIndex");
    	},		
    	toDeposit : function(){
    		var isLogon = Utils.checkSession();
			if(!isLogon){   
				App.navigate("deposit/depositCtl/deposit");
			 }else{
				if(!Utils.checkActivate()){
					return;
				}
				App.navigate("deposit/depositCtl/depositLoad");
			}
    	},		
    	toDesign : function(){
    		var url;
    		if (Utils.checkSession()) {
    			url="/design/productQueryByPageAjaxSession";
			}else{
				url="/design/productQueryByPageAjax";
			}
			Client.openWaitPanel("拼命加载中，请稍候");
        	Ajax({url:url,data:{}, 
    			success:function(data){
    				if(data.errorCode){
    					Utils.alertinfo(data.errorMessage);
        	    		Client.hideWaitPanel(1);
    				}else{
    					var depositHome = data.designabilityInfo;    
    					App.storage.set("depositHome",depositHome);
    		    		Client.menuOpt("2"); 
    					App.navigate("design/designCtl/depositHome");
    				}
    			}
        	});
    	},	
    	goBack : function(){
			App.back();
  	    },
    	qryHideWait: function(){
				
			Client.hideWaitPanel(100);
			Client.hideLucencyPanel();
			
			this.opt ? null : this.opt = {
					callback:"curView.refresh()"
			};
//			Client.dragRefresh(this.opt);
			
		},
		refresh : function(){
			Client.openLucencyPanel();
			this.qryHideWait();
    	}
	
	});
});
