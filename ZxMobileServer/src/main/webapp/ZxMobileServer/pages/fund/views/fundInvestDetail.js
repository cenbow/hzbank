define(function (require, exports, module) {
	
	var fundInvestDetailTemplate = require("text!../template/fundInvestDetail.html");
	
	var FundInvestDetailView = module.exports = ItemView.extend({
		
		template : fundInvestDetailTemplate,
		
		events:{
			"click #investUpdateBtn" : "toInvest",
			"click #investStopBtn" : "investStopBtn",
			"click #hidePwdBox" : "hidePwdBox",
			"click #goFundDetailPage" : "goFundDetailPage",
			"click #pwd" : "password1",
		},
		
		initialize : function(){
			var pageStep1 = {
        		title:'定投详情',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        	
        	};

//			this.pwd = "";
//    		this.pwdKey = "";
        	Client.initPageTitle(pageStep1);
        	
        	var param =App.storage.get("_parameters");
        	this.init(param);
        	this.fundHisDealQuery();
        	
		},
		
		init : function(param){ 
			$("#fundName").html(param.fundName+"<span class='ft13 fc-9'>("+param.fundCode+")</span>");
        	$("#cardNo").text("扣款账户:"+Utils.formatAcc(Utils.getEleCard().cardNo)+"(电子账户)");
        	 var Span=param.Span;//扣款周期数
 		    var Period=param.Period;//扣款周期单位(月0,周1,日2)
 		    var investDay=param.investDay;//扣款日期(月:1-28日,周:周1-5,日:每日)
 		   var fundAmt=Utils.formatCurrency(param.fundAmt,2);
		    fundAmt=fundAmt.substring(0,fundAmt.indexOf("."));
 		    var overFlag =param.overFlag;//终止模式(1,结束日期  0,投资期数  2,成功期数)
 		   var EndDate;
 		    if(("EndDate") in param){
 		    	EndDate=param.EndDate;
 		   }else{
 			  EndDate=param.endDate1;
 		   }
 		   EndDate=Utils.formatDate(EndDate,'yyyyMMdd','yyyy-MM-dd');
 		    if(Period=='0'){
        		if(Span=='1'){
        			$("#investDay").text("每月"+investDay+"日:");
        		}else if(Span=='2'){
        			$("#investDay").html("每两月 "+investDay+"日:");
        		}
			}else if(Period=='1'){
				investDay=this.weeks(investDay);
				if(Span=='1'){
					$("#investDay").html("每周 "+investDay+":");
        		}else if(Span=='2'){
        			$("#investDay").html("每两周 "+investDay+":");
        		}
			}else if(Period=='2'){
				$("#investDay").html("每日:");
			}
 		   $("#fundAmt").text(fundAmt+"元");
 		   $("#totalTimes").html("<span class='fc-9' >已投期数：</span>"+param.totalTimes);
 		   if(overFlag=='1'){
 			  $("#overFlag").html("<span class='fc-9'>终止模式：</span>到"+EndDate+"终止");
 		   }else if(overFlag=='0'){
 			  $("#overFlag").html("<span class='fc-9'>终止模式：</span>投资"+param.investTimes+"期终止");
 		   }else if(overFlag=='2'){
 			  $("#overFlag").html("<span class='fc-9'>终止模式：</span>成功"+param.investTimes+"期终止");
 		   }
 		   var NextInvestDate=Utils.formatDate(param.NextInvestDate,'yyyyMMdd','yyyy-MM-dd');
 		   $("#NextInvestDate").html("定投记录(<span class='fc-9'>下次扣款:</span>"+NextInvestDate+")");
		},
		
		weeks : function(date){
			switch(date){
				case '01':
					return "周一";
					break;
				case '02':
					return "周二";
					break;
				case '03':
					return "周三";
					break;
				case '04':
					return "周四";
					break;
				case '05':
					return "周五";
					break;
				case '1':
					return "周一";
					break;
				case '2':
					return "周二";
					break;
				case '3':
					return "周三";
					break;
				case '4':
					return "周四";
					break;
				case '5':
					return "周五";
					break;
				default:
					return "未知";
					break;
			}
		},
		
		 fundHisDealQuery: function(){
	        	Client.openWaitPanel("加载中...");
	        	var fundCode=App.storage.get("_parameters").fundCode;
	        	var cardNo = Utils.trim(Utils.getCardNoByFlag("0","cardFlag1"));
	        	var beginDate =Utils.getDifferentMonth(-24,"yyyyMMdd");
	        	var endDate =Utils.getServerDate("yyyyMMdd");
	        	var $this = this;
	    		var param2 = {
	    				cardNo:cardNo,
	    				beginDate:beginDate,
	    				endDate:endDate,
	    				TACode:"",
	    				turnPageBeginPos:"1",
	    				turnPageShowNum:"1000",
	    				pageFlag:"0",
	    		};
	    		Ajax({url:"/fund/fundHisDealQuery",data:param2, success:function(data){
	    			if(MUI.isEmpty(data.errorCode)){
	    				var count=0;//统计定投记录条数
	    				var totalInvest=0;//累计定投金额
	    				var icoll = data.iFundDealInfo;
	    				for(var len=0;len<icoll.length;len++){
	    					var kcoll = icoll[len];
							var fundCodeHis=Utils.trim(kcoll.fundCode);
							var busiName=kcoll.busiName;
							if(fundCodeHis==fundCode && busiName=="定时定额投资"){
								$this.addRow("investRecord",kcoll);
								totalInvest+=parseFloat(kcoll.cfmAmt);
								count++;
							}
						}
	    				$("#totalInvest").html("<span class='fc-9'>累计定投：</span>"+Utils.formatCurrency(totalInvest,2)+"元");
	    				if(count==0){
	    					$("#investRecord").hide();
	    					$('#noData').show();
	    				}else{
	    					$('#noData').hide();
	    					$("#investRecord").show();
	    				}
	    				Client.hideWaitPanel(1);
	    			}else{
	    				Client.alertinfo(data.errorMessage,"提醒");
	    				Client.hideWaitPanel(1);
	    			}
	    		}});
	        },
		
	     addRow : function(id,kcoll){
	        	var cfmDate=Utils.formatDate(kcoll.cfmDate,'yyyyMMdd','yyyy-MM-dd');
	        	var html='<div class="list-item row">'+
			            	'<div class="cell">'+cfmDate+'</div>'+
			                '<div class="cell">'+kcoll.cfmAmt+'元</div>'+
			                '<div class="fc-orange">定投成功</div>'+
			            '</div>';
	        	$("#"+id).append(html);
	        	
	        },   
		
		toInvest:function(){
			var kcoll = App.storage.get("_parameters");
			App.storage.set("iEFundBaseinfo",kcoll);
			App.navigate("fund/fundCtl/fundTimeInvest",{iEFundBaseinfo:kcoll});
		},
		
		goFundDetailPage:function(){//跳转基金详情页
			var fundName = App.storage.get("_parameters").fundName;
			var param = {
					taCode:"00",
					fundName:fundName,
					fundType:"",
					fundSellState:"0",
					resultSort:"30",
					turnPageBeginPos:"1",
					turnPageShowNum:"1",
					actionFlag:""
			};
			var $this = this;
			Ajax({url:"/fund/fundQuery",data:param,success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var icoll = data.iFundInfo;
					var kcoll =icoll[0];
					App.storage.set("iEFundBaseinfo",kcoll);
					App.navigate("fund/fundCtl/fundDetaill",{iEFundBaseinfo:kcoll});
					Client.hideWaitPanel(1);
				}else{
					Client.alertinfo(data.errorMessage,"提醒");
					Client.hideWaitPanel(1);
				}
			},error:function(){
				Client.hideWaitPanel(1);
			}});
		},
		
		hidePwdBox :function(){
			$("#pwdText").hide();
		},
		
		
		investStopBtn :function(){
			if(pubParam.clientVersion <= "3.0.8"){
				$("#pwdText").show();
				// 设置密码框动态高度
				var iptRow = $('.tradePswd .row');
				var ht = iptRow.width()/6;
				iptRow.css({
					height: ht + 'px',
					lineHeight: ht + 'px'
				});
				$("#pwd").focus();
				this.password1();
			}else{
				//新版本有客户端输入交易密码
				Client.setTransPwd("1",'请输入您的杭银直销交易密码','','curView.getPassword');
			}
			
			
		},
		
        fixL : function(n){
			n > 6 ? n = 6 : null;
			for(var i = 0; i<6; i++){
				i+1 > n ? 
				$('.tradePswd .cell').eq(i).removeClass('active') :
				$('.tradePswd .cell').eq(i).addClass('active');
			}
		}, 
  	   password1 : function(){
//		   Utils.focusPosition($("#pwd").parent());
			var opt = {
				 elem:"#pwd",//当前对像
				 type:'number',//text 字母与数字 number数字键盘
				 max:'6',
				 callback:'curView.savePassword',
				 confirm:'1'
			 };
			 Client.showPwdPicker(opt);
				 
       },
       savePassword : function(data){
    	 this.pwd = data.pwd;
    	 this.pwdKey = data.pwdKey;
		 this.pwdDeal();
		 this.doSubmit();
       },
       
       getPassword : function(obj){
    	   this.pwd = obj.pwd;
      	 	this.pwdKey = obj.pwdKey;
//      	 	this.dosubmit();
      	 	this.confirmback();
       },
       
		pwdDeal:function(){
			var me = $("#pwd");	
			var s = me.val();
			s.length > 6 ? s = s.substring(0, 6) : null;
			me.val(s);	
			this.fixL(s.length);
		},

		 //提交
        doSubmit : function(){ //为提交按钮绑定提交事件
            var password=$("#pwd").val();
            if(!Utils.isEmpty(password)&&password.length==6){     	   
    			this.confirmback();
            }
		},
		confirmback : function(){
    	    var $this=this;
			Client.pwdHide("");
			if(MUI.isEmpty(this.pwd)){
		    	Utils.alertinfo("交易密码不能为空");	
		    	return;
			};
			
			var fundCode=App.storage.get("_parameters").fundCode;
			var SerialNo=App.storage.get("_parameters").SerialNo;
			var cardNo = Utils.getEleCard().cardNo;
  			var accountType = Utils.getEleCard().accountType;
			var param={
					cardNo:cardNo, 
					accountType:accountType,
					password:this.pwd, 
					pwdkey:this.pwdKey,
					fundCode:fundCode,
					SerialNo:SerialNo,
				};
				Client.openWaitPanel("拼命加载中，请稍候");
				Ajax({url:"/fund/fundDateCancel",data:param, success:function(data){//定投终止
					if(Utils.isEmpty(data.errorCode)){
						$this.clearPwd();
						App.navigate("fund/fundCtl/fundInvestManagement");
						Utils.alertinfo("定投终止成功！");
						Client.hideWaitPanel(1);
					}else{
						$this.clearPwd();
						$this.hidePwdBox();
						Utils.alertinfo("定投终止失败！");
	    				Client.hideWaitPanel(1);
	    			}
					
				},error:function(){
					$this.clearPwd();
					Client.hideWaitPanel(1);
	    		}});
			
  		},
	   clearPwd : function(){
	  	 $("#pwd").val("");
	  	 this.pwdDeal();
	  	this.pwdKey = null;
		this.pwd = null;
		 Client.loadPwdKey();
   		},
		
    	
    	Cancel:function(){
    		$("#investUpdate").removeClass('disabled').removeAttr('disabled');
    		$("#investStopBtn").addClass('white').removeClass('disabled').removeAttr('disabled');
    	},
		
		goBack : function(){
        	App.back();
    	},
	});
});