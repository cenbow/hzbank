define(function(require, exports, module){
	
	var bankNodeTpl = require("text!../template/bankNode.html");
	
	var bankNodeView = module.exports = ItemView.extend({
		
		events : {
		},
		
		template : bankNodeTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			this.initDrag();
		    var nodeInfo = App.storage.get("nodeInfo");
		    var cardNo = App.storage.get("_parameters").cardNo;
		    this.actionFlag = "1";
		    if(nodeInfo&&nodeInfo.cardNo==cardNo&&nodeInfo.cityCode){
		    	Client.getLocationInfo("curView.queryBankNodes");
		    }else{
		    	this.getOpenNodeInfo();
		    }
		    this.tarPageId = "1";
		    var $this = this;
		    $(".zen-switch-tab a").on("click",function(){
		    	$this.mysc.scrollTo(0,0);
		    	if($(this).attr("class").indexOf("active")>=0){
		    		return;
		    	}
		    	$(".zen-switch-tab a").removeClass("active");
		    	$(this).addClass("active");
		    	
		    	var index = $this.tarPageId = $(this).attr("data-value");
		    	$(".zen-list-3").hide();
		    	$("#"+index).show();
		    	
	    		$this.actionFlag = index;
	    		$this.queryBankNodes();
	    		
	    		this.mysc.refresh();
		    });
		    
		    
		    var setHeight = (document.documentElement.clientHeight || window.innerHeight) -170; //需要占满屏幕高度所需高度
    		document.querySelector('#noData').style.height = setHeight+ 'px';
		    
		},
		
		getOpenNodeInfo : function(){
			var sendStr = {
					"cardNo":App.storage.get("_parameters").cardNo
			};
			//网点信息查询
			var $this = this;
			Ajax({url:"/node/getOpenNodeInfo",data:sendStr,
				success:function(data){
					if(data.errorCode){
						Utils.alertinfo(data.errorMessage);
						$("#wrapper").hide();
						$('#noData').show();
						Client.hideWaitPanel(1);
					}else{
						data.cardNo = App.storage.get("_parameters").cardNo;
						App.storage.set("nodeInfo",data);
						$this.cityCode = data.cityCode;
						Client.getLocationInfo("curView.queryBankNodes");
					}
				}
			});
		},
		
		queryBankNodes : function(obj,pos){
			Client.openWaitPanel("");
			pos = pos?pos:"0";
			if(obj){
				this.latitude = obj.latitude;
				this.longitude = obj.longitude;
			}
			
			var actionFlag = this.actionFlag; //0按网点搜索，1按定位搜索
			
			var sendStr = {
				"actionFlag" : actionFlag,
				"longitude" : this.longitude,
				"latitude" : this.latitude,
				"nodeType" : "0",
				"provinceCode" : "",
				"cityCode" : this.cityCode,
				"areaCode" : "",
				"queryScope" : "",
				turnPageBeginPos : pos,
				turnPageShowNum : "10"
			};
			
			var $this = this;
			Ajax({url:"/node/queryBankNodeList",data:sendStr,
				success:function(data){
					if(data.errorCode){
						Utils.alertinfo(data.errorMessage);
						$("#wrapper").hide();
						$('#noData').show();
						Client.hideWaitPanel(1);
					}else{
						var html="";
						var node = data.bankNodeList;
						for(var i=0;i<node.length;i++){
							html += '<li data-value="'+ node[i].nodeNo + '|' + node[i].nodeName + '|'
								+ node[i].nodeAddress + '|' + node[i].agencyPhone+'"><div class="positon">'+
								'<h1>'+node[i].nodeName+'</h1>'+
								'<h2>'+node[i].nodeAddress+'</h2></div>'+
								(actionFlag=="1"?'<div class="distance">'+node[i].distance+'米</div>':'')
								+'</li>';
						}
						if(pos=="0")
							$("#"+actionFlag).html(html).attr("total",data.turnPageTotalNum);
						else
							$("#"+actionFlag).append(html).attr("total",data.turnPageTotalNum);
						
						if($('#'+actionFlag).find('li').length>=data.turnPageTotalNum){
							$this.mysc.dragLoad = false;
							$(".pullUp").hide();
						}else{
							$this.mysc.dragLoad = true;
							$(".pullUp").show();
						}
						
						if(data.turnPageTotalNum=="0"){
							$this.mysc.dragLoad = false;
							$("#wrapper").hide();
							$('#noData').show();
						}else{
							$('#noData').hide();
							$("#wrapper").show();
							$this.mysc.dragLoad = true;
						}
						$('#'+actionFlag).find('li').off().on("click",function(){
							var obj = $(this).attr("data-value").split("|");
							var param = {
									nodeNo:obj[0],
									nodeName:obj[1],
									cardNo:App.storage.get("_parameters").cardNo,
									certNo:App.storage.get("_parameters").certNo
							};
							App.navigate("special/specialCtl/changeCard",param);
						});
						
						$this.mysc.refresh();//DOM 加载结束后必须调用
					}
					Client.hideWaitPanel(1);
				}
			});
		},
		
		initDrag : function(){
		    
		    /*********************调用滚动插件**************************/
			
			var el = document.querySelector('#wrapper');
			el.style.height = pubParam.clientHeight - 56 + 'px';
			var $this = this;
			this.mysc = MUI.loadRefresh(el, {
				dragRefresh : false,
				loadCallback : function(){
					var pos = $('#'+$this.tarPageId).find('li').length;
			    	if(pos < $('#'+$this.tarPageId).attr("total")){
						 $this.queryBankNodes("",pos);
			    	}
		   	    }
		    });

		    /***********************************************/
		},

		cancel : function(){
			Client.menuOpt("5");
			var index = App.browseList.indexOf("special/specialCtl/special");
    	  	App.browseList.splice(1,index-1);
			App.back();
		},
		
		goBack : function(){
			App.back();
		},
	
	});
});
