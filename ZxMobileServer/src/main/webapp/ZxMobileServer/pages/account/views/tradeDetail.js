
define(function (require, exports, module) {
	require("../../../scripts/components/swiper");
	
	var TradeDetailTemplate = require("text!../template/tradeDetail.html");
	var TradeDetailItem = require("text!../template/tradeDetailTpl.html");
	
	var TradeDetailView = module.exports = ItemView.extend({
		
        template : TradeDetailTemplate,
        
        events:{
        },
        
        initialize : function(){
        	
        	var ttNav = $('.titNav');
            var allItm = ttNav.find('.all');
            var allItems = ttNav.find('.itm');
            allItems.on('click', function(){
                allItems.removeClass('active');
                $(this).addClass('active');
            })
          new  Swiper({
              container: document.getElementById('slider'),
              item: '.item',
              observer: false,
              autoplay: false,
              onSwiped: function(i){
                i == 0 ? 
                ttNav.addClass('nxtArr') && allItm.removeClass('departLine') :
                ttNav.removeClass('nxtArr') && allItm.addClass('departLine') 
              },
              during: 3000
            });
        	
        	
        	var pageTest = {
    			  	title:'交易明细',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				},
    				rightButton:{
    					name : ''
    				}
    			  };
    		Client.initPageTitle(pageTest);
    		
    		var setHeight = (document.documentElement.clientHeight || window.innerHeight) -160; //需要占满屏幕高度所需高度
    		document.querySelector('#noData').style.height = setHeight+ 'px';
    		
    		var $this = this;
    		$("#all,#jub,#add,#gold,#fund,#save,#cash,#red,#cun").on('tap',function(){
    			var tab = $(this).attr("data-target");
				$('.tab .active').removeClass('active');
				$(this).addClass('active');
				$('.cnt').hide();
				$('#list-tab'+tab).show();
				Client.openWaitPanel("拼命加载中，请稍候");
				var param=$this.getParam(1,"0",tab-1);
				$this.tarPageId = $('.tab .active').attr('data-target');
				$this.queryTradeDetail(param,"tab"+tab);
			});
    		
    		var code = "";
    		if(App.storage.get("_parameters")){
    			 code=App.storage.get("_parameters").code;
    		}
    		
    		if(code=="happyAdd"){
    			$("#add").trigger("tap");
    		}else if(code=="happySave"){
    			$("#save").trigger("tap");
    		}else if(code=="cun"){
    			$("#cun").trigger("tap");
    		}else{
    			$("#all").trigger("tap");
    		}
    		
    		this.initDrag();
    		        },

        
        goBack : function(){
    		App.back();
    	},
    	
        queryTradeDetail : function(param,choice){
        	var $this = this;
        	var ul = $('#list-'+choice);
//        	alert(param);
//        	var ul = $('#wrapper');
    		Ajax({url:"/myCount/listDetail",data:param,
    		success:function(data){
    			Client.hideWaitPanel(1);
				if(MUI.isEmpty(data.errorCode)){
    				var icol=data.cd;
    				icol.pageFlag = param.pageFlag;
					var html = _.template(TradeDetailItem, icol);
					if(param.pageFlag == "1"){
						ul.append(html);
					}else{
						ul.html(html);
					}
					if(ul.find('.list-item').length>=icol.turnPageTotalNum){
						$this.mysc.dragLoad = false;
						$(".pullUp").hide();
					}else{
						$this.mysc.dragLoad = true;
						$(".pullUp").show();
					}
					
					if(data.cd.turnPageTotalNum=="0"){
						$this.mysc.dragLoad = false;
						$("#wrapper").hide();
						$('#noData').show();
					}else{
						$('#noData').hide();
						$("#wrapper").show();
						$this.mysc.dragLoad = true;
					}
					$this.mysc.refresh();	//DOM 加载结束后必须调用
					ul.attr("total",icol.turnPageTotalNum);
    			}else{
    				Utils.alertinfo(data.errorMessage);
    				if(param.pageFlag != "1"){
						$("#wrapper").hide();
						$('#noData').show();
					}
    			}
    		}});
    	},
    	
    	getParam : function(pos,flag,num){
    		var param={};
    		var cardNo=this.getEleCard().cardNo;
    		param.cardNo=cardNo;
    		param.accountNo=this.getAccountNo(cardNo);
    		param.accountType="00";
    		param.sessionToken=App.storage.get("UserInfo").appKey;
    		param.turnPageBeginPos=pos;
    		param.turnPageShowNum="9";
    		param.pageFlag=flag;
    		param.beginDate1=Utils.getDifferentDate(-90,'yyyyMMdd');
    		param.endDate1=Utils.getDifferentDate(0,'yyyyMMdd');
    		param.queryType=num;
    		param.totalInAmtValue="";
    		param.totalOutAmtValue="";
    		return param;
    	},
    	
    	getEleCard : function(){
			var cardCategory = "";
			var cardSeries = "";
			var cardNo = "";
			var accountType = "";
			var iCardInfo  = App.storage.get("UserInfo").iCardInfo;
			for(var len=0;len<iCardInfo.length;len++){
				cardCategory = iCardInfo[len].cardCategory;
				cardSeries = iCardInfo[len].cardSeries;
				if("03" == accountType )continue;
				val = cardCategory + cardSeries;
				if(val=="9901"||val=="9902"){
					cardNo = iCardInfo[len].cardNo;
					accountType = iCardInfo[len].accountType;
				}
			}
			return {cardNo:cardNo,accountType:accountType};
		},
		
		initDrag : function(){
		    
		    /*********************调用滚动插件**************************/
			
			var el = document.querySelector('#wrapper');

			el.style.height = pubParam.clientHeight - 41 + 'px';
			document.getElementById('noData').style.height= pubParam.clientHeight - 41 + 'px';
			this.tarPageId = $('.tab .active').attr('data-target');
			var $this = this;
			this.mysc = MUI.loadRefresh(el, {
				dragRefresh : false,
				loadCallback : function(){
		    	   var pos = $('#list-tab'+$this.tarPageId).find('.list-item').length+1;
		    	   if(pos <= $('#list-tab'+$this.tarPageId).attr("total")){
						 param=$this.getParam(pos,"1",$this.tarPageId-1);
						 $this.queryTradeDetail(param,"tab"+$this.tarPageId);
		    	   }
		   	    }
		    });

		    /***********************************************/
		},
		getAccountNo : function(lastRequestCardNo){
			var lastRequestAccount ="";
			var cardNo;
			var accountNo;
			var accountFlag;
			var iAccountInfo  = App.storage.get("UserInfo").iAccountInfo;
			for(var len=0;len<iAccountInfo.length;len++){
				accountNo = iAccountInfo[len].session_accountNo;
				cardNo = iAccountInfo[len].cardNo;
				accountFlag = iAccountInfo[len].accountFlag;
				if(cardNo==lastRequestCardNo&&accountFlag=="00"){
					lastRequestAccount = accountNo;
					continue;
				}
			}
			return lastRequestAccount;
		}
		
	});
});