define(function (require, exports, module) {
	
	var scoreDetailTemplate = require("text!../template/scoreDetail.html");
	var scoreDetailTplTemplate = require("text!../template/scoreDetailTpl.html");
	
	var ScoreDetailView = module.exports = ItemView.extend({
		
        template : scoreDetailTemplate,
        
        events:{
        },
        
        initialize : function(){
        	
        	//初始化菜单方法
        	var pageStep = {
        		  title:'积分明细',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		},
        		rightButton:{
        			name : '帮助',
        			func : 'curView.help()' 
        		}
        	};
        	
        	Client.initPageTitle(pageStep);
        	this.pageBeginPos = 1;
        	this.pageShowNum = 10;
        	
        	//查询积分明细
        	this.queryScoreDetail("0");
        	
        	this.initDrag();
        	
        	var setHeight = (document.documentElement.clientHeight || window.innerHeight) -170; //需要占满屏幕高度所需高度
    		document.querySelector('#noData').style.height = setHeight+ 'px';
        },
        
        queryScoreDetail : function(drag){
        	
        	var param = this.getParam();
        	var $this = this;
    		Ajax({url:"/userSetting/queryScoreDetail", data:param, success:function(data){
    			var ul = $("#scoreDetail");
    			
    			var turnPageTotalNum = data.turnPageTotalNum;
    			ul.attr("total",turnPageTotalNum);
    			
    			var html = _.template(scoreDetailTplTemplate, data);
    			if(drag=="1"){
    				ul.append(html);
    			}else
    				ul.html(html);
    			
    			if(turnPageTotalNum<=ul.find('li').length){
    				$this.mysc.dragLoad = false;
					$(".pullUp").hide();
    			}
    			
    			if(turnPageTotalNum=="0"){
					$this.mysc.dragLoad = false;
					$("#wrapper").hide();
					$('#noData').show();
				}else{
					$('#noData').hide();
					$("#wrapper").show();
					$this.mysc.dragLoad = true;
				}
    			Client.hideWaitPanel(1);
    			$this.mysc.refresh();//DOM 加载结束后必须调用
    		}});    
        },
        
        
        getParam : function() {
        	
        	var subTime = "";
        	var score = "";
//        	var beginDate = Utils.getDifferentDate(-60,'yyyyMMdd');
//        	var endDate = Utils.getDifferentDate(0,'yyyyMMdd');
        	var beginDate = "";
        	var endDate = "";
//        	var turnPageBeginPos = '1';
        	
        	var param = {};
        	param.turnPageBeginPos=this.pageBeginPos;
    		param.turnPageShowNum=this.pageShowNum;
    		param.beginDate=beginDate;
    		param.endDate=endDate;
    		param.queryType=""; 
    		
    		return param;
        },        
        
     	initDrag : function(){
     		/*********************调用滚动插件**************************/
			
			var el = document.querySelector('#wrapper');
			el.style.height = pubParam.clientHeight - 10 + 'px';
			var $this = this;
			this.mysc = MUI.loadRefresh(el, {
				dragRefresh : false,
				loadCallback : function(){
					if($("#scoreDetail li").length>=$("#scoreDetail").attr("total")){
	 	 				return false;
	 	 			}
	  		    	$this.pageBeginPos = $this.pageBeginPos + $this.pageShowNum;
	 	 			$this.queryScoreDetail("1");
		   	    }
		    });

		    /***********************************************/
     	},
     	
        goBack : function(url){
    		App.back();
    	},
    	  
    	help : function(){
    		App.navigate("anymore/anymoreCtl/messageCenter");
    	},
    	
	});
	
     
 	
});