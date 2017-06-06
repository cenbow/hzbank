define(function (require, exports, module) {
	require("../../../scripts/components/allPicker");
	var fundTimeInvestTemplate = require("text!../template/fundTimeInvest.html");
	var FundTimeInvestView = module.exports = ItemView.extend({
		
		template : fundTimeInvestTemplate,
		
		events:{
			"click #sureInvest" : "sureInvest",
			"click #pwd" : "showPwd",
			"click #successReturn" : "gotofundInvestList",
        	"click #errorReturn" : "gotoBack",
		},
		
		initialize : function(){
			this.investParam={};
			this.cacheData={};
			this.day=[];
        	this.week=[];
        	this.month=[];
        	this.cycleData=[];
			var pageStep1 = {
        		title:'定投',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        		
        	};

			this.areaPicker="";
        	
        	Client.initPageTitle(pageStep1);
        	Client.hideWaitPanel(1);
        	$("#cardNo").text(Utils.formatAcc(Utils.getEleCard().cardNo));
        	var cardNo = Utils.getEleCard().cardNo;//获取电子账号
  			var accountType = Utils.getEleCard().accountType;//获取电子账号类型
    		if (Utils.isInteger(cardNo)) {
    			Utils.queryCommBalance(cardNo,accountType);//查询余额
    		};
    		this.cacheData=App.storage.get("iEFundBaseinfo");
    		
    		if(this.cacheData.hasOwnProperty("Span")){
    			this.initUpdate(this.cacheData);
    		}
    		
    		this.fundFeeQuery();
    		this.investCycle();
    		this.terminMode();
    		this.date();
    		this.period();
    		this.fundDateAdmQuery();
    		
    		
        },
        
        initUpdate : function(param){
        	$("#inputMoney").val(parseInt(param.fundAmt));
        	var Span=param.Span;
        	var Period=param.Period;
        	var investDay=param.investDay;
        	if(Period=='0'){
        		this.investParam.Span=Span;
        		this.investParam.investDay=investDay;
        		this.investParam.Period=Period;
        		if(Span=='1'){
        			$("#investCycle").text("每月"+investDay+"日");
        		}else if(Span=='2'){
        			$("#investCycle").text("每两月 "+investDay+"日");
        		}
			}else if(Period=='1'){
				this.investParam.Span=Span;
				this.investParam.investDay=investDay;
				this.investParam.Period=Period;
				if(Span=='1'){
					investDay=this.weeks(investDay);
					$("#investCycle").text("每周 "+investDay);
        		}else if(Span=='2'){
        			investDay=this.weeks(investDay);
        			$("#investCycle").text("每两周 "+investDay);
        		}
			}else if(Period=='2'){
				$("#investCycle").html("每日");
				this.investParam.Span="1";
				this.investParam.investDay="1";
				this.investParam.Period=Period;
			}
        	
				
        	var terminMode=param.overFlag;
        	if(terminMode=='1'){
   			  $("#terminMode").text("按结束日期终止");
   		   }else if(terminMode=='0'){
   			  $("#terminMode").text("按投资期数终止");
   		   }else if(terminMode=='2'){
   			  $("#terminMode").text("按成功期数终止");
   		   }
        	var investTimes=param.investTimes;
        	if(terminMode=='1'){
        		$("#showDate2").hide();
				$('#showDate1').show();
        		$('#terminModeText1').text("结束日期");
   		   }else if(terminMode=='0'){
   			   $("#showDate1").hide();
			   $('#showDate2').show();
   			   $('#terminModeText2').text("投资期数");
	    	   $('#date2').text(investTimes+"(可随时终止)");
   		   }else if(terminMode=='2'){
   			   $("#showDate1").hide();
			   $('#showDate2').show();
	   		   $('#terminModeText2').text("成功期数");
	    	   $('#date2').text(investTimes+"(可随时终止)");
   		   }
        	
        },

        fundDateAdmQuery: function(){//定投查询
			Client.openWaitPanel("加载中...");
			var cardNo =Utils.getEleCard().cardNo;
			var $this =this;
			var param1 = {
	 				cardNo:cardNo,
	 				turnPageBeginPos:"1",
	 				turnPageShowNum:"1000",
	 				pageFlag:"0"//翻页时动态
	 		};
	 		Ajax({url:"/fund/fundDateAdmQuery",data:param1, success:function(data){//查询
	 			if(MUI.isEmpty(data.errorCode)){
	 				var icoll = data.iFundInvestinfo;
 					App.storage.set("iFundInvestinfoList",icoll);
 					Client.hideWaitPanel(1);
	 			}else{
	 				Client.alertinfo(data.errorMessage,"提醒");
	 				Client.hideWaitPanel(1);
	 			}
	 		},error:function(){
    			Client.hideWaitPanel(1);
    		}});
		},
        
        fundFeeQuery:function(){//费率查询
			var fundCode=App.storage.get("iEFundBaseinfo").fundCode;
			var tacode=App.storage.get("iEFundBaseinfo").TACode;
			
			var $this = this;
    		var param1 = {
    				fundCode :fundCode,
    				turnPageBeginPos:"1",
    				turnPageShowNum:"100",
    				tacode:tacode
    		};
    		Ajax({url:"/fund/fundFeeQuery",data:param1, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var icoll = data.iFundFeeinfo;
    				$this.queryPubApparShowMsg(icoll);
    			}else{
    				Client.alertinfo(data.errorMessage,"提醒");
    				Client.hideWaitPanel(1);
    			}
    		},
    		error:function(){
    			Client.hideWaitPanel(1);
    		}
    		});
		},
		
		queryPubApparShowMsg :function(icoll){//查询公共参数（关于基金折扣）
			var param1 = {
				 aprCode:"FUND_FEE_DISCOUNT",
				 aprValue:"2"
    		};
    		Ajax({url:"/pubServer/queryPubApparShowMsg",data:param1, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var aprShowMsg = data.aprShowMsg;
    				var fundRateTemp=0;
    				for(var len=0;len<icoll.length;len++){
						var kcoll = icoll[len];
						var fundRate =kcoll.fundRate;
						if(len==0){
							fundRateTemp=fundRate;
						}
						if(fundRate>fundRateTemp){
							fundRateTemp=fundRate;
						}
					}
    				if(fundRateTemp==""){
    					$("#fundFee").text('');
    					$("#fundFeeDisCount").text('无申购费');
    				}else{
    					$("#fundFee").text(Utils.toRetentionDigit(fundRateTemp*100,2)+'%');
    					$("#fundFeeDisCount").text(Utils.toRetentionDigit(fundRateTemp*aprShowMsg*100,2)+'%');
    				}
    			}else{
    				Client.alertinfo(data.errorMessage,"提醒");
    				Client.hideWaitPanel(1);
    			}
    		},
    		error:function(){
    			Client.hideWaitPanel(1);
    		}});	
		},
        
        investCycle:function(){//定投周期
        	var $this=this;
        	this.day=[{value:"1",text:"每日"}];
        	this.week=[{value:"1",text:"周一"},
				        {value:"2",text:"周二"},
				        {value:"3",text:"周三"},
				        {value:"4",text:"周四"},
				        {value:"5",text:"周五"}];
        	for(var i=1;i<=28;i++){
        		var monthValue = i;
				var monthText = i+"日";
				var arr={
						"value":monthValue,
						"text":monthText,
				};
				this.month.push(arr);
        	}
        	this.cycleData=[
							{value:"11",text:"每周",children:this.week},
							{value:"21",text:"每两周",children:this.week},
							{value:"10",text:"每月",children:this.month},
							{value:"20",text:"每两月",children:this.month},
							{value:"12",text:"每日",children:this.day}
							 ];
        	$('#showInvestCycle').on('tap', function(event) {
        		this.areaPicker= new $.PopPicker({
        			layer: 2
        		});
        		this.areaPicker.setData($this.cycleData);
        		this.areaPicker.show(function(items) {
					if(items[0].text=="每日"){
						$this.investParam.Span="1";
						$this.investParam.Period="2";
						$this.investParam.investDay="1";
						$('#investCycle').text(items[0].text);
					}else{
						$this.investParam.Span=(items[0].value).substr(0,1);
						$this.investParam.Period=(items[0].value).substr(-1);
						$this.investParam.investDay=items[1].value;
						$('#investCycle').text(items[0].text+" "+items[1].text);
					}  
				  });
			  });
        	
        },
        
        terminMode:function(){//终止模式
        	var $this =this;
        	var mode=[{value:"mode01",text:"按结束日期终止"},
				        {value:"mode02",text:"按投资期数终止"},
				        {value:"mode03",text:"按成功期数终止"}];
        	$('#showTerminMode').on('tap', function(event) {
        		this.areaPicker= new $.PopPicker({
        			layer: 1
        		});
        		this.areaPicker.setData(mode);
        		this.areaPicker.show(function(items) {
        			var oDate =new Date();
        		    var year=oDate.getFullYear();
        		    var month =oDate.getMonth()+1;
        		    month=(month<10?'0':'')+month;
        		    var days =oDate.getDate();
        		    days =(days<10?'0':'')+days;
        		    
					  $('#terminMode').text(items[0].text);
					  if($('#terminMode').text()=="按结束日期终止"){//默认日期
						  $("#showDate2").hide();
						  $('#showDate1').show();
						  $('#terminModeText1').text("结束日期");
						  if(year%4==0 && year%100!=0 || year%400==0){
							  if(month==02 && day==29){
								  $('#date1').text(year+5+"-03-01(可随时终止)");
								  $this.investParam.endDate1=year+5+"0301";
							  }
						  }else{
							  $('#date1').text(year+5+"-"+month+"-"+days+"(可随时终止)");
							  $this.investParam.endDate1=year+5+month+days;
						  }
						  $this.investParam.overFlag="1";
						  $this.investParam.investTimes="";
					   }else if($('#terminMode').text()=="按投资期数终止"){//默认期数
						   $("#showDate1").hide();
						   $('#showDate2').show();
						   $('#terminModeText2').text("投资期数");
						   $('#date2').text("100(可随时终止)");
						   $this.investParam.overFlag="0";
						   $this.investParam.investTimes="100";
						   $this.investParam.endDate1="";
					  }else if($('#terminMode').text()=="按成功期数终止"){
						   $("#showDate1").hide();
						   $('#showDate2').show();
						   $('#terminModeText2').text("成功期数");
						   $('#date2').text("100(可随时终止)");
						   $this.investParam.overFlag="2";
						   $this.investParam.investTimes="100";
						   $this.investParam.endDate1="";
					  }
				  });
			  });
        	
        },
        
        date:function(){//日期
        	this.year=[];
        	this.months=[];
        	this.days=[];
        	var yearValue="";
        	var monthValue="";
        	var dayValue="";
        	var $this=this;
        		 var oDate =new Date();
        		 var year=oDate.getFullYear();
        		if(this.cacheData.hasOwnProperty("Span")){
        			$("#date1").text(Utils.formatDate(this.cacheData.EndDate,'yyyyMMdd','yyyy-MM-dd')+"(可随时终止)");
            		$this.investParam.endDate1=this.cacheData.EndDate;
        		}else{
        			var month =oDate.getMonth()+1;
        			month=(month<10?'0':'')+month;
        			var days =oDate.getDate();
        			days =(days<10?'0':'')+days;
        			if(year%4==0 && year%100!=0 || year%400==0){
        				if(month==02 && days==29){
        					$('#date1').text(year+5+"-03-01(可随时终止)");
        					$this.investParam.endDate1=year+5+"0301";
        				}
        			}else{
        				$('#date1').text(year+5+"-"+month+"-"+days+"(可随时终止)");
        				$this.investParam.endDate1=year+5+month+days;
        			}
        		}
        		 $this.investParam.overFlag="1";
				  $this.investParam.investTimes="";
        		 for(var i=1;i<=28;i++){
        			 dayValue = i;
        			 var dayText = i;
        			 dayText=(dayText<10?'0':'')+dayText;
        			 var arr={
        					 "value":dayValue,
        					 "text":dayText,
        			 };
        			 this.days.push(arr);
        		 }
        		 for(var i=1;i<=12;i++){
        			 monthValue = i;
        			 var monthText = i;
        			 monthText=(monthText<10?'0':'')+monthText;
        			 var arr={
        					 "value":monthValue,
        					 "text":monthText,
        					 "children":this.days
        			 };
        			 this.months.push(arr);
        			 
        		 }
        		 for(var i=year;i<=year+30;i++){
        			 yearValue = i;
        			 var yearText = i;
        			 var arr={
        					 "value":yearValue,
        					 "text":yearText,
        					 "children":this.months
        			 };
        			 this.year.push(arr);
        		 }
        		 $('#showDate1').on('tap', function(event) {
        			 this.areaPicker= new $.PopPicker({
             			layer: 3
             		});
        			 this.areaPicker.setData($this.year);
        			 this.areaPicker.show(function(items) {
        				 $('#date1').text((items[0] || {}).text + "-" + (items[1] || {}).text + "-" + (items[2] || {}).text+"(可随时终止)");
        				 $this.investParam.endDate1=(items[0] || {}).text +(items[1] || {}).text +(items[2] || {}).text;
        				 $this.investParam.overFlag="1";
       				  	$this.investParam.investTimes="";
        			 });
        		 });
        },
        
        period:function(){//期数
        	this.periods=[];
        	var $this=this;
        	for(var i=10;i<=500;i=i+10){
					var periodValue = i;
					var periodText = i;
					var arr={
							"value":periodValue,
							"text":periodText,
					};
					this.periods.push(arr);
				}
        	if($('#terminMode').text()=="按投资期数终止"){//默认期数
        		$this.investParam.endDate1="";
        		$this.investParam.overFlag="0";
        		if(this.cacheData.hasOwnProperty("Span")){
        			var investTimes=$("#date2").text();
        			investTimes =investTimes.substring(0,investTimes.length-7),
        			$this.investParam.investTimes=investTimes;//修改时读取期数
        		}else{
        			$this.investParam.investTimes="100";
        		}
  			}else if($('#terminMode').text()=="按成功期数终止"){
  				$this.investParam.endDate1="";
  				$this.investParam.overFlag="2";
  				if(this.cacheData.hasOwnProperty("Span")){
  					var investTimes=$("#date2").text();
        			investTimes =investTimes.substring(0,investTimes.length-7),
  					$this.investParam.investTimes=investTimes;
        		}else{
        			$this.investParam.investTimes="100";
        		}
  			} 
        	$('#showDate2').on('tap', function(event) {
        		this.areaPicker= new $.PopPicker({
         			layer: 1
         		});
        		this.areaPicker.setData($this.periods);
        		this.areaPicker.show(function(items) {
          			$('#date2').text(items[0].text+"(可随时终止)");
          			if($('#terminMode').text()=="按投资期数终止"){
          				$this.investParam.endDate1="";
          				$this.investParam.overFlag="0";
          				$this.investParam.investTimes=items[0].value;
          			}else if($('#terminMode').text()=="按成功期数终止"){
          				$this.investParam.endDate1="";
          				$this.investParam.overFlag="2";
          				$this.investParam.investTimes=items[0].value;
          			}
          		});
         	 });
        },
        
        sureInvest: function(){//提交
        	var $this=this;
        	if($("#sureInvest").hasClass("disabled")){
    			return;
    		}
			var fundAmt=$("#inputMoney").val();
			var cardNo = Utils.getEleCard().cardNo;
  			var accountType = Utils.getEleCard().accountType;
	        var fundName=App.storage.get("iEFundBaseinfo").fundName;
	        var fundCode=App.storage.get("iEFundBaseinfo").fundCode;
	        var showBalanceSpan=Utils.removeComma(document.getElementById("showBalanceSpan").innerHTML);
	        
	        if(!Utils.checkAmount(fundAmt)){
    			return false;
    		}
  			
	        if(!Utils.isInteger(fundAmt)){
				Utils.alertinfo("请输入非小数格式的金额！");
				return false;
			}
	        
  			if($("#investCycle").text()=="请选择"){
  				Utils.alertinfo("请选择定投周期！");
  				return false;
  			}
  			
  			if(!$this.pwd||!$this.pwdKey){
  				if(	$('.ui-view').attr('data-position')!=0){
	     			return;
	     		}
  				Utils.alertinfo("请输入正确交易密码！");
    			return false;
    		}
  			
  			fundAmt=parseFloat(fundAmt);
  			var investOpenparam={
					cardNo:cardNo, 
					accountType:accountType,
					fundAmt:fundAmt,
					password:this.pwd, 
					pwdkey:this.pwdKey,
					TACode:"00",
					TAName:"",
					fundCode:fundCode,
					fundName:fundName,
					overFlag:$this.investParam.overFlag,//0,投资期数;1,结束日期;2,成功期数
					investTimes:$this.investParam.investTimes,
					endDate1:$this.investParam.endDate1,
					Span:$this.investParam.Span,
					Period:$this.investParam.Period,//0,月;1周;2日
					investDay:$this.investParam.investDay,
					mgrNo:"",
				};
  			var investUpdateparam={
					cardNo:cardNo, 
					accountType:accountType,
					fundAmt:fundAmt,
					password:this.pwd, 
					pwdkey:this.pwdKey,
					fundCode:fundCode,
					fundName:fundName,
					overFlag:$this.investParam.overFlag,//0,投资期数;1,结束日期;2,成功期数
					investTimes:$this.investParam.investTimes,
					endDate1:$this.investParam.endDate1,
					Span:$this.investParam.Span,
					Period:$this.investParam.Period,//0,月;1周;2日
					investDay:$this.investParam.investDay,
					mgrNo:"",
					fundAgio:$this.cacheData.fundAgio,
					StartInvestDate:"",
					SerialNo:$this.cacheData.SerialNo,
				};
        	if(App.browseList[1].indexOf("fundInvestDetail")>=0){//判断是定投开通还是定投修改
        		$this.investUpdate(investUpdateparam);
			}else{
				$this.investOpen(investOpenparam);
			}
    	},
        
        investOpen : function(param){//定投开通
        		var $this=this;
        		Client.openWaitPanel("拼命加载中，请稍候");
        		var icoll=App.storage.get("iFundInvestinfoList");
     			var fundCodeOld="";//已发起定投的基金代码
     	        for(var len=0;len<icoll.length;len++){
     				var kcoll = icoll[len];
     				fundCodeOld=kcoll.fundCode;
     				if(fundCodeOld==param.fundCode){
     					Client.alertinfo("亲，这款基金您已提交定投开通，请前往修改！","提示","curView.toUpdate()",true);
     					Client.hideWaitPanel(1);
     					return;
     				}
     			}
				Ajax({url:"/fund/fundTimeInvest",data:param, success:function(data){//定投开通
					try{
					if(Utils.isEmpty(data.errorCode)){
						$this.succPage(data);
						
						$this.initPageSucc();
						Client.hideWaitPanel(1);
						$this.clearPwd();
					}else{
	    				Utils.alertinfo(data.errorMessage);
	    				Client.hideWaitPanel(1);
	    				$this.clearPwd();
	    				return;
	    			}
					}catch(e){
						alert(e);}
					
				},error:function(){
    				$this.initPageError();
					Client.hideWaitPanel(1);
	    			$this.clearPwd();
	    		}});
        },
        
        toUpdate : function(){//跳转定投详情
        	App.navigate("fund/fundCtl/fundInvestManagement");
		},
        
        succPage : function(data){
        	var $this=this;
        	$("#fundNameSucc").html("<i></i>"+data.fundName+"<span class='ft12 fc-9' >("+data.fundCode+")</span>");
			$("#fundAmtSucc").text(Utils.formatCurrency(data.fundAmt,2));
			var Span=$this.investParam.Span;//扣款周期数
 		    var Period=$this.investParam.Period;//扣款周期单位(月0,周1,日2)
 		    var investDay=$this.investParam.investDay;//扣款日期(月:1-28日,周:周1-5,日:每日)
			if(Period=='0'){
	        		if(Span=='1'){
	        			$("#investDaySucc").text("每月"+investDay+"日");
	        		}else if(Span=='2'){
	        			$("#investDaySucc").text("每两月 "+investDay+"日");
	        		}
				}else if(Period=='1'){
					investDay=$this.weeks(investDay);
					if(Span=='1'){
						$("#investDaySucc").text("每周 "+investDay);
	        		}else if(Span=='2'){
	        			$("#investDaySucc").text("每两周 "+investDay);
	        		}
				}else if(Period=='2'){
					$("#investDaySucc").text("每日");
				}
			$("#cardNoSucc").text(Utils.formatAcc(Utils.getEleCard().cardNo));
        },
        
        investUpdate : function(param){//定投修改
        		var $this=this;
        		Client.openWaitPanel("拼命加载中，请稍候");
				Ajax({url:"/fund/fundDateModify",data:param, success:function(data){//定投开通
					if(Utils.isEmpty(data.errorCode)){
						$this.succPage(data);
						
						$this.initPageSucc();
						Client.hideWaitPanel(1);
						$this.clearPwd();
					}else{
	    				Utils.alertinfo(data.errorMessage);
	    				Client.hideWaitPanel(1);
	    				$this.clearPwd();
	    				return;
	    			}
					
				},error:function(){
					$("#investOpenError").hide();
		        	$("#investUpdateError").show();
    				$this.initPageError();
					Client.hideWaitPanel(1);
	    			$this.clearPwd();
	    		}});
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
        
        initPageSucc : function(){//成功结果页面
        	var pageStep = {
            		title:"定投结果",
            		leftButton:{
            			name : '返回',
            			func: 'curView.gotoBack()'
            		}
            		
            	};

        	Client.initPageTitle(pageStep);
			this.showPage(2);
			Client.hideWaitPanel(1);
    	},
    	
    	initPageError : function(){//失败结果页面
        	var pageStep = {
            		title:"定投结果",
            		leftButton:{
            			name : '返回',
            			func: 'curView.gotoBack()'
            		}
            		
            	};

        	Client.initPageTitle(pageStep);
        	this.showPage(3);
    	}, 

    	//控制页面显示
    	showPage : function(num){
    		for(var i=1;i<=3;i++){
    			if(i==num){
    				$("#fundSignPage"+i).show();
    			}else{
    				$("#fundSignPage"+i).hide();
    			}
    		}
    	},
        
        //去充值
		toPay : function(){
			App.navigate("transfer/transferCtl/recharge");
		},
        
        showPwd : function(){
			Utils.focusPosition($("#pwd").parent());
			var opt = {
				elem:"#pwd",//当前对像
				type:'number',//text 字母与数字 number数字键盘
				max:'6',
				callback:'curView.savePassword'
			};
			Client.showPwdPicker(opt);//显示安全键盘
		},
		
		savePassword : function(obj){
			this.pwd = obj.pwd;
			this.pwdKey = obj.pwdKey;
			this.formValidate();
		},
		
		clearPwd : function(){
    		$("#pwd").val("");
    		this.pwdKey = null;
    		this.pwd = null;
			Client.loadPwdKey();//通知重载随机数
			this.formValidate();
    	},
    	
    	formValidate:function(){
    		var purchaseAmt	= $("#inputMoney").val();
    		var investCycle	= $("#investCycle").text();
    		if(purchaseAmt && investCycle!="请选择" && this.pwd && this.pwdKey && $("#pwd").val().length>=6){
    			$("#sureInvest").removeClass("disabled");
    		}else{
    			$("#sureInvest").addClass("disabled");
    		}
    	},
    	
    	gotofundInvestList: function(){//成功页按钮 跳转定投管理
			App.navigate("fund/fundCtl/fundInvestManagement");
    	},
		
		goBack : function(){
			$(".ui-poppicker").hide();
			$(".ui-backdrop").hide();
			if(App.browseList[1].indexOf("fundSign")>=0){//
				App.back(3);
			}else if(App.browseList[1].indexOf("fundInvestDetail")>=0){
				App.back();
			}else{
				App.back();
			}
    	},
    	
    	gotoBack : function(){
    		if(App.browseList[2].indexOf("fundSign")>=0){//
				App.back(4);
			}else if(App.browseList[3].indexOf("fundInvestManagement")>=0){
				App.back(3);
			}else if(App.browseList[1].indexOf("fundInvestDetail")>=0){
				App.back(2);
			}else{
				App.back(2);
			}
    	},
	});
});