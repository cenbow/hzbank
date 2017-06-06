define(function (require, exports, module) {
	
	var fundHistoryNavListTemplate = require("text!../template/fundHistoryNavList.html");
	var fundHistoryNavListView = module.exports = ItemView.extend({
		 
		template : fundHistoryNavListTemplate,
	        
        events:{
        	
        },
        initialize : function(){
        	var $this = this;
        	
        	this.turnPageShowNum=10;
        	var pageStep1 = {
        		title:'历史净值',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		},
        		
        	};
        	Client.initPageTitle(pageStep1);
    		$this.fundHistoryNavQuery(1);//历史净值查询
        	$this.initDrag();
        },
        
        fundHistoryNavQuery : function(pos) {// 历史净值查询
        	Client.openWaitPanel("加载中...");
        	var fundCode = App.storage.get("_parameters").iEFundBaseinfo.fundCode;
			var param2 = {
				fundCode : fundCode,
				turnPageBeginPos:pos||1,
				turnPageShowNum:"15",
			};
			var $this = this;
			Ajax({url : "/fund/fundHistoryNavQuery",data : param2,success : function(data) {// 查询
				if (MUI.isEmpty(data.errorCode)) {
					var icoll = data.fundHistoryNavList;
					if(!pos||pos=="1"){
    					$("#fundHistoryNavList").empty();
					}
					for ( var len = 0; len < icoll.length; len++) {
						var kcoll = icoll[len];
						$this.addRow("fundHistoryNavList", kcoll);
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
    				if(turnPageTotalNum<=$("#fundHistoryNavList").find('.box').length){
	    				$this.mysc.dragLoad = false;
						$(".pullUp").hide();
	    			}else{
	    				$(".pullUp").show();
	    			}
	    			
	    			
				    Client.hideWaitPanel(100);
					
					
				} else {
					Client.alertinfo(data.errorMessage, "提醒");
					Client.hideWaitPanel(1);
				}
			},error:function(){
    			Client.hideWaitPanel(1);
    		}});
		},

		addRow : function(id, kcoll) {
			var fundlastnav = this.JsonNvl(kcoll.fundlastnav, "--");// 空值替换
			var fundtotalnav = this.JsonNvl(kcoll.fundtotalnav, "--");
			var fundlastnavdate =(kcoll.fundlastnavdate).substring(2,10);
			var dayRisePer = this.JsonNvl(kcoll.dayRisePer, "--");
			var boxClass = "box";
			var html = '<tr class="'+boxClass+'">' + 
						'<td width="25%">' +fundlastnavdate+'</td>' + 
						'<td width="25%">' + fundlastnav+'</td>'+ 
						'<td width="25%">' + fundtotalnav+ '</td>';
			if (!dayRisePer.indexOf("-")) {
				html += '<td class="fc-green">' + dayRisePer+ '</td></tr>';
			} else {
				html += '<td class="fc-orange">+' + dayRisePer+ '</td></tr>';
			}
			$("#" + id).append(html);
		},

		JsonNvl : function(param, val) {

			if (MUI.isEmpty(param)) {
				paramT = val;
			} else {
				paramT = param;
			}

			return paramT;
		},

        
        goBack : function(){
        	App.back();
    	},
    	
    	initDrag : function(){
		    /*********************调用滚动插件**************************/
			
			var el = document.getElementById('wrapper');
			el.style.height = document.documentElement.clientHeight  + 'px';
			var noData = document.getElementById('noData');//控制没数据时高度
			noData.style.height = document.documentElement.clientHeight - 45 + 'px';
			var $this = this;
			this.mysc = MUI.loadRefresh(el, {
				dragRefresh : false,
				loadCallback : function(){
					var pos = $("#fundHistoryNavList").find('.box').length+1;
					$this.fundHistoryNavQuery(pos);
						
		   	    }
		    });
		    /***********************************************/
			
			
		},
	});
});
        	