define(function(require, exports, module) {
	
	var investDetailTpl = require("text!../template/investDetail.html");

	var investDetailView = module.exports = ItemView.extend({

		template : investDetailTpl,

		events : {
			"click #buy" : "buy",
			"click #cell_a" : "cell_a",
			"click #cell_b" : "cell_b",
			"click #cell_c" : "cell_c",
			"click #tit" : "tit"
		},
		
		// 初始化
		initialize : function() {
				var tranflag=App.storage.get("_parameters")?App.storage.get("_parameters").tranflag:"";
				if(tranflag=="00"){
					$("#tranflag").text("持有7天可转");
					$("#other").text("可撤单，不能预约，可转让");
					$("#tranflag").show();
				}else if(tranflag=="10"){
					$("#tranflag").text("");
					$("#other").text("可撤单，不能预约，不能转让");
					$("#tranflag").hide();
				}
	        	var time = ""+this.model.get("raisebegindate") + this.model.get("raisebegintime");
	        	var raiseTime = Utils.parseDate(time,"yyyy-MM-ddhhmmss");
		        var sysTime = Utils.parseDate(this.model.get("sysTime"),"yyyyMMddhhmmss");
		        if(raiseTime >= sysTime){
		        	this.countTime(sysTime,raiseTime);
		        }
		        
	        	var $this=this;
	        	// tab切换
	    		var tabPointPage = $('.tabPoint >div');
	    		$('.fudDetail .tab .cell').on('click', function(){
	    			var idx = tabPointPage.eq($(this).index());
	    			$(this).addClass('active').siblings().removeClass('active');
	    			idx.show().siblings().hide();
	    		});
	        	
	        	$('.director .list-item').on('click', function(){
	    			var me = $(this), 
	    			    cnt = me.next(), 
	    			    setH = cnt.find('.para').get(0).offsetHeight, 
	    			    offsetTop = me.offset().top;
	    			setTimeout(function() {
						window.scrollTo(0, offsetTop);
					}, 200);
	    			me.hasClass('spr') ? 
	    			me.removeClass('spr') && cnt.css('height',0) : 
	    			me.addClass('spr') && cnt.css('height',setH);
	    		});
	        	
	    		var percent = this.model.get("percent");
	    		var state=App.storage.get("model").state;
	    		if(percent != "待发售"){
	    			percent = parseFloat(percent.replace("%",""));
		    		this.circleJitter(percent);
		    		if(percent >= "100" && state == "3"){
		    			$("#tag").show();
		    		}else if(state != "1" && state != "2"){
		    			$("#tag").removeClass("soldOut").addClass("soldEnd").show();
		    		}
	    		}else{
	    			$(".tag").hide();
	    			this.circleJitter(0);
	    			setTimeout(function(){
	    				$(".percent").text("待发售");
	    			},50);
	    		}
	    		
	    		this.calcuDate();
	    		
	        	//判断是否可投资
				var financeUseVol=App.storage.get("model").financeUseVol;
				financeUseVol = financeUseVol.replace(/,/g,"");
				if((state=="2")&&(parseFloat(financeUseVol) != 0)){
					$("#buy").removeClass('disabled').removeAttr('disabled');
				}else{
					//立即投资按钮为灰色且不可用
					$("#buy").addClass("disabled").attr("disabled",true);
				}
				
				this.opt = {
						callback:"curView.refresh()"
				};
				Client.dragRefresh(this.opt);
				Client.hideWaitPanel(1);
		},
		
		refresh:function(){
			var financeNo=App.storage.get("model").financeNo;
			var $this = this;
			Ajax({url:"/product/saleDetailById", data:{financeNo:financeNo}, 
				success:function(data){
					if (data.errorCode) {
						Utils.alertinfo(data.errorMessage);
						App.back();
					} else {
						data.financeNo = financeNo;
						var financeName=data.financeName;
						var financeRiskLevel=data.financeRiskLevel;
						if(financeRiskLevel=="1"){
							financeRiskLevel="低风险";
						}else if(financeRiskLevel=="2"){
							financeRiskLevel="中低风险";
						}else if(financeRiskLevel=="3"){
							financeRiskLevel="中风险";
						}else if(financeRiskLevel=="4"){
							financeRiskLevel="中高风险";
						}else if(financeRiskLevel=="5"){
							financeRiskLevel="高风险";
						}
						
						var financePreInterestRate=Utils.formatCurrency($.trim(data.financePreInterestRate),2);
						var financePeriod=data.financePeriod;
						var minbuyamt=data.minbuyamt;
						var toaddamt=data.toaddamt;
						var limitamount=data.limitamount;
						var raisebegindate=data.raisebegindate;
						 	raisebegindate=raisebegindate.substring(0,4)+"-"+raisebegindate.substring(4,6)
						 					+"-"+raisebegindate.substring(6,8);
						var raiseenddate=data.raiseenddate;
							raiseenddate=raiseenddate.substring(0,4)+"-"+raiseenddate.substring(4,6)
											+"-"+raiseenddate.substring(6,8);
						var repaymentType=data.repaymentType;
						if(repaymentType=="1"){
							repaymentType="到期还本付息";
						}
						var interestBeginDate=data.interestBeginDate;
							interestBeginDate=interestBeginDate.substring(0,4)+"-"+interestBeginDate.substring(4,6)
												+"-"+interestBeginDate.substring(6,8);
						var interestEndDate=data.interestEndDate;
							interestEndDate=interestEndDate.substring(0,4)+"-"+interestEndDate.substring(4,6)
											+"-"+interestEndDate.substring(6,8);
						var financeUseVol=Utils.formatCurrency(data.financeUseVol, 2);
						var financeTotalAmt=Utils.formatCurrency(data.financeTotalAmt, 2);
						var financeDetail=data.financeDetail;
						var bidFee=Utils.formatCurrency(data.bidFee,2);
						var transferFee=Utils.formatCurrency(data.transferFee,2);
						var revokeFee=Utils.formatCurrency(data.revokeFee,2);
						var financeProtocol=data.financeProtocol;
						var state=data.state;
						var percent="";
						if(state=="1"){
							percent="待发售";
						}else {
							percent=((data.financeTotalAmt-data.financeUseVol)/data.financeTotalAmt*100).toFixed(1)+"%";
							if(percent=='100.0%'){
								if(financeUseVol=='0.00'){
									percent="100.0%";
								}else{
									percent="99.9%";			
								}
							}
						}
						
						var model = {
								"financeNo":financeNo,                           
								"financeName":financeName,                         
								"financeRiskLevel":financeRiskLevel,                    
								"financePreInterestRate":financePreInterestRate,              
								"financePeriod":financePeriod,                       
								"minbuyamt":minbuyamt,                           
								"toaddamt":toaddamt,                            
								"limitamount":limitamount,                         
								"raisebegindate":raisebegindate,               
								"raiseenddate":raiseenddate,                 
								"repaymentType":repaymentType,                       
								"interestBeginDate":interestBeginDate,            
								"interestEndDate":interestEndDate,              
								"financeUseVol":financeUseVol,                       
								"financeTotalAmt":financeTotalAmt,                     
								"financeDetail":financeDetail,               
								"bidFee":bidFee,                              
								"transferFee":transferFee,                         
								"revokeFee":revokeFee,                           
								"financeProtocol":financeProtocol,
								"percent":percent,
								"state":state,
								"sysTime":data.sysTime,
								"raisebegintime":data.raisebegintime,
								"tranflag":data.tranflag
						};
						App.storage.set("model",model);
						$this.model.set(model);
							
						financeUseVol = financeUseVol.replace(/,/g,"");
						if((state=="2")&&(parseFloat(financeUseVol) != 0)){
							$("#buy").removeClass('disabled').removeAttr('disabled');
						}else{
							//立即投资按钮为灰色且不可用
							$("#buy").addClass("disabled").attr("disabled",true);
						}
							
						setTimeout(function(){
							if(percent != "待发售"){
				    			percent = parseFloat(percent.replace("%",""));
					    		$this.circleJitter(percent);
					    		if(percent >= "100" && state == "3"){
					    			$("#tag").show();
					    		}else if(state != "1" && state != "2"){
					    			$("#tag").removeClass("soldOut").addClass("soldEnd").show();
					    		}
				    		}else{
				    			$(".tag").hide();
				    			$this.circleJitter(0);
				    			setTimeout(function(){
				    				$(".percent").text("待发售");
				    			},50);
				    		}
							$this.calcuDate();
							// tab切换
				    		var tabPointPage = $('.tabPoint >div');
				    		$('.fudDetail .tab .cell').on('click', function(){
				    			var idx = tabPointPage.eq($(this).index());
				    			$(this).addClass('active').siblings().removeClass('active');
				    			idx.show().siblings().hide();
				    		});
				        	
				        	$('.director .list-item').on('click', function(){
				    			var me = $(this), 
				    			    cnt = me.next(), 
				    			    setH = cnt.find('.para').get(0).offsetHeight,
				    			    offsetTop = me.offset().top;;
				    			setTimeout(function() {
									window.scrollTo(0, offsetTop);
								}, 200);
				    			me.hasClass('spr') ? 
				    			me.removeClass('spr') && cnt.css('height',0) : 
				    			me.addClass('spr') && cnt.css('height',setH);
				    		});
						},50);
						
						//刷新首页产品数据
						var saleProducts = App.storage.get("saleProducts");
						if(saleProducts){
							$.each(saleProducts.iSalePlatList,function(i,product){
								if(product.financeNo == data.financeNo){
									data.financePreInterestRate=$.trim(data.financePreInterestRate);
									saleProducts.iSalePlatList[i] = data;
								}
							});
							App.storage.set("saleProducts",saleProducts);
						}
						
					}
					Client.hideWaitPanel(100);
					$this.opt.type = "1";
					Client.dragRefresh($this.opt);
					
					
					var tranflag = data.tranflag;
					if(tranflag=="00"){
						$("#tranflag").text("持有7天可转");
						$("#other").text("可撤单，不能预约，可转让");
						$("#tranflag").show();
					}else{
						$("#tranflag").text("");
						$("#other").text("可撤单，不能预约，不能转让");
						$("#tranflag").hide();
					}
				}
			});
		},
		
		showModel : function(model){
			$.each(model,function(key,value){
				if(key == 'percent'){
					$('.myCircle').attr("data-percent",value);
					return;
				}
				$("#"+key).text(value);
			});
		},
		
		countTime : function(sysTime,raiseTime){
			if(location.href.indexOf("investDetail")<0){
				return;
			}
			//$('#time').text(Utils.parseSeconds(raiseTime-sysTime));
			if(raiseTime - sysTime <= 0){
				Client.openWaitPanel("正在提交中，请稍候");
				this.refresh();
			}else{
				sysTime = new Date(sysTime.getTime()+1000);
				var $this = this;
				setTimeout(function(){
					$this.countTime(sysTime, raiseTime);
				},1000);
			}
		},
		
		goBack : function(){
    		App.back();
    	},
    	
    	help : function(){
    		App.navigate("product/productCtl/saleHelp");
    	},
    	
    	tit : function(){
    		var ch=$('.lbliz .itm');
    		if(ch.hasClass('spr')){
    			ch.removeClass('spr'); 
    			$("#cnt").hide();
    		}else{
    			ch.addClass('spr');
    			$("#cnt").show();
    		}
    	},
    	
		
		// 立即投资
		buy : function() {
	  		if($("#buy").attr('class').indexOf('disabled')>=0){
	  			return false;
	  		}	  		
	
			//判断用户是否登录
			var isLogon = Utils.checkSession();
			if(!isLogon){  
				Client.toLogin("curView.buy()");
			 }else{
	   			if(!Utils.checkRealUser()){
		        	return;
	   			}
				if(!Utils.checkActivate()){
					return;
				}
				App.navigate("product/productCtl/immteInvest");
			}	
			
		},
		
		// 投资记录查询
		cell_c : function() {
			App.navigate("product/productCtl/investRecord");
			Client.menuOpt("0");
		},
		
		// 协议范本
		cell_a : function() {
			Client.openWaitPanel("拼命加载中，请稍候");
			App.navigate("product/productCtl/agreement");
			Client.menuOpt("0");
		},
		
		// 项目信息
		cell_b : function() {
			Client.openWaitPanel("拼命加载中，请稍候");
			App.navigate("product/productCtl/project");
			Client.menuOpt("0");
		},
		
		/*
		 * 定义半环进度
		 */
		  
		setHalfProgressCircle:function(id, num){
			var per = 100 - num;
			var elem = document.getElementById(id);
			var cutter = elem.querySelector('.cutter');
			var pct = elem.querySelector('.percent');
			var bar = cutter.querySelector('.bar');
			pct.innerText = num;
			cutter.style.transform = cutter.style.webkitTransform = 'rotate(' + per * -1.8 + 'deg)';
			bar.style.transform = bar.style.webkitTransform = 'rotate(' + per * 1.8 + 'deg)';	
		},
			
		circleJitter:function(x){
			var num = 0;
			var $this = this;
			timer && clearTimeout(timer);
			var timer = setInterval(function(){
				if(location.href.indexOf("investDetail")<0){
					clearTimeout(timer);
					return
				}
				$this.setHalfProgressCircle('progCircle', (x<1||num>=x)?x:num);
				if (num >= x) {
					clearTimeout(timer);
					return;
				}
				num++;
			}, 30);
		},
		
		setStepProgress:function(step, num){
            var elem = document.getElementById('raiseBar');
            var st1 = elem.querySelector('.step1 i');
            var st2 = elem.querySelector('.step2 i');
            var st3 = elem.querySelector('.step3 i');
            var dt1 = elem.querySelector('.dot1');
            var dt2 = elem.querySelector('.dot2');
            var dt3 = elem.querySelector('.dot3');
            var dt4 = elem.querySelector('.dot4');
            var delay = function (fn, t) {
                var lightTimer = setTimeout(function () {
                    fn();
                    clearTimeout(lightTimer)
                }, t)
            }
            if (step == 1) {
                if(num != 0) {
                    dt1.className += ' active';
                }
                st1.style.width = num + '%'
            } else if (step == 2) {
                dt1.className += ' active';
                delay(function() {
                    dt2.className += ' active';
                }, 400)
                st1.style.width = '100%';
                st2.style.width = num + '%'
            } else if (step == 3) {
                dt1.className += ' active';
                delay(function() {
                    dt2.className += ' active';
                    delay(function () {
                        dt3.className += ' active';
                        if (num == 100) {
                            delay(function () {
                                dt4.className += ' active'
                            }, 400)
                        }
                    }, 400)
                }, 400)
                st1.style.width = '100%';
                st2.style.width = '100%';
                st3.style.width = num + '%'
            }
        },
		
		calcuDate : function(){
			var raisebegindate = Utils.parseDate(App.storage.get("model").raisebegindate+App.storage.get("model").raisebegintime,"yyyy-MM-ddhhmmss").getTime();            
			var raiseenddate=Utils.parseDate(App.storage.get("model").raiseenddate,"yyyy-MM-dd").getTime()+86400000;         
			var interestBeginDate=Utils.parseDate(App.storage.get("model").interestBeginDate,"yyyy-MM-dd").getTime();            
			var interestEndDate=Utils.parseDate(App.storage.get("model").interestEndDate,"yyyy-MM-dd").getTime()+86400000;   
			var sysTime=Utils.parseDate(App.storage.get("model").sysTime,"yyyyMMddhhmmss").getTime();
			var dateArr = [raisebegindate,raiseenddate,interestBeginDate,interestEndDate,sysTime];
			dateArr.sort(function(a,b){
				return a-b;
			});
			
			var index = dateArr.indexOf(sysTime);
			var percent = 100*(sysTime-(index?dateArr[index-1]:dateArr[index]))/((index=="4"?dateArr[index]:dateArr[index+1])-(index?dateArr[index-1]:dateArr[index]));
			index = index>=4?3:index;
			this.setStepProgress(index, percent);
		}

	});
});