define(function(require, exports, module){
	
	var mortMoreTpl = require("text!../template/mortMore.html");
	var validTime = 60;
	var mgrStt = "";
	var MortMoreView = module.exports = ItemView.extend({
		
		events : {
			"click #repayMethod":"gotoRepay",
			"click #submit":"submit",
			"click #save" : "save",
			"click #btn_sendSMS" : "sendSMS",
			"keyup #phonePassInput":"checkButton",
        	"blur  #phonePassInput":"checkButton",
        	"click #nextButton":"doReset",
			"click #agreement" : "gotoAgreement"
		},
		
		template : mortMoreTpl,
		//定义日志TAG便于错误信息查找
		initialize : function(){
			var estimable= "";
			var houseTotalPrice = "";
			if(App.storage.get("applyDataInfo")){
				estimable = App.storage.get("applyDataInfo").estimable;
				houseTotalPrice = App.storage.get("applyDataInfo").houseTotalPrice;
			}else{
				estimable = App.storage.get("_parameters").estimable || "0";
				houseTotalPrice = App.storage.get("_parameters").totalPrice || "0";
			}
			
			if(houseTotalPrice=="0"){
				$("#price1").hide();
				$("#price2").hide();
			}else{
				$("#totalPrice").val(Math.round(houseTotalPrice/10000)+"万元");
				$("#loanPrice").val(Math.round(houseTotalPrice*0.7/10000)+"万元");
			}
			
			if(App.storage.get("SaveSession")){
				$("#houseOwner").val(App.storage.get("SaveSession").houseOwner);
				$("#houseProperty").text(App.storage.get("SaveSession").houseQuality);
				$("#landProperty").text(App.storage.get("SaveSession").landStatus);
				$("#buildYear").val(App.storage.get("SaveSession").buildYear);
				$("#contractTime").val(App.storage.get("SaveSession").contractTime);
				$("#applyUse").text(App.storage.get("SaveSession").applyUse);
				$("#applyAmount").val(App.storage.get("SaveSession").applyAmount);
				$("#creditLine").text(App.storage.get("SaveSession").creditDeadline);
				$("#homeIncome").val(App.storage.get("SaveSession").homeIncome);
				$("#yearPay").val(App.storage.get("SaveSession").yearPay);
				$("#mgrNo").val(App.storage.get("SaveSession").mgrNo);
				$("#marriage").text(App.storage.get("SaveSession").marriage);
			}else if(App.storage.get("applyDataInfo")){
				$("#houseOwner").val(App.storage.get("applyDataInfo").houseOwner);
				var houseQuality = App.storage.get("applyDataInfo").houseQuality;
				if(houseQuality=="01"){
					houseQuality="普通住宅";
				}else if(houseQuality=="02"){
					houseQuality="别墅";
				}else if(houseQuality=="03"){
					houseQuality="排屋";
				}else if(houseQuality=="04"){
					houseQuality="商铺";
				}else if(houseQuality=="05"){
					houseQuality="商住两用";
				}else if(houseQuality=="06"){
					houseQuality="写字楼";
				}else if(houseQuality=="07"){
					houseQuality="保障性住房";
				}else{
					houseQuality="请选择房产性质";
				}
				
				$("#houseProperty").text(houseQuality);//房产性质
				var landStatus = App.storage.get("applyDataInfo").landStatus;
				if(landStatus=="01"){
					landStatus="出让";
				}else if (landStatus=="02"){
					landStatus="非出让";
				}else{
					landStatus="请选择土地性质";
				}
				$("#landProperty").text(landStatus);//土地性质
				$("#buildYear").val(App.storage.get("applyDataInfo").buildYear);
				$("#contractTime").val(App.storage.get("applyDataInfo").contractTime);
				var applyUse = App.storage.get("applyDataInfo").applyUse;
				if(applyUse=="01"){
					applyUse="经营";
				}else if(applyUse=="02"){
					applyUse="日常周转";
				}else if(applyUse=="03"){
					applyUse="投资";
				}else if(applyUse=="04"){
					applyUse="其他";
				}else{
					applyUse="请选择贷款用途";
				}
				$("#applyUse").text(applyUse);//贷款用途
				$("#applyAmount").val(App.storage.get("applyDataInfo").applyAmount);
				var creditDeadline = App.storage.get("applyDataInfo").creditDeadline;
				if(creditDeadline=="03"){
					creditDeadline="12个月";
				}else if(creditDeadline=="04"){
					creditDeadline="2年";
				}else if(creditDeadline=="05"){
					creditDeadline="3年";
				}else if(creditDeadline=="06"){
					creditDeadline="4年";
				}else if(creditDeadline=="07"){
					creditDeadline="5年";
				}else{
					creditDeadline="请选择授信期限";
				}
				$("#creditLine").text(creditDeadline);//授信期限
				$("#homeIncome").val(App.storage.get("applyDataInfo").homeIncome);
				$("#yearPay").val(App.storage.get("applyDataInfo").yearPay);
				$("#mgrNo").val(App.storage.get("applyDataInfo").mgrNo);
				var  marriage = App.storage.get("applyDataInfo").marriage;
				if(marriage=="0"){
					marriage="未婚";
				}else if(marriage=="1"){
					marriage="已婚";
				}else if(marriage=="2"){
					marriage="离异、丧偶";
				}else{
					marriage="请选择婚姻状态";
				}
				$("#marriage").text(marriage);//婚姻状况
			}
			var repayType = "请选择还款方式";
			if(App.storage.get("termLoopInfo")){
				repayType = App.storage.get("termLoopInfo").termLoop;
			}else if(App.storage.get("applyDataInfo")){
				repayType = App.storage.get("applyDataInfo").creditRepayType;//401
				if(repayType=="401"){
					repayType = "循环类";
				}else if(repayType=="421"){
					repayType = "分期类";
				}else{
					repayType = "请选择还款方式";
				}
			}
			$("#repayType").text(repayType);
			
		    this.list1();
		    this.list2();
		    this.list3();
		    this.list4();
		    this.list6();
		    this.repayMethodDOM = document.getElementById('repayMethod');
		    if(estimable=="0"){
		    	var creditDeadline = App.storage.get("applyDataInfo")?App.storage.get("applyDataInfo").creditDeadline:"";
		    	if(creditDeadline=="06" || creditDeadline=="07"){
		    		this.list7(["分期类|421"]);
		    	}else{
		    		this.list7(["分期类|421","循环类|401"]);
		    	}
		    }
		    Client.hideWaitPanel(1);
		    
		},
		
		list1 : function(){
			var semList = [];
			semList.push("普通住宅|01");
			semList.push("别墅|02");
			semList.push("排屋|03");
			semList.push("商铺|04");
			semList.push("商住两用|05");
			semList.push("写字楼|06");
			semList.push("保障性住房|07");
			$('#list1').selectDialog({
				list : semList,
				callback : function(value, label) {
					$('#houseProperty').text(label);
					var houseQualityId = value;
					var houseQualityInfo ={
						    "houseQualityId":houseQualityId
					};
					App.storage.set("houseQualityInfo",houseQualityInfo);
				}
			});
		},
		
		list2 : function(){
			var semList = [];
			semList.push("出让|01");
			semList.push("划拨|02");
			semList.push("其他|02");
			$('#list2').selectDialog({
				list : semList,
				callback : function(value, label) {
					$('#landProperty').text(label);
					var landPropertyId = value;
					var landPropertyInfo ={
						    "landPropertyId":landPropertyId
					};
					App.storage.set("landPropertyInfo",landPropertyInfo);
				}
			});
		},
		
		list3 : function(){
			var estimable= "";
			if(App.storage.get("applyDataInfo")){
				estimable = App.storage.get("applyDataInfo").estimable;
			}else if(App.storage.get("_parameters")){
				estimable = App.storage.get("_parameters").estimable || "0";
			}else{
				estimable = "0";
			}
			
			var semList = [];
			semList.push("12个月|03");
			semList.push("2年|04");
			semList.push("3年|05");
			semList.push("4年|06"); 
			semList.push("5年|07"); 
			var self = this;
			$('#list3').selectDialog({
				list : semList,
				callback : function(value, label) {
					$('#creditLine').text(label);
					var creditLineId = value;
					if(estimable=="0"){
						if(creditLineId=="06" || creditLineId=="07"){
							$("#repayType").text("分期类");
							self.list7(["分期类|421"]);
						}else{
							self.list7(["分期类|421","循环类|401"]);
						}
					}else if(estimable=="1"){
						if(creditLineId=="06" || creditLineId=="07"){
							$("#repayType").text("分期类");
						}
					}
					
					var creditLineInfo ={
						    "creditLineId":creditLineId
					};
					App.storage.set("creditLineInfo",creditLineInfo);
				}
			});
		},
		
		list4 : function(){
			var semList = [];
			semList.push("经营、周转|01");
			semList.push("购买或装修非住宅物业|02");
			semList.push("购买经营性固定资产|03");
			semList.push("其它|04");
			$('#list4').selectDialog({
				list : semList,
				callback : function(value, label) {
					$('#applyUse').text(label);
					var applyUseId = value;
					var applyUseInfo ={
						    "applyUseId":applyUseId
					};
					App.storage.set("applyUseInfo",applyUseInfo);
				}
			});
		},
		
		
		list6 : function(){
			var semList = [];
			semList.push("未婚|0");
			semList.push("已婚|1");
			semList.push("离异、丧偶|2");
			$('#list6').selectDialog({
				list : semList,
				callback : function(value, label) {
					$('#marriage').text(label);
					var marriageId = value;
					var marriageInfo ={
						    "marriageId":marriageId
					};
					App.storage.set("marriageInfo",marriageInfo);
				}
			});
		},
		
		list7 : function(semList){
			this.repayMethodDOM.onclick = function(){
				$('.selectBox').remove();
				$.createDialog({
					list : semList,
					callback : function(value, label) {
						$('#repayType').text(label);
						var repayTypeId = value;
						var repayTypeInfo ={
							    "repayTypeId":repayTypeId
						};
						App.storage.set("repayTypeInfo",repayTypeInfo);
					}
				});
			};

		},
		
		gotoAgreement : function(){
			this.saveData();
			App.navigate("mortgage/mortgageCtl/agreement");
		},
		
		
		saveData : function(){
			var houseOwner = $("#houseOwner").val();
			var houseQuality = $("#houseProperty").text();
			var landStatus = $("#landProperty").text();
			var buildYear = $("#buildYear").val();
			var contractTime = $("#contractTime").val();
			var applyUse = $("#applyUse").text();
			var applyAmount = $("#applyAmount").val();
			var creditDeadline = $("#creditLine").text();
			var homeIncome = $("#homeIncome").val();
			var yearPay = $("#yearPay").val();
			var mgrNo =$("#mgrNo").val();
			var marriage = $("#marriage").text();
			
			var SaveSession = {	
					houseOwner:houseOwner,
					houseQuality:houseQuality,
					landStatus:landStatus,
					buildYear:buildYear,
					contractTime:contractTime,
					applyUse:applyUse,
					applyAmount:applyAmount,
					creditDeadline:creditDeadline,
					homeIncome:homeIncome,
					yearPay:yearPay,
					mgrNo:mgrNo,
					marriage:marriage,
				};
			App.storage.set("SaveSession",SaveSession);
		},
		
		
		gotoRepay : function(){
			var estimable= "";
			if(App.storage.get("applyDataInfo")){
				estimable = App.storage.get("applyDataInfo").estimable;
			}else if(App.storage.get("_parameters")){
				estimable = App.storage.get("_parameters").estimable || "0";
			}else{
				estimable = "0";
			}
			if(estimable=="1"){
				this.repayMethod();
			}
		},
		
		
		
		
		
		repayMethod : function(){
			this.saveData();
			var evaluationPrice = "";
			if(App.storage.get("applyDataInfo")){
				var houseArea = App.storage.get("applyDataInfo").houseArea;
				var houseUnitPrice = App.storage.get("applyDataInfo").houseUnitPrice;
				evaluationPrice = Utils.formatCurrency(houseArea*houseUnitPrice, 2);
			}else{
				var houseArea = App.storage.get("_parameters").buildArea;
				var houseUnitPrice = App.storage.get("_parameters").unitPrice;
				evaluationPrice = Utils.formatCurrency(houseArea*houseUnitPrice, 2);
			}
			var money = $("#applyAmount").val();
			var term = $("#creditLine").text();
			var repayType = $("#repayType").text();
			if(repayType =="循环类"){
				repayType = "401";
			}else if(repayType =="分期类"){
				repayType = "421";
			}
			var moneyInfo = {
					money:money,
					term:term,
					repayType:repayType,
					evaluationPrice:evaluationPrice
			};
			App.storage.set("moneyInfo",moneyInfo);
			App.navigate("mortgage/mortgageCtl/repayMethod");
		},
		
		
		
		sendSMS : function(){
			var mobileNo = App.storage.get("UserInfo").regMobile;
			$("#btn_sendSMS").addClass('disabled').attr('disabled',true);
			var param = {
					mobileNo: mobileNo,
					vBasis: 'PB1113'
			};
			var $this=this;
			Ajax({url:"/mobile/sendPwd", data: param, success: function(data){
				if(data.ec == 0){
					$this.count = validTime;//60秒不允许再次发送
					var timerID = setInterval(function(){
						$('#btn_sendSMS').attr("data-value",$this.count + '秒后重新获取');
						$this.count--;
						if($this.count <= 0||$("#btn_sendSMS").length==0){
							clearInterval(timerID);
							$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
							$('#btn_sendSMS').attr("data-value",'获取手机验证码');
						}
					}, 1000);
					$('#btn_sendSMS').attr("data-value", $this.count + '秒后重新获取');
					$this.count--;

				}else{
					$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(1);
				}
			},error:function(){
				$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
			}});
		},
		
		
		/**
		 * 信息提交
		 */
		submit : function(){
			var certNo = App.storage.get("UserInfo").certNo;
			var mobileNo = App.storage.get("UserInfo").regMobile;
			var customerNameCN =  App.storage.get("UserInfo").customerNameCN;
			var housePropertyNo = "";//云估价房产编号        houseId(有)
			var domicilePlace = "";//行政区代码     areaZipCode(有)
			var houseAddress = "";//地址
			var houseArea = "";//面积
			var houseTotalPrice = "";//房屋估价
			var orderFlowNo = "";//指令流水号
			var storey = "";//楼层
			var houseOwner = "";
			var houseQuality = "";
			var landStatus = "";
			var buildYear = "";
			var contractTime = "";
			var applyUse = "";
			var applyAmount = "";
			var creditDeadline = "";
			var repayType = "";
			var creditRepayType = "";
			var workAddr = "";
			var customerDuty = "";
			var homeIncome = "";
			var yearPay = "";
			var mgrNo ="";
			var isFlag = "";
			var marriage = "";
			var chanFlag = "08";
			var totalFloor = "";//总楼层
			var projectId = "";//楼盘编号
			var houseUnitPrice = "";//房屋单价
			
			if(App.storage.get("applyDataInfo")){//如果有数据代表之前保存过但是没有提交,从我的借款页面跳转过来的
				housePropertyNo = App.storage.get("applyDataInfo").housePropertyNo;
				domicilePlace = App.storage.get("applyDataInfo").domicilePlace;
				houseAddress = App.storage.get("applyDataInfo").houseAddress;
				houseArea = App.storage.get("applyDataInfo").houseArea;
				houseTotalPrice = App.storage.get("applyDataInfo").houseTotalPrice;
				orderFlowNo = App.storage.get("applyDataInfo").orderFlowNo;
				storey = App.storage.get("applyDataInfo").storey;
				houseQuality = App.storage.get("houseQualityInfo")?App.storage.get("houseQualityInfo").houseQualityId:App.storage.get("applyDataInfo").houseQuality;
				landStatus = App.storage.get("landPropertyInfo")?App.storage.get("landPropertyInfo").landPropertyId:App.storage.get("applyDataInfo").landStatus;
				applyUse = App.storage.get("applyUseInfo")?App.storage.get("applyUseInfo").applyUseId:App.storage.get("applyDataInfo").applyUse;
				creditDeadline = App.storage.get("creditLineInfo")?App.storage.get("creditLineInfo").creditLineId:App.storage.get("applyDataInfo").creditDeadline;
				creditRepayType = App.storage.get("applyDataInfo").creditRepayType;
				marriage = App.storage.get("marriageInfo")?App.storage.get("marriageInfo").marriageId:App.storage.get("applyDataInfo").marriage;
				totalFloor = App.storage.get("applyDataInfo").totalFloor;//新增总楼层
				houseUnitPrice = App.storage.get("applyDataInfo").houseUnitPrice;//新增房屋单价
				projectId = App.storage.get("applyDataInfo").projectId;
			}else{
				if(App.storage.get("_parameters")){//房产评估有价格
					housePropertyNo =App.storage.get("_parameters").houseId;
					domicilePlace = App.storage.get("_parameters").areaZipCode;
				    houseAddress = App.storage.get("_parameters").houseAddressAll;
				    houseArea =  App.storage.get("_parameters").buildArea;
					houseTotalPrice = App.storage.get("_parameters").totalPrice;
					storey = App.storage.get("_parameters").floorName;
					if(storey=="暂无楼层"){
						storey="";
					}
					houseUnitPrice = App.storage.get("_parameters").unitPrice;
				    totalFloor = App.storage.get("_parameters").totalFloor;//总楼层
				    projectId = App.storage.get("_parameters").projectId;
				}
				houseQuality = App.storage.get("houseQualityInfo")?App.storage.get("houseQualityInfo").houseQualityId:"";
				landStatus = App.storage.get("landPropertyInfo")?App.storage.get("landPropertyInfo").landPropertyId:"";
				applyUse = App.storage.get("applyUseInfo")?App.storage.get("applyUseInfo").applyUseId:"";
			    creditDeadline = App.storage.get("creditLineInfo")?App.storage.get("creditLineInfo").creditLineId:"";
			    marriage = App.storage.get("marriageInfo")?App.storage.get("marriageInfo").marriageId:"";
			}
			houseOwner = $("#houseOwner").val();
			buildYear = $("#buildYear").val();
			contractTime = $("#contractTime").val();
			contractTime = contractTime.substring(0,4)+"-"+contractTime.substring(4,6)+"-01";    
			applyAmount = $("#applyAmount").val();
			homeIncome = $("#homeIncome").val();
			yearPay = $("#yearPay").val();
			mgrNo = $("#mgrNo").val();
			isFlag = "1";
			repayType = $("#repayType").text();
			if(repayType=="循环类"){
				creditRepayType = "401";
			}else{
				creditRepayType = "421";
			}
			
			
			if(MUI.isEmpty(houseOwner) ){
				Utils.alertinfo("房屋所有权人不能为空！");	
    			return false;
			}
			
			if($("#houseProperty").text()=="请选择房产性质"){
				Utils.alertinfo("请选择房产性质！");	
    			return false;
			}
			
			if($("#landProperty").text()=="请选择土地性质"){
				Utils.alertinfo("请选择土地性质！");	
    			return false;
			}
			
			if(MUI.isEmpty(buildYear) ){
				Utils.alertinfo("建成年份不能为空！");	
    			return false;
			}
			
			if(!/^\d{4}$/.test(buildYear)){
				Utils.alertinfo("请输入正确的建成年份!");
				return false;
			}
			
			if(MUI.isEmpty($("#contractTime").val()) ){
				Utils.alertinfo("购房日期不能为空！");	
    			return false;
			}
			
			if(!/^(\d{4})(\d{2})$/g.test($("#contractTime").val())){
				Utils.alertinfo("请输入正确的购房日期!");
				return false;
			}
			
			if(contractTime.substring(5,7)>"12"){
				Utils.alertinfo("请输入正确的购房日期!");
				return false;
			}
			
			
			if($("#creditLine").text()=="请选择授信期限"){
				Utils.alertinfo("请选择授信期限！");	
    			return false;
			}
			
			if(!Utils.checkAmount2(applyAmount)){
				return false;
			}
			
			if($("#repayType").text()=="请选择还款方式"){
				Utils.alertinfo("请选择还款方式！");	
    			return false;
			}
			
			if($("#applyUse").text()=="请选择贷款用途"){
				Utils.alertinfo("请选择贷款用途！");	
    			return false;
			}
			
			if($("#marriage").text()=="请选择婚姻状况"){
				Utils.alertinfo("请选择婚姻状况！");	
    			return false;
			}
			
			if(!Utils.checkAmount3(homeIncome)){
				return false;
			}
			
			var checkStt = document.getElementById("checkbox").checked;
			if(!checkStt){
				Utils.alertinfo("请阅读《征信授权》");
				return false;
			}
			
			var vCode = $("#phonePassInput").val();
			if(MUI.isEmpty(vCode)){
				Utils.alertinfo("短信验证码不能为空，请重新输入");
				return false;
			}
			if(!Utils.isNum(vCode)){
				Utils.alertinfo("短信验证码为六位数字，请重新输入");
				return false;
			}
			if(vCode.length != 6){
				Utils.alertinfo("输入短信验证码有误，请重新输入");
				return false;
			}
			
			
			
			var param = {	
					certNo:certNo,
					housePropertyNo:housePropertyNo,
					domicilePlace:domicilePlace,
					houseAddress:houseAddress,
					houseOwner:houseOwner,
					houseQuality:houseQuality,
					houseArea:houseArea,
					houseTotalPrice:houseTotalPrice,
					storey:storey,
					landStatus:landStatus,
					buildYear:buildYear,
					contractTime:contractTime,
					applyUse:applyUse,
					applyAmount:applyAmount,
					creditDeadline:creditDeadline,
					creditRepayType:creditRepayType,
					workAddr:workAddr,
					customerDuty:customerDuty,
					homeIncome:homeIncome,
					yearPay:yearPay,
					mgrNo:mgrNo,
					mgrStt:mgrStt,
					isFlag:isFlag,
					marriage:marriage,
					orderFlowNo:orderFlowNo,
					mobileNo:mobileNo,
					chanFlag:chanFlag,
					totalFloor:totalFloor,
					houseUnitPrice:houseUnitPrice,
					vCode:vCode,
					vBasis: 'PB1113',
					customerNameCN:customerNameCN,
					projectId:projectId
				};
			var $this = this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/mortgage/applicationSave", data:param,success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var procRetCode = data.cd.procRetCode;
					if(procRetCode=="0"){
						$(".selectBox").remove();
						App.storage.remove("termLoopInfo");
						App.storage.remove("applyDataInfo");
						App.storage.remove("SaveSession");
						App.storage.remove("houseQualityInfo");
						App.storage.remove("landPropertyInfo");
						App.storage.remove("applyUseInfo");
						App.storage.remove("creditLineInfo");
						App.storage.remove("marriageInfo");
						App.navigate("mortgage/mortgageCtl/submitResult");
					}else{
						Utils.alertinfo(data.cd.hostErrorMessage);
						Client.hideWaitPanel(1);
					}
				}else{
					Utils.alertinfo(data.errorMessage);
				}
				Client.hideWaitPanel(1);
				},error:function(data){
					Utils.alertinfo(data.errorMessage);
				}
				
			});
		},
		
		
		/**
		 * 信息保存
		 */
		save : function(){
			var certNo = App.storage.get("UserInfo").certNo;
			var mobileNo = App.storage.get("UserInfo").regMobile;
			
			var housePropertyNo = "";//云估价房产编号
			var domicilePlace = "";//行政区代码
			var houseAddress = "";//地址
			var houseArea = "";//面积
			var houseTotalPrice = "";//房屋估价
			var orderFlowNo = "";//指令流水号
			var storey = "";//楼层
			var houseOwner = "";
			var houseQuality = "";
			var landStatus = "";
			var buildYear = "";
			var contractTime = "";
			var applyUse = "";
			var applyAmount = "";
			var creditDeadline = "";
			var repayType = "";
			var creditRepayType = "";
			var workAddr = "";
			var customerDuty = "";
			var homeIncome = "";
			var yearPay = "";
			var mgrNo ="";
			var isFlag = "";
			var marriage = "";
			var chanFlag = "08";
			var totalFloor = "";//总楼层
			var houseUnitPrice = "";//房屋单价
			var estimable = "";//是否可估
			var projectId = "";//楼盘ID
			
			if(App.storage.get("applyDataInfo")){//如果有数据代表之前保存过但是没有提交
				housePropertyNo = App.storage.get("applyDataInfo").housePropertyNo;
				domicilePlace = App.storage.get("applyDataInfo").domicilePlace;
				houseAddress = App.storage.get("applyDataInfo").houseAddress;
				houseArea = App.storage.get("applyDataInfo").houseArea;
				houseTotalPrice = App.storage.get("applyDataInfo").houseTotalPrice;
				orderFlowNo = App.storage.get("applyDataInfo").orderFlowNo;
				storey = App.storage.get("applyDataInfo").storey;
				houseQuality = App.storage.get("houseQualityInfo")?App.storage.get("houseQualityInfo").houseQualityId:App.storage.get("applyDataInfo").houseQuality;
				landStatus = App.storage.get("landPropertyInfo")?App.storage.get("landPropertyInfo").landPropertyId:App.storage.get("applyDataInfo").landStatus;
				applyUse = App.storage.get("applyUseInfo")?App.storage.get("applyUseInfo").applyUseId:App.storage.get("applyDataInfo").applyUse;
				creditDeadline = App.storage.get("creditLineInfo")?App.storage.get("creditLineInfo").creditLineId:App.storage.get("applyDataInfo").creditDeadline;
				creditRepayType = App.storage.get("applyDataInfo").creditRepayType;
				marriage = App.storage.get("marriageInfo")?App.storage.get("marriageInfo").marriageId:App.storage.get("applyDataInfo").marriage;
				totalFloor = App.storage.get("applyDataInfo").totalFloor;//新增总楼层
				houseUnitPrice = App.storage.get("applyDataInfo").houseUnitPrice;//新增房屋单价
				estimable = App.storage.get("applyDataInfo").estimable;//新增是否可估
				projectId = App.storage.get("applyDataInfo").projectId;
			}else{//直接进入填写更多页面
				if(App.storage.get("_parameters")){
					housePropertyNo =App.storage.get("_parameters").houseId;
					domicilePlace = App.storage.get("_parameters").areaZipCode;
				    houseAddress = App.storage.get("_parameters").houseAddressAll;
				    houseArea =  App.storage.get("_parameters").buildArea;
					houseTotalPrice = App.storage.get("_parameters").totalPrice;
					storey = App.storage.get("_parameters").floorName;
					if(storey=="暂无楼层,下方填写"){
						storey="";
					}
					houseUnitPrice = App.storage.get("_parameters").unitPrice;
					estimable = App.storage.get("_parameters").estimable || "0";	
					totalFloor = App.storage.get("_parameters").totalFloor;//总楼层
					projectId = App.storage.get("_parameters").projectId;
				}
				
				houseQuality = App.storage.get("houseQualityInfo")?App.storage.get("houseQualityInfo").houseQualityId:"";
				landStatus = App.storage.get("landPropertyInfo")?App.storage.get("landPropertyInfo").landPropertyId:"";
				applyUse = App.storage.get("applyUseInfo")?App.storage.get("applyUseInfo").applyUseId:"";
			    creditDeadline = App.storage.get("creditLineInfo")?App.storage.get("creditLineInfo").creditLineId:"";
			    marriage = App.storage.get("marriageInfo")?App.storage.get("marriageInfo").marriageId:"";
			    
			}
			
			houseOwner = $("#houseOwner").val();
			buildYear = $("#buildYear").val();
			contractTime = $("#contractTime").val();
			if(!MUI.isEmpty(contractTime)){
				contractTime = contractTime.substring(0,4)+"-"+contractTime.substring(4,6)+"-01";	
			}
			applyAmount = $("#applyAmount").val();
			homeIncome = $("#homeIncome").val();
			yearPay = $("#yearPay").val();
			mgrNo = $("#mgrNo").val();
			isFlag = "0";
			repayType = $("#repayType").text();
			if(repayType=="循环类"){
				creditRepayType = "401";
			}else if(repayType=="分期类"){
				creditRepayType = "421";
			}else{
				creditRepayType =  "";
			}
			
			
			var param = {	
					certNo:certNo,
					housePropertyNo:housePropertyNo,
					domicilePlace:domicilePlace,
					houseAddress:houseAddress,
					houseOwner:houseOwner,
					houseQuality:houseQuality,
					houseArea:houseArea,
					houseTotalPrice:houseTotalPrice,
					storey:storey,
					landStatus:landStatus,
					buildYear:buildYear,
					contractTime:contractTime,
					applyUse:applyUse,
					applyAmount:applyAmount,
					creditDeadline:creditDeadline,
					creditRepayType:creditRepayType,
					workAddr:workAddr,
					customerDuty:customerDuty,
					homeIncome:homeIncome,
					yearPay:yearPay,
					mgrNo:mgrNo,
					mgrStt:mgrStt,
					isFlag:isFlag,
					marriage:marriage,
					orderFlowNo:orderFlowNo,
					mobileNo:mobileNo,
					chanFlag:chanFlag,
					totalFloor:totalFloor,
					houseUnitPrice:houseUnitPrice,
					estimable:estimable,
					projectId:projectId
				};
			var $this = this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/mortgage/applicationSave", data:param,success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					Client.alertinfo("信息保存成功","提醒","curView.gotoSetCenter()");
				}else{
					Utils.alertinfo(data.errorMessage);
				}
				Client.hideWaitPanel(100);
				}
			});
		},
		
		gotoSetCenter:function(){
			$(".selectBox").remove();
			App.storage.remove("termLoopInfo");
			App.storage.remove("applyDataInfo");
			App.storage.remove("SaveSession");
			App.storage.remove("houseQualityInfo");
			App.storage.remove("landPropertyInfo");
			App.storage.remove("applyUseInfo");
			App.storage.remove("creditLineInfo");
			App.storage.remove("marriageInfo");
			var param = {
					cityId:App.storage.get("_parameters").cityId,
					cityName:App.storage.get("_parameters").cityName,
					cityZipCode:App.storage.get("_parameters").cityZipCode
			};
    		App.navigate("mortgage/mortgageCtl/mortApply",param);
		},
		
		goBack : function(){
			$(".selectBox").remove();
			App.storage.remove("termLoopInfo");
			App.storage.remove("applyDataInfo");
			App.storage.remove("SaveSession");
			App.navigate("mortgage/mortgageCtl/mortApply");
		}
	
	});
});
