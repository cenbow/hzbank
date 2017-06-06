define(function (require, exports, module) {
	
	var GoToTransferTemplate = require("text!../template/goToTransfer.html");
	
	var GoToTransferView = module.exports = ItemView.extend({
		
        template : GoToTransferTemplate,
        
        events:{
        	"click #transfer":"Gotransfer",
        	"click #cancel":"cancel"
        },
        
        initialize : function(){
        	//初始化菜单方法
	       	 var pageStep1 = {
	       		  	title:'幸福满溢',
	       			leftButton:{
	       				name : '返回',
	       				func: 'curView.goBack()'
	       			},
	       			rightButton:{
	       				name : '',
	       				func : ''
	       			}
	       	  };
        	Client.initPageTitle(pageStep1);
        	var tranflag=App.storage.get("_parameters").tranflag;
			if(tranflag=="00"){
				$("#tranflag").text("持有7天可转");
				$("#tranflag").show();
			}else{
				$("#tranflag").text("");
				$("#tranflag").hide();
			}
        	var $this = this;
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
        	

        	
        	this.calcuDate();
    		this.circleJitter(100);
        	if(App.storage.get("_parameters")){
        		var totalAmt = Utils.formatCurrency(App.storage.get("_parameters").transferCapital,2);
            	var projectName = App.storage.get("_parameters").financeName;
        		var limitamount = App.storage.get("_parameters").limitamount;
				var raisebegindate = App.storage.get("_parameters").raisebegindate;
				var raiseenddate = App.storage.get("_parameters").raiseenddate;
				var repaymentType = App.storage.get("_parameters").repaymentType;
				var interestBeginDate = App.storage.get("_parameters").interestBeginDate;//起息日
				var interestEndDate = App.storage.get("_parameters").interestEndDate;//到期日
				var financeUseVol = App.storage.get("_parameters").financeUseVol;
				var financeTotalAmt = App.storage.get("_parameters").financeTotalAmt;
				var tranHoldDays = parseFloat(App.storage.get("_parameters").tranHoldDays);//已持有天数
				var transferCapital = parseFloat(App.storage.get("_parameters").transferCapital);//当前持有人购买的本金
				var tranRate = parseFloat(App.storage.get("_parameters").tranRate);//当前持有人收益率
				var raisebegindate1 = App.storage.get("_parameters").raisebegindate1;
				var raiseenddate1 = App.storage.get("_parameters").raiseenddate1;
				var interestBeginDate1 = App.storage.get("_parameters").interestBeginDate1;
				var interestEndDate1 = App.storage.get("_parameters").interestEndDate1;
				var raisebegintime = App.storage.get("_parameters").raisebegintime;
				raisebegintime = "  "+raisebegintime.substring(0,2)+":"+raisebegintime.substring(2,4);
				var totalIncome = Utils.formatCurrency(((tranRate*tranHoldDays*transferCapital)/36500),2);
				var todayIncome = Utils.formatCurrency(((tranRate*transferCapital)/36500),2);
				var financePreInterestRate = App.storage.get("_parameters").financePreInterestRate;
				var totalAmt1 = App.storage.get("_parameters").totalAmt;
				var preStt = App.storage.get("_parameters").preStt;
				var tranflag = App.storage.get("_parameters").tranflag;
				var redDays = App.storage.get("_parameters").redDays;
				var state = App.storage.get("_parameters").state;
				if(tranflag=="00"){//产品属性为可转
					if(preStt=="0"){//可以转让或者撤销
						//发布成功就可以撤销
						if(state=="80"){//80为转让中，撤销按钮出现
							$("#transfer").hide();
							$("#cancel").show();
						}else if(state=="20"){
							$("#transfer").show();
							$("#cancel").hide();
						}
						$("#totalIncome").text(totalIncome);
						$("#todayIncome").text(todayIncome);
						$("#totalAmt").text(totalAmt);
					}else if(preStt=="2"){//只能看不能操作
						if(state=="80"){//80为转让中，撤销按钮出现
							$("#transfer").hide();
							$("#cancel").show();
							return;
						}
						var totalIncome1 = Utils.formatCurrency((financePreInterestRate*tranHoldDays*totalAmt1)/36500,2);
						var todayIncome1 = Utils.formatCurrency(((financePreInterestRate*totalAmt1)/36500),2);
						$("#totalIncome").text(totalIncome1);
						$("#todayIncome").text(todayIncome1);
						$("#totalAmt").text(Utils.formatCurrency(totalAmt1,2));
						$("#transfer").hide();
						$("#cancel").hide();
						$("#time").show();
						$("#redDays").addClass('disabled').attr('disabled',true);
						$("#redDays").text("不可转让");
					}else{//有能转让有可能不能转让
						if(state=="80"){//80为转让中，撤销按钮出现
							$("#transfer").hide();
							$("#cancel").show();
							return;
						}
						$("#transfer").hide();
						$("#cancel").hide();
						$("#time").show();
						$("#redDays").addClass('disabled').attr('disabled',true);
						if(redDays==""){
							$("#redDays").text("不可转让");
						}else{
							$("#redDays").text("还剩"+redDays+"天可以转让");
						}
						$("#totalIncome").text(totalIncome);
						$("#todayIncome").text(todayIncome);
						$("#totalAmt").text(totalAmt);
					}
					$("#other").text("可撤单，不能预约，可转让");
				}else{
					var totalIncome1 = Utils.formatCurrency((financePreInterestRate*tranHoldDays*totalAmt1)/36500,2);
					var todayIncome1 = Utils.formatCurrency(((financePreInterestRate*totalAmt1)/36500),2);
					$("#totalIncome").text(totalIncome1);
					$("#todayIncome").text(todayIncome1);
					$("#totalAmt").text(Utils.formatCurrency(totalAmt1,2));
					$("#transfer").hide();
					$("#cancel").hide();
					$("#time").show();
					$("#redDays").addClass('disabled').attr('disabled',true);
					$("#redDays").text("不可转让");
					$("#other").text("可撤单，不能预约，不能转让");
				}
				
				
	        	$("#projectName").text(projectName);
				$("#limitamount").text(limitamount);
				$("#raisebegindate").text(raisebegindate);
				$("#raiseenddate").text(raiseenddate);
				$("#repaymentType").text(repaymentType);
				$("#interestBeginDate").text(interestBeginDate);
				$("#interestEndDate").text(interestEndDate);
				$("#financeUseVol").text(financeUseVol);
				$("#financeTotalAmt").text(financeTotalAmt);
				$("#raisebegindate1").text(raisebegindate1);
				$("#raiseenddate1").text(raiseenddate1);
				$("#interestBeginDate1").text(interestBeginDate1);
				$("#interestEndDate1").text(interestEndDate1);
				$("#raisebegintime").text(raisebegintime);
        	}
        	Client.hideWaitPanel(1);
        	$("#buy").hide();
        	$("#soldOut").show();
        	$("#percent").hide();
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
                                dt4.className += ' active';
                            }, 400);
                        }
                    }, 400);
                }, 400);
                st1.style.width = '100%';
                st2.style.width = '100%';
                st3.style.width = num + '%';
            }
        },
		
		calcuDate : function(){
			var raisebegindate = Utils.parseDate(App.storage.get("_parameters").raisebegindate+App.storage.get("_parameters").raisebegintime,"yyyy-MM-ddhhmmss").getTime();            
			var raiseenddate=Utils.parseDate(App.storage.get("_parameters").raiseenddate,"yyyy-MM-dd").getTime()+86400000;         
			var interestBeginDate=Utils.parseDate(App.storage.get("_parameters").interestBeginDate,"yyyy-MM-dd").getTime();            
			var interestEndDate=Utils.parseDate(App.storage.get("_parameters").interestEndDate,"yyyy-MM-dd").getTime()+86400000;   
			var sysTime=Utils.parseDate(App.storage.get("_parameters").sysTime,"yyyyMMddhhmmss").getTime();
			var dateArr = [raisebegindate,raiseenddate,interestBeginDate,interestEndDate,sysTime];
			dateArr.sort(function(a,b){
				return a-b;
			});
			
			var index = dateArr.indexOf(sysTime);
			var percent = 100*(sysTime-(index?dateArr[index-1]:dateArr[index]))/((index=="4"?dateArr[index]:dateArr[index+1])-(index?dateArr[index-1]:dateArr[index]));
			index = index>=4?3:index;
			this.setStepProgress(index, percent);
		},
		
		cancel : function(){//撤销
  			Client.alertinfo("您确定要撤销吗?","提示","curView.goCancel()",true);
		},
		
		goCancel : function(){
			var $this=this;
			var tranFlowNo = App.storage.get("_parameters").tranFlowNo;
			var param={
				tranFlowNo:tranFlowNo, 
			};
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/product/productTransferCancel",data:param, success:function(data){
				if(Utils.isEmpty(data.errorCode)){
					App.storage.remove("paramAccount");
					Client.alertinfo("撤销成功","提醒","curView.gotobank()");
    			}else{
					Utils.alertinfo(data.errorMessage);
				}
			},error:function(){
    			Client.hideWaitPanel(1);
    		}});
		},
		
		gotobank : function(){
			var transferFlag ="0";
			var param = {transferFlag:transferFlag};
			App.navigate("product/productCtl/saleProducts",param);
		},
		
        
        
        goBack : function(){
        	App.back();
     	},
     	
     	Gotransfer : function(){
     		var financeName = App.storage.get("_parameters").financeName;
     		var financeNo = App.storage.get("_parameters").financeNo;
     		var tranFlowNo = App.storage.get("_parameters").tranFlowNo;
			var tranRateMin = App.storage.get("_parameters").tranRateMin;//收益率下限
			var tranRateMax = App.storage.get("_parameters").tranRateMax;//收益率上限
			var tranHoldDays = App.storage.get("_parameters").tranHoldDays;//已持有天数
			var transferCapital = App.storage.get("_parameters").transferCapital;//当前持有人购买的本金
			var tranRate = App.storage.get("_parameters").tranRate;//当前持有人收益率
			var fundRestDay = App.storage.get("_parameters").fundRestDay;//当前持有人产品期限
			var param={
					financeName:financeName,
					tranRateMin:tranRateMin,
					tranRateMax:tranRateMax,
					tranHoldDays:tranHoldDays,
					transferCapital:transferCapital,
					tranRate:tranRate,
					fundRestDay:fundRestDay,
					tranFlowNo:tranFlowNo,
					financeNo:financeNo
			};
     		App.navigate("account/mycountCtl/p2pTransfer",param);
     	},
	});
});