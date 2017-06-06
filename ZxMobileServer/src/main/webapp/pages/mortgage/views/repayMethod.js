define(function(require, exports, module){
	
	var repayMethodTpl = require("text!../template/repayMethod.html");
	
	var RepayMethodView = module.exports = ItemView.extend({
		
		events : {
			"click #repayMethod":"repayMethod"
		},
		
		template : repayMethodTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			var $this = this;
			var term = App.storage.get("moneyInfo").term;
			if(term=="4年" || term=="5年"){
				$("#cicle").hide();
			}
			
			
			
			$('.payStyle .cell').off().on('click', function(){
				var cur = $(this);
				if(cur.hasClass('active')){
					
				}else{
					cur.addClass('active').siblings().removeClass('active');
				}
				if($(this).find(".loop").text()=="分期类"){
					$this.stageLoop();//分期类
				}else{
					$this.cicleLoop();//循环类
				}
			});
			var repayType = App.storage.get("moneyInfo").repayType;
			if(repayType=="401"){
				$this.cicleLoop();//循环类
				$('.payStyle .cell').eq(1).addClass('active').siblings().removeClass('active');
			}else{
				$this.stageLoop();//分期类
			}
		    Client.hideWaitPanel(1);
		},
		
		repayMethod : function(){
			App.navigate("mortgage/mortgageCtl/repayMethod");
		},
		
		
		
		stageLoop : function(){
			$("#loop1 .list-item").remove();
			var stageHtml="";
			var term = App.storage.get("moneyInfo").term;
			var money = parseFloat(App.storage.get("moneyInfo").money*10000);
			var maxMoney = parseFloat(3000000);
			var evaluationPrice = Utils.removeComma(App.storage.get("moneyInfo").evaluationPrice)*0.5;
			var arr = [money,maxMoney,evaluationPrice];
			arr.sort(function(a,b){
				return a-b;
			});
			var minMoney = arr[0];
			var rate = "";//年利率
			var monthRate = "";
			var discountRate = parseFloat(minMoney/(Utils.removeComma(App.storage.get("moneyInfo").evaluationPrice)));
			if(0.4<discountRate && discountRate<=0.5){
				monthRate = 0.55;//月利率0.55%
				rate = 0.066;
			}else if(0.3<discountRate && discountRate<=0.4){
				monthRate = 0.50;
				rate = 0.06;
			}else if(discountRate<=0.3){
				monthRate = 0.467;
				rate = 0.056;
			}
			var termNumber = "";
			if(term=="3个月"){
				termNumber="4";
			}else if(term=="6个月"){
				termNumber="7";
			}else if(term=="12个月"){
				termNumber="13";
			}else if(term=="2年"){
				termNumber="25";
			}else if(term=="3年"){
				termNumber="37";
			}else if(term=="4年"){
				termNumber="49";
			}else if(term=="5年"){
				termNumber="61";
			}
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth()+1;
			var day = date.getDate();
			var monthInterest = 0;//每月的利息
			var totalInterest = 0;//总利息
			var totalPrincipal = money;//本金
			var monthPrincipal = money*0.3/(termNumber-2);//每月需要还的本金
			
			
			for(var i=0;i<termNumber;i++){
				var monthTime = "";
				if (month == 1) {
					monthTime = year+".1.20";
				}else{
					monthTime = month+".20";
				}
				
				var dayth="";
				if(i==0){
					if ( day < 20) {
						if(month == 1){
							dayth = 20 - day;
							monthTime = year+".1.20";
						}else{
							dayth = 20 - day;
							monthTime = month+".20";
						}
					} else {
						month++;
						dayth = 20 + 30 - day;
						if(month==13){
							monthTime = year+1+".1.20";
						}else{
							monthTime = month+".20";
						}
						
					}
					var firstInterest = Utils.formatCurrency(parseFloat(totalPrincipal * dayth * rate / 360),2);
					stageHtml +='<li class="list-item">'+
			                		'<h1>' + firstInterest + '</h1>'+
			                		'<h2>当月利息<span>' + firstInterest + '</h2>'+
			                		'<i>' + monthTime + '</i>'+
			                	'</li>';
					totalInterest += parseFloat(totalPrincipal * dayth * rate / 360);
				}else if(i == termNumber-1){
					stageHtml +='<li class="list-item">'+
				            		'<h1>' + Utils.formatCurrency(parseFloat(totalPrincipal*0.7)+parseFloat(totalPrincipal*0.7*rate/12),2) + '</h1>'+
				            		'<h2>当月本金<span>' + Utils.formatCurrency(parseFloat(totalPrincipal*0.7),2) + '</h2>'+
				            		'<h2>当月利息<span>' + Utils.formatCurrency(parseFloat(totalPrincipal*0.7*rate/12),2) + '</h2>'+
				            		'<i>' + monthTime + '</i>'+
				            	'</li>';
					totalInterest += parseFloat(totalPrincipal*0.7*rate/12);
					money -= monthPrincipal;
				}else{
					monthInterest = parseFloat(money*rate/12);
					stageHtml +='<li class="list-item">'+
				            		'<h1>' + Utils.formatCurrency(parseFloat(monthPrincipal)+parseFloat(monthInterest),2) + '</h1>'+
				            		'<h2>当月本金<span>' + Utils.formatCurrency(parseFloat(monthPrincipal),2) + '</h2>'+
				            		'<h2>当月利息<span>' + Utils.formatCurrency(parseFloat(monthInterest),2) + '</h2>'+
				            		'<i>' + monthTime + '</i>'+
				            	'</li>';
					totalInterest += parseFloat(monthInterest);
					money -= monthPrincipal;
				}
				month +=1;
				if (month % 12 == 0) {
					year += month / 12;
				}
				if (month > 12) {
					month %= 12;
				}
			}
			
			$("#loop1").append(stageHtml);
			$("#stageLoop").show();
			$("#cicleLoop").hide();
			$("#totalInterest").text(Utils.formatCurrency(totalInterest,2));
			$("#monthRate").text(Utils.formatCurrency(monthRate,3));
			$("#money").text(Utils.formatCurrency(totalPrincipal+totalInterest),2);
		},
		
		cicleLoop : function(){
			$("#loop2 .list-item").remove();
			var cicleHtml="";
			var term = App.storage.get("moneyInfo").term;
			var money = App.storage.get("moneyInfo").money*10000;
			var maxMoney = parseFloat(3000000);
			var evaluationPrice = Utils.removeComma(App.storage.get("moneyInfo").evaluationPrice)*0.5;
			var arr = [money,maxMoney,evaluationPrice];
			arr.sort(function(a,b){
				return a-b;
			});
			var minMoney = arr[0];
			var rate = "";
			var monthRate = "";
			var discountRate = parseFloat(minMoney/(Utils.removeComma(App.storage.get("moneyInfo").evaluationPrice)));
			if(0.4<discountRate && discountRate<=0.5){
				monthRate = 0.575;//月利率0.55%
				rate = 0.069;
			}else if(0.3<discountRate && discountRate<=0.4){
				monthRate = 0.525;
				rate = 0.063;
			}else if(discountRate<=0.3){
				monthRate = 0.499;
				rate = 0.05988;
			}
			
			
			var termNumber = "";
			if(term=="3个月"){
				termNumber="4";
			}else if(term=="6个月"){
				termNumber="7";
			}else if(term=="12个月"){
				termNumber="13";
			}else if(term=="2年"){
				termNumber="25";
			}else if(term=="3年"){
				termNumber="37";
			}
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth()+1;
			var day = date.getDate();
			var firstInterest = "";//第一个月的利息
			var monthInterest =  money*rate/12;//每月的利息
			var totalInterest = monthInterest*(termNumber-1);//总利息
			var dayth = "";
			
			for(var i=0;i<termNumber;i++){
				var monthTime = "";
				if (month == 1) {
					monthTime = year+".1.20";
				}  else{
					monthTime = month+".20";
				}
				
				
				
				if(i==0){
					if ( day < 20) {
						if(month == 1){
							dayth = 20 - day;
							monthTime = year+".1.20";
						}else{
							dayth = 20 - day;
							monthTime = month+".20";
						}
					} else {
						month++;
						dayth = 20 + 30 - day;
						if(month==13){
							monthTime = year+1+".1.20";
						}else{
							monthTime = month+".20";
						}
					}
					firstInterest = money * dayth * rate/360;
					cicleHtml +='<li class="list-item">'+
				        		'<h1>' + Utils.formatCurrency(parseFloat(firstInterest),2) + '</h1>'+
				        		'<h2>当月利息<span>' + Utils.formatCurrency(parseFloat(firstInterest),2) + '</h2>'+
				        		'<i>' + monthTime + '</i>'+
				        	'</li>';
				}else if(i == termNumber - 1){
					cicleHtml +='<li class="list-item">'+
				            		'<h1>' + Utils.formatCurrency(parseFloat(money)+parseFloat(monthInterest),2) + '</h1>'+
				            		'<h2>本金<span>' + Utils.formatCurrency(parseFloat(money),2) + '</h2>'+
				            		'<h2>当月利息<span>' + Utils.formatCurrency(parseFloat(monthInterest),2) + '</h2>'+
				            		'<i>' + monthTime + '</i>'+
				            	'</li>';
				}else{
					cicleHtml +='<li class="list-item">'+
				            		'<h1>' + Utils.formatCurrency(parseFloat(monthInterest),2) + '</h1>'+
				            		'<h2>当月利息<span>' + Utils.formatCurrency(parseFloat(monthInterest),2) + '</h2>'+
				            		'<i>' + monthTime + '</i>'+
				            	'</li>';
				}
				month +=1;
				if (month % 12 == 0) {
					year += month / 12;
				}
				if (month > 12) {
					month %= 12;
				}
			}
			$("#loop2").append(cicleHtml);
			$("#stageLoop").hide();
			$("#cicleLoop").show();
			$("#totalInterest2").text(Utils.formatCurrency((totalInterest+firstInterest),2));
			$("#monthRate2").text(Utils.formatCurrency(monthRate,3));
			$("#money2").text(Utils.formatCurrency(money+totalInterest+firstInterest),2);
			
		},
		
		goBack : function(){
			var termLoop = $('.payStyle .active .box').find('.loop').text();
			var termLoopInfo ={termLoop:termLoop};
			App.storage.set("termLoopInfo",termLoopInfo);
			App.back();
		}
	
	});
});
