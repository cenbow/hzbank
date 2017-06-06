define(function (require, exports, module) {
	
	var fundOptionalTemplate = require("text!../template/fundOptional.html");
	
	var FundOptionalView = module.exports = ItemView.extend({
		
		template : fundOptionalTemplate,
		
		events:{
		},
		
		initialize : function(){
			var $this  = this;
			var sortParam1="0";//净值
			var sortParam2="1";//涨幅
			var sortType1="1";//正序
			var sortType2="0"; //倒序
			
			var pageStep1 = {
        		title:'自选基金',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		},
        		rightButton:{
//        			name : pubParam.clientVersion>"3.0.7"?'fundSearch':'',
        			name :'管理',
					func : 'curView.management()'
				}
        		
        	};
        	
        	Client.initPageTitle(pageStep1);

    		$this.queryFocusFund(sortParam1,sortType2);////默认净值,倒序
        	
        	$('.order .typ').on('click', function (){
    			var cur = $(this);
    			if (cur.hasClass('rank-up')) {
    				cur.removeClass('rank-up').addClass('rank-down');
    				if($(this).text()=="最新净值"){
    					$this.queryFocusFund(sortParam1,sortType2);//净值,倒序
    				}else if($(this).text()=="涨跌幅"){
    					$this.queryFocusFund(sortParam2,sortType2);//涨幅,倒序
    				}
    			} else if(cur.hasClass('rank-down')) {
    				cur.removeClass('rank-down').addClass('rank-up');
    				if($(this).text()=="最新净值"){
    					$this.queryFocusFund(sortParam1,sortType1);//净值,正序
    				}else if($(this).text()=="涨跌幅"){
    					$this.queryFocusFund(sortParam2,sortType1);//涨幅,正序
    				}
    			} else {
    				var sibs = cur.siblings('.typ');
    				sibs.removeClass('rank-up').removeClass('rank-down');
    				cur.addClass('rank-up');
    				if($(this).text()=="最新净值"){
    					$this.queryFocusFund(sortParam1,sortType1);
    				}else if($(this).text()=="涨跌幅"){
    					$this.queryFocusFund(sortParam2,sortType1);
    				}
    			}
    		});
        	
        },
        
        queryFocusFund: function(sortParam,sortType){//自选基金查询
        		Client.openWaitPanel("加载中");
 	    		var cardNo =Utils.getEleCard().cardNo;
 	    		var param1 = {
 	    				 cardNo:cardNo,
 	    				 resultSort:sortParam,// 0,净值/1,日涨幅
 	    				actionFlag:sortType//1,正序;0,倒序
 	    		};
 	    		var $this = this;
 	    		Ajax({url:"/fund/queryFocusFund",data:param1, success:function(data){//查询
 	    			if(MUI.isEmpty(data.errorCode)){
 	    				var icoll = data.iEFundBaseinfo;
 	    				if(icoll.length==0){
 	    					$this.showFinish();
 	    				}
 	    				$("#iEFundBaseinfo").empty();
						for(var len=0;len<icoll.length;len++){
							var kcoll = icoll[len];
							$this.addRow("iEFundBaseinfo",kcoll);
							
						}
						
						var turnPageTotalNum = icoll.length;
	    				if(turnPageTotalNum=="0"){
							$("#iEFundBaseinfo").hide();
							$('#noData').show();
						}else{
							$('#noData').hide();
							$("#iEFundBaseinfo").show();
						}
	    				var noData = document.getElementById('noData');//控制没数据时高度
	    				noData.style.height = document.documentElement.clientHeight - 42 + 'px';
						 App.storage.set("iEFundBaseinfoList",icoll);
						 Client.hideWaitPanel(1);
 	    			}else{
 	    				Client.alertinfo(data.errorMessage,"提醒");
 	    				 Client.hideWaitPanel(1);
 	    			}
 	    		},error:function(){
	    			Client.hideWaitPanel(1);
	    		}});
        },
        
        
        
        addRow : function(id,kcoll){
    		var fundlastnav = this.JsonNvl(kcoll.fundlastnav, "--");//空值替换
    		var dayRisePer = this.JsonNvl(kcoll.dayRisePer, "--");
    		var fundlastnavdate=Utils.formatDate(kcoll.fundlastnavdate,'yyyy-MM-dd','MM-dd');
    		var fundName=kcoll.fundName;
    		var boxClass = "box";
    		var html ='<tr class="'+boxClass+'">'+
						'<td width="50%" id="td_'+kcoll.fundCode+'">';
			if(fundName==""){
    			html+='<h1>--</h1>';
    		}else if(fundName.length<=10){
    			
    			html+='<h1>'+fundName+'</h1>';
    		}else{
    			html+='<h1>'+fundName.substring(0,10)+'...</h1>';
    		}
			html+='<h2 class="ft13 fc-9">'+kcoll.fundCode+'</h2></td>';
    		if(fundlastnav=="--"){
    			html +='<td class="ft16"  width="24%>'+
			    			'<h1 style="color:#DDDDDD">'+fundlastnav+'</h1>'+
				            '<h2 class="ft13 fc-9">'+fundlastnavdate+'</h2>'+
		    			'</td>';
    		}else if(!fundlastnav.indexOf("-")){//判正负,赋颜色
    			html +='<td class="ft16"  width="24%>'+
			    			'<h1 class="fc-green">'+fundlastnav+'</h1>'+
				            '<h2 class="ft13 fc-9">'+fundlastnavdate+'</h2>'+
						'</td>';
    		}else{
    			html +='<td class="ft16"  width="24%>'+
			    			'<h1 class="fc-orange">'+fundlastnav+'</h1>'+
				            '<h2 class="ft13 fc-9">'+fundlastnavdate+'</h2>'+
						'</td>';
    		}
    		
    		if(dayRisePer=="--"){
    			html +='<td><span  style="color:#DDDDDD">'+dayRisePer+'</span>';
    		}else if(!dayRisePer.indexOf("-")){
    			html +='<td><span class="downBtn">- '+dayRisePer.substring(1)+'</span>';
    		}else{
    			html +='<td><span class="upBtn">+'+dayRisePer+'</span>';
    		}
    		html+='<div class="delWrap"><i class="del" id="del_'+kcoll.fundCode+'"></i></div></td></tr>';
    		
    		$("#"+id).append(html);
    		var $this = this;
    		$("#td_"+kcoll.fundCode).on('click', function() {
    			$this.gotoDetail(kcoll);
    		});
    		
    		$("#del_"+kcoll.fundCode).on('click', function() {
    			$this.OptionalDelete(kcoll);
    		});
    		
    	},
        
    	JsonNvl : function(param, val) {
			
			if (MUI.isEmpty(param)) {
				paramT = val;
			} else {
				paramT = param;
			}
		
			return paramT;
    	},
    	
    	gotoDetail : function(kcoll){//跳转详情
    		 App.storage.set("iEFundBaseinfo",kcoll);
    		App.navigate("fund/fundCtl/fundDetaill",{iEFundBaseinfo:kcoll});
    		
    	},
    	
    	OptionalDelete : function(kcoll) {//删自选
			Client.openWaitPanel("加载中");
			var $this =this;
			var cardNo =Utils.getEleCard().cardNo;
			var fundCode = kcoll.fundCode;
			var TACode = kcoll.TACode;
			var topTime=Utils.getServerDate("yyyyMMddhhmmss");//置顶时间
			var param3 = {
					strs : cardNo + "|" + fundCode + "|"+ TACode + "|08|00|"+topTime+"#"
				};
			Ajax({url : "/fund/funCardRelateDelete",data : param3,success : function(data) {// 删除
					if (MUI.isEmpty(data.errorCode)) {
						Utils.alertinfo("成功删除自选");
						$this.queryFocusFund("0", "0");
						var sibs = $('.order .typ').siblings('.typ');
						sibs.removeClass('rank-up').removeClass('rank-down');
						$('#initial').addClass('rank-down');
						Client.hideWaitPanel(100);
					}
					else {
						Client.alertinfo(data.errorMessage, "提醒");
						Client.hideWaitPanel(1);
					}
				},
				error:function(){
	    			Client.hideWaitPanel(1);
	    		}});
		},
    	
    	management :function(){//管理自选
    		var icoll=App.storage.get("iEFundBaseinfoList");
    		if(icoll.length!=0){
    			var delOprt=$("#optionalData").attr("class");
    			if(delOprt == 'table'){
    				$("#optionalData").addClass("delOprt");
    				this.showManage();
    			}else{
    				$("#optionalData").removeClass("delOprt");
    				this.showFinish();
    			}
    		}else{
    			Utils.alertinfo("亲,赶紧去收藏你看中的基金吧!");
    		}
    	},
    	
    	showManage :function(){
    		var pageStep1 = {
    				title:'自选基金',
    				leftButton:{
    					name : '返回',
    					func: 'curView.goBack()'
    				},
    				rightButton:{
    					name :'完成',
    					func : 'curView.management()'
    				}
    		};
    		Client.initPageTitle(pageStep1);
    	},
    	
    	showFinish :function(){
    		var pageStep1 = {
    				title:'自选基金',
    				leftButton:{
    					name : '返回',
    					func: 'curView.goBack()'
    				},
    				rightButton:{
    					name :'管理',
    					func : 'curView.management()'
    				}
    		};
    		Client.initPageTitle(pageStep1);
    	},
    	
        goBack : function(){
        	App.back();
    	},
    	
	});
});