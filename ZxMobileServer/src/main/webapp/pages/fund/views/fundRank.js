define(function (require, exports, module) {
	
	var fundRankTemplate = require("text!../template/fundRank.html");
	var FundRankInfoView = module.exports = ItemView.extend({
		 
		template : fundRankTemplate,
	        
        events:{
        	
        },
        initialize : function(){
        	var $this = this;
        	
        	
        	var fundType="股票";
        	this.sortType="30";
        	
        	this.turnPageShowNum=10;
        	this.taCode="00";
        	this.fundName="";
        	this.fundSellState="0";
        	this.actionFlag="";
        	var pageStep1 = {
        		title:'基金排行',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		},
	        	rightButton:{
	        		name : pubParam.clientVersion>"3.0.7"?'fundSearch':'',
//	        		name :'fundSearch',
					func : ''
				}
        		
        	};
        	Client.initPageTitle(pageStep1);
        	$this.queryFundInfo("股票","30",1);//默认 股票型,日涨幅,降序
        	
        	Client.hideWaitPanel(1);
      	
        	
        	var tableSecNavList = $('.table .secNav .navList');
    		var tableSecNavTt = $('.table .secNav .tt');
    		var tabSecNavList = $('.filterNav .secNav .navList');
    		var tabSecNavTt = $('.filterNav .secNav .tit');
    		tableSecNavTt.on('click', function(){
    			var cur = $(this);
    			cur.hasClass('spr') ? cur.removeClass('spr') : cur.addClass('spr');
    			tableSecNavList.hasClass('show') ? tableSecNavList.removeClass('show') : tableSecNavList.addClass('show');
    		});
    		
    		$('.table .navList .itm').on('click', function(){//涨幅下拉
    			tableSecNavList.removeClass('show');
    			tableSecNavTt.removeClass('spr');
    			var sortType = $(this).attr("data-value");
    			$this.queryFundInfo(fundType,sortType,1);
    			$('#risePer').text($(this).text());
    			$('#risePer').attr("data-value",$(this).attr("data-value"));
    		});
    		//////////////////////////////
    		$('.filterNav .cell').on('click', function(){//基金类型菜单(4个)
    			if($(this).hasClass('active')){//防止二次点击
     	    	   return;
     	       }
    			$(this).addClass('active').siblings('.cell').removeClass('active');
    			fundType = $(this).attr("data-value");
    			$this.queryFundInfo(fundType,$this.sortType,1);
    			$('#risePer').text("日涨幅");//涨幅下拉恢复为日涨幅
//    			$('#fundType').text("其他");//其他菜单下拉恢复为其他 
    			$('#risePer').attr("data-value","30");////涨幅下拉data-value恢复为30
    		});
    		tabSecNavTt.on('click', function(){
    			var cur = $(this);
    			cur.hasClass('spr') ? cur.removeClass('spr') : cur.addClass('spr');
    			tabSecNavList.hasClass('show') ? tabSecNavList.removeClass('show') : tabSecNavList.addClass('show');
    		});
    		$('.filterNav .navList .itm').on('click', function(){//基金类型菜单(其他)----后期再显示***
    			tabSecNavList.removeClass('show');
    			tabSecNavTt.removeClass('spr');
    			fundType = $(this).attr("data-value");
    			$this.queryFundInfo(fundType,sortType,1);
    			$('#risePer').text("日涨幅");
    			$('#fundType').text($(this).text());
    			$('.filterNav .cell').removeClass('active');
    			$('#fundType').addClass('active');
    			$('#risePer').attr("data-value","30");////涨幅下拉data-value恢复为30
    			$('#fundType').attr("data-value",$(this).attr("data-value"));
    		});
    		//////////////////////////////
    		$('.cell,#fundList,.table .filter th:not(.secNav),.filterNav .secNav,#noData ').click(function(){//涨幅下拉列表隐藏
    			tableSecNavList.removeClass('show');
    			tableSecNavTt.removeClass('spr');
    		});
    		$('.cell,.table .filter th,#fundList,#noData').click(function(){//类型菜单下拉隐藏
    			tabSecNavList.removeClass('show');
    			tabSecNavTt.removeClass('spr');
    		});
    		$this.initDrag();
        },
        
        queryFundInfo : function(fundType,sortType,pos){
        	var param = {
    				taCode:this.taCode,
    				fundName:this.fundName,
    				fundType:fundType,
    				fundSellState:this.fundSellState,
    				resultSort:sortType,
    				turnPageBeginPos:pos||1,
    				turnPageShowNum:this.turnPageShowNum,
    				actionFlag:this.actionFlag
    		};
    		var $this = this;
    		Ajax({url:"/fund/fundQuery",data:param,success:function(data){
	    			if(MUI.isEmpty(data.errorCode)){
	    				var icoll = data.iFundInfo;
	    				
	    				if(!pos||pos=="1"){
	    					$("#fundList").empty();
						}
	    				for(var len=0;len<icoll.length;len++){
							var kcoll = icoll[len];
							$this.addRow("fundList",kcoll,sortType);
							$this.mysc.refresh();
							
						}
	    				var turnPageTotalNum = data.turnPageTotalNum;
	    				if(turnPageTotalNum=="0"){
							$this.mysc.dragLoad = false;
							$("#wrapper").hide();
							$('#noData').show();
						}else{
							$('#noData').hide();
							$("#wrapper").show();
							$this.mysc.dragLoad = true;
						}
	    				if(turnPageTotalNum<=$("#fundList").find('.box').length){
		    				$this.mysc.dragLoad = false;
							$(".pullUp").hide();
		    			}else{
		    				$(".pullUp").show();
		    			}
		    			
		    			
					    Client.hideWaitPanel(100);
	    			}else{
	    				Client.alertinfo(data.errorMessage,"提醒");
	    			}
    		},error:function(){
    			Client.hideWaitPanel(1);
    		}});
    	},
    	
    	addRow : function(id,kcoll,sortType){
    		
    		var risePer;
    		if(sortType=="30"){//判排序类型
    				risePer = kcoll.dayRisePer;
    		}else if(sortType=="a0"){
    			risePer = kcoll.avgreturnWeek;
    			if(risePer==""){
    				risePer = this.JsonNvl(risePer, "--");
    			}else{
    				risePer=Utils.toRetentionDigit(risePer,2)+"%";
    			}
    		}else if(sortType=="40"){
    			risePer = kcoll.monthRisePer;
    		}else if(sortType=="50"){
    			risePer = kcoll.threemonthRisePer;
    		}else if(sortType=="60"){
    			risePer = kcoll.halfyearRisePer;
    		}else if(sortType=="70"){
    			risePer = kcoll.yearRisePer;
    		}else if(sortType=="b0"){
    			risePer = kcoll.avgreturnThreeYear;
    			if(risePer==""){
    				risePer = this.JsonNvl(risePer, "--");
    			}else{
    				risePer=Utils.toRetentionDigit(risePer,2)+"%";
    			}
    		}else if(sortType=="c0"){
    			risePer = kcoll.avgreturnThisYear;
    			if(risePer==""){
    				risePer = this.JsonNvl(risePer, "--");
    			}else{
    				risePer=Utils.toRetentionDigit(risePer,2)+"%";
    			}
    		}else{
    			risePer = "";
    		} 
    		
    		var fundlastnav = this.JsonNvl(kcoll.fundlastnav, "--");//空值替换
    		var fundlastnavdate = Utils.formatDate(kcoll.fundlastnavdate, "yyyy-MM-dd", "MM-dd");	
    		var fundName=kcoll.fundName;
    		risePer = this.JsonNvl(risePer, "--");
    		var boxClass = "box";//id="totalNum" ant="'+index+'"
    		html ='<tr id="tr_'+kcoll.fundCode+'" class="'+boxClass+'" >'+
						'<td width="48%">';
							
			if(fundName==""){
    			html+='<h1>--</h1>';
    		}else if(fundName.length<=10){
    			
    			html+='<h1>'+fundName+'</h1>';
    		}else{
    			html+='<h1>'+fundName.substring(0,10)+'...</h1>';
    		}
		     html+= '<h2 class="ft13 fc-9">'+kcoll.fundCode+'</h2>'+
				 '</td>'+
				 '<td width="26%" class="ft16">'+
		        	'<h1>'+fundlastnav+'</h1>'+
		            '<h2 class="ft13 fc-9">'+fundlastnavdate+'</h2>'+
		        '</td>';
    		if(!risePer.indexOf("-")){
    			html +='<td class="fc-green">'+risePer+'</td></tr>';
    		}else{
    			html +='<td class="fc-orange">+'+risePer+'</td></tr>';
    		}
    		
    		$("#"+id).append(html);
    		var $this = this;
    		$("#tr_"+kcoll.fundCode).on('click', function() {
    			$this.gotoDetail(kcoll);
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
    	
    	gotoDetail : function(kcoll){
    		App.storage.set("iEFundBaseinfo",kcoll);
    		App.navigate("fund/fundCtl/fundDetaill",{iEFundBaseinfo:kcoll});
    	},
    	
        goBack : function(){
        	App.back();
    	},
    	
    	initDrag : function(){
		    /*********************调用滚动插件**************************/
			
			var el = document.getElementById('wrapper');
			el.style.height = document.documentElement.clientHeight - 80 + 'px';
			var noData = document.getElementById('noData');//控制没数据时高度
			noData.style.height = document.documentElement.clientHeight - 80 + 'px';
			var $this = this;
			this.mysc = MUI.loadRefresh(el, {
				dragRefresh : false,
				loadCallback : function(){
					var pos = $("#fundList").find('.box').length+1;
					var fundType = $('.filterNav .cell.active').attr("data-value");
					var sortType=$('#risePer').attr("data-value");	
					$this.queryFundInfo(fundType,sortType,pos);
						
		   	    }
		    });
		    /***********************************************/
			
			
		},
    	
	});
});
	
	