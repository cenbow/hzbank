define(function(require, exports, module){
	
	var saleProductsTpl = require("text!../template/saleProducts.html");
	
	var saleProductsView = module.exports = ItemView.extend({
		
		template : saleProductsTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			var productName = "";
			var $this = this;
			var cnt = "1";
			$('.tab .cell').off().on('click',function(){
				var car = $(this);
				if(car.hasClass('active')){
					productName = $('.tab .active').text();
				}else{
					car.addClass('active').siblings().removeClass('active');
					productName = $('.tab .active').text();
				}
				if(productName=="新品区"){
					cnt = "1";
				}else{
					cnt = "0";
				}
				$this.queryProducts(cnt,"00",1);
			});
			$('.gap-tab .cell').off().on('click', function(){
				var cur = $(this);
				var ch = cur.find('i');
				if(cur.hasClass('active')){
					ch.hasClass('down')? ch.removeClass('down') : ch.addClass('down');
				}else{
					cur.addClass('active').siblings().removeClass('active');
				}
				var sort = cur.attr("data-value") + (ch.hasClass("down")?"1":"0");
				var productName = $('.tab .active').text();
				if(productName=="新品区"){
					cnt = "1";
				}else{
					cnt = "0";
				}
				$this.queryProducts(cnt,sort,1);
			});
			var transferFlag = App.storage.get("_parameters")?App.storage.get("_parameters").transferFlag:"1";
			if(transferFlag=="1"){
				this.queryProducts("1","00",1);
			}else{
				this.queryProducts("0","00",1);
				$("#tab").children().eq(0).removeClass('active');
				$("#tab").children().eq(1).addClass('active');
			}
			App.storage.remove("_parameters");
			this.initDrag();
		    this.list=[];
		    
		},
		
		queryProducts : function(cnt,sort,pos){
			if(cnt=="1"){
				this.queryProductsNew(sort,pos);
			}else{
				this.queryProductsOld(sort,pos);
			}
			
		},
		
		queryProductsNew : function(sort,pos){
			var param = {
					actionFlag:"1",
					resultSort:sort||"00",
					turnPageBeginPos:pos||1,
					turnPageShowNum:"6"
				};
			var $this = this;
			var isLogon = Utils.checkSession();
			var url="";
			if(!isLogon){
				url="/product/saleProducts";
			}else{
				url="/product/saleProductsSession";
			}
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:url, data:param, 
				success:function(data){
					var html = "";
					$.each(data.iSalePlatList,function(i,product){
						var state=product.state;
						var financePreInterestRate=Utils.formatCurrency(product.financePreInterestRate,2);
						var boxClass="box disabled";
						var myCircleClass="myCircle done";
						var label="label done";
						var raisebegindate = product.raisebegindate.substring(4,8);
						var raisebegin = Utils.formatDate(raisebegindate+product.raisebegintime, "MMddhhmmss", "MM-dd hh:mm");
						var productBuy="";
						var percent="";
						var financeUseVolTem="";
						var tranflag = product.tranflag;
						var tranClass = "";
						var tranName = "";
						if(tranflag=="00"){
							tranName="持有7天可转";
							tranClass="could-transfer-2";
						}else if(tranflag=="10"){
							tranName="";
							tranClass="";
						}
						if(state=="1"){
							percent="待发售";
							boxClass = "box abled";
							myCircleClass = "myCircle prev";
							productBuy = '<div class="label prev">'+raisebegin+'起售</div>';
						}else if(state=="2"){//募集中						
							percent=((product.financeTotalAmt-product.financeUseVol)/product.financeTotalAmt*100).toFixed(1)+"%";
							if(percent=='100.0%'){
								financeUseVolTem=Utils.formatCurrency(product.financeUseVol, 2);
								if(financeUseVolTem=='0.00'){
									percent="已售罄";
								}else{
									percent="99.9%";
									boxClass = "box abled";
									myCircleClass = "myCircle";
									label="label";
								}
							}else{
								boxClass = "box abled";
								myCircleClass = "myCircle";
								label="label";
							}
						}else if(state=="3"){//募集结束
							percent="已结束";
						}else{
							percent="已成立";
						}
						html += '<div class="'+boxClass+'" index="'+(pos+i-1)+'">'+
			            '<div class="tt"><span>'+product.financeName+'</span><span class="'+tranClass+'">'+tranName+'</span>'+productBuy+'</div>'+
			            '<div class="row">'+
		                '<div class="cell">'+
		                    '<h1 class="fc-orange"><b>'+financePreInterestRate+'</b>%</h1>'+
		                    '<p>预期收益率</p></div>'+
		                '<div class="cell">'+
		                    '<h1 class="fc-orange"><b>'+product.minbuyamt+'</b>元</h1>'+
		                    '<p>起投金额</p></div>'+
		                '<div class="cell">'+
		                    '<h1><b>'+product.financePeriod+'</b>天</h1>'+
		                    '<p>投资期限</p></div>'+
		                '<div class="state">'+
		                    '<div class="'+myCircleClass+'" data-percent="'+percent+'">'+
		                        '<div class="left"><i></i></div>'+
		                        '<div class="right"><i></i></div>'+
		                    '</div></div></div></div>';
					});
					var turnPageTotalNum = data.turnPageTotalNum;
					if(!pos||pos=="1"){
						$("#proList").html(html).attr("total",turnPageTotalNum);
						$this.list = data.iSalePlatList;
						$this.mysc.scrollTo(0, -40, 0);
					}
					else{
						$("#proList").append(html).attr("total",turnPageTotalNum);
						$this.list = $this.list.concat(data.iSalePlatList);
					}
					
					if(turnPageTotalNum<=$("#proList").find('.box').length){
	    				$this.mysc.dragLoad = false;
						$(".pullUp").hide();
	    			}else{
	    				$(".pullUp").show();
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
	    			
					$('.myCircle').each(function(){
						var dataPercet = $(this).attr('data-percent'); 
						var per = 0;
						if(dataPercet=="已结束"||dataPercet=="已成立"||dataPercet=="待发售"){
							per = 0;
						}else{
							per = $(this).attr('data-percent').replace(/%/, '')*1;
						}
						$this.setCircle(this, per);
					});
				    
					$("#proList").children("div").off().on("click",function(){
						var index = $(this).attr("index");
						App.navigate("product/productCtl/investDetail",$this.list[index]);
					});
					
					$this.mysc.refresh();
				    Client.hideWaitPanel(100);
				}
			});
		},
		
		queryProductsOld : function(sort,pos){
			var param = {	
					resultSort:sort||"00",
					turnPageBeginPos:pos||1,
					turnPageShowNum:"6"
				};
			var $this = this;
			var isLogon = Utils.checkSession();
			var url="";
			if(!isLogon){
				url="/product/transferProQuery";
			}else{
				url="/product/transferProQuerySession";
			}
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:url, data:param, 
				success:function(data){
					var html = "";
					$.each(data.iTransferProData,function(i,product){
						//根据状态判断是否可以购买
						var boxClass="box";
						var tranName="持有7天可转";
						var transferAMT = Utils.formatCurrency(product.transferAMT,2);
						var tranRate = Utils.formatCurrency(product.tranRate,2);
						html += '<div class="'+boxClass+'" index="'+(pos+i-1)+'" attr0="'+product.financeNo+'" attr1="'+product.buyIncome+'" attr2="'+product.financeName+'" attr3="'+product.tranRate+'" attr4="'+product.fundRestDay+'" attr5="'+product.transferAMT+'" attr6="'+product.tranFlowNo+'">'+
						            '<div class="tt">'+
					            		'<span>'+product.financeName+'</span><span class="could-transfer-2">'+tranName+'</span>'+
						            '</div>'+
						            '<div class="row">'+
						                '<div class="cell">'+
						                    '<h1 class="fc-orange"><b>'+tranRate+'</b>%</h1>'+
						                    '<p>预期收益率</p>'+
						                '</div>'+
						                '<div class="cell">'+
						                    '<h1><b">'+product.fundRestDay+'</b>天</h1>'+
						                    '<p>产品期限</p>'+
						                '</div>'+
						                '<div class="cell">'+
						                    '<h2 class="ft16"><span>'+transferAMT+'</span>元</h2>'+
						                    '<p>转让价格</p>'+
						                '</div>'+
						                '<div class="state">'+
						                	'<div class="buyBtn">购买</div>'+
						                '</div>'+
						            '</div>'+
						        '</div>';
					});
					var turnPageTotalNum = data.turnPageTotalNum;
					if(!pos||pos=="1"){
						$("#proList").html(html).attr("total",turnPageTotalNum);
						$this.list = data.iTransferProData;
						$this.mysc.scrollTo(0, -40, 0);
					}
					else{
						$("#proList").append(html).attr("total",turnPageTotalNum);
						$this.list = $this.list.concat(data.iTransferProData);
					}
					
					if(turnPageTotalNum<=$("#proList").find('.box').length){
	    				$this.mysc.dragLoad = false;
						$(".pullUp").hide();
	    			}else{
	    				$(".pullUp").show();
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
	    			$("#proList").children("div").off().on("click",function(e){
	    				var financeNo = $(this).attr("attr0");
						var buyIncome = $(this).attr("attr1");
						var financeName = $(this).attr("attr2");
						var tranRate = $(this).attr("attr3");
						var fundRestDay = $(this).attr("attr4");
						var transferAMT = $(this).attr("attr5");
						var tranFlowNo = $(this).attr("attr6");
						var param = {
								financeNo:financeNo,
								buyIncome:buyIncome,
								financeName:financeName,
								tranRate:tranRate,
								fundRestDay:fundRestDay,
								transferAMT:transferAMT,
								tranFlowNo:tranFlowNo
						};
						//判断用户是否登录
						var isLogon = Utils.checkSession();
						if(!isLogon){  
							Client.toLogin("curView.queryProductsOld()");
						 }else{
				   			if(!Utils.checkRealUser()){
					        	return;
				   			}
							if(!Utils.checkActivate()){
								return;
							}
							App.navigate("product/productCtl/transferBuy",param);
						}
					});
					$this.mysc.refresh();
				    Client.hideWaitPanel(100);
				}
			});
		},
		
		
		initDrag : function(){
		    
		    /*********************调用滚动插件**************************/
			
			var el = document.getElementById('wrapper');
			document.getElementById('noData').style.height= pubParam.clientHeight - 56 + 'px';
			el.style.height = pubParam.clientHeight - 56 + 'px';
			var $this = this;
			this.mysc = MUI.loadRefresh(el, {
				dragRefresh : false,
				loadCallback : function(){
		    	   var pos = $("#proList").find('.box').length+1;
		    	   if(pos <= $("#proList").attr("total")){
		   				var cur = $('.gap-tab .cell.active');
		   				var ch = cur.find('i');
		   				var sort = cur.attr("data-value") + (ch.hasClass("down")?"1":"2");
		   				var productName = $('.tab .active').text();
		   				var cnt="1";
		   				if(productName=="新品区"){
		   					cnt="1";
		   				}else{
		   					cnt="0";
		   				}
		   				$this.queryProducts(cnt,sort,pos);
		    	   }
		   	    }
		    });

		    /***********************************************/
		},
		
		setCircle : function(elem, x){
		   var lcir = elem.querySelector('.left i');
		   var rcir = elem.querySelector('.right i'); 
		   if(x == 100){
			  elem.className = 'myCircle done';
		   }else if(x<=50){
			 var deg = 3.6*x - 180;
			 lcir.style.transform = lcir.style.webkitTransform = 'rotate('+deg+'deg)';
			 lcir.style.transition = lcir.style.webkitTransition = 'transform '+(x/125)+'s ease-in-out';
		   }else{
			 var deg = 3.6*(x-50) - 180;
			 lcir.style.transform = lcir.style.webkitTransform = 'rotate(0deg)';
			 lcir.style.transition = lcir.style.webkitTransition = 'transform .4s ease-in';
			 rcir.style.transform = rcir.style.webkitTransform = 'rotate('+deg+'deg)';
			 rcir.style.transition = rcir.style.webkitTransition = 'transform '+(x/125-0.4)+'s ease-out .4s';
		   }
		},
		
		goBack : function(){
			App.navigate("product/productCtl/wantInv");
		}
	
	});
});
