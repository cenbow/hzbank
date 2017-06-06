define(function(require, exports, module) {

	var LoaninfoTpl = require("text!../template/loaninfo.html");

	var LoaninfoView = module.exports = ItemView.extend({

		events : {
			"click #loancomf" : "toloancomf"
		},

		template : LoaninfoTpl,
		// 定义日志TAG便于错误信息查找
		initialize : function() {
			var pageTest = {
				title : '贷款申请',
				leftButton : {
					name : '返回',
					func : 'curView.Back()'
				},
				rightButton : {
					name : '取消',
					func : 'curView.cancel()'
				}
			}
			Client.initPageTitle(pageTest);
			Client.hideWaitPanel(10);
			var $this = this;
			var firstinfo = App.storage.get("firstinfo");

			if (firstinfo.houseLoadType == "3" || firstinfo.houseLoadType == "4" || firstinfo.houseLoadType == "5") {

				$("#loanType").text("纯公积金贷款");

				$("#fundLoan").show();
				$("#commercialLoan").hide();
				 $("#mixloaninfo").hide();
				$("#FundloanBig").show();
				$("#commercialBig").hide();

				var newfundBorrowNum = Utils.formatCurrency(firstinfo.fundBorrowNum,2);
				$("#ggjNum").text(newfundBorrowNum);

				
				
				
				var fundBorrowBigNum = Utils.toChineseCurrency(parseFloat(firstinfo.fundBorrowNum).toFixed(2))
				$("#fundmoneybig").text(fundBorrowBigNum);

			} else if (firstinfo.houseLoadType == "6" || firstinfo.houseLoadType == "7"
					|| firstinfo.houseLoadType == "8") {

				$("#loanType").text("组合贷款");

				$("#commercialLoan").show();
				$("#fundLoan").show();

				$("#FundloanBig").show();
				$("#commercialBig").show();
				$("#mixloaninfo").show();

				
				var newcommercialBorNum = Utils.formatCurrency(firstinfo.commercialBorNum,2);
				$("#commicNum").text(newcommercialBorNum);
				var commercialBorBigNum = Utils.toChineseCurrency(parseFloat(firstinfo.commercialBorNum).toFixed(2));
				$("#commoneybig").text(commercialBorBigNum);

				var newfundBorrowNum = Utils.formatCurrency(firstinfo.fundBorrowNum,2);
				$("#ggjNum").text(newfundBorrowNum);
				var fundBorrowBigNum = Utils.toChineseCurrency(parseFloat(firstinfo.fundBorrowNum).toFixed(2))
				$("#fundmoneybig").text(fundBorrowBigNum);

			} else if (firstinfo.houseLoadType == "2") {

				$("#loanType").text("纯商业贷款");

				$("#fundLoan").hide();
				$("#commercialLoan").show();
				$("#commercialBig").show();
				$("#FundloanBig").hide();
				$("#mixloaninfo").hide();

				var newcommercialBorNum = Utils.formatCurrency(firstinfo.commercialBorNum,2);
				$("#commicNum").text(newcommercialBorNum);
				var commercialBorBigNum = Utils.toChineseCurrency(parseFloat(firstinfo.commercialBorNum).toFixed(2));
				$("#commoneybig").text(commercialBorBigNum);

			}

	
	       $("#borrowyear").val(firstinfo.borrowDeadline);
	

		if(firstinfo.localLiveYear){
			$("#localliveyear input").val(firstinfo.localLiveYear);
		}else{
			$("#localliveyear input").val("请选择");
		}
		
		if(firstinfo.eraliestWorkYear){
			$("#earlistyear input").val(firstinfo.eraliestWorkYear);
		}else{
			$("#earlistyear input").val("请选择");
		}
		
		if(firstinfo.joinNowcoYear){
			$("#joinyear input").val(firstinfo.joinNowcoYear);
		}else{
			$("#joinyear input").val("请选择");
		}
		
		    $("#houseNo").val(firstinfo.houseNum);
			$("#carNo").val(firstinfo.carNum);

			// 还款方式
			if (firstinfo.repaymentType == "1") {
				$('#waypayback').find('input').val("等额本金");
				this.waypayback = "1";

			} else if (firstinfo.repaymentType == "2") {

				$('#waypayback').find('input').val("等额本息");
				this.waypayback = "2";
			}

			// 是否银行贷款
			if (firstinfo.bankLoan == "1") {
				$('#bankloan').find('input').val("是");
				this.bankloan = "1";

			} else if (firstinfo.bankLoan == "0") {

				$('#bankloan').find('input').val("否");
				this.bankloan = "0";
			}

			// 是否个人担保
			if (firstinfo.personAlguarantee == "0") {
				$('#personguar').find('input').val("否");
				this.personguar = "0";

			} else if (firstinfo.personAlguarantee == "1") {

				$('#personguar').find('input').val("是");
				this.personguar = "1";
			}

			
			
			$('#waypayback').selectDialog({
				list : [ '等额本金|1', '等额本息|2' ],
				callback : function(value, label) {
					$('#waypayback').find('input').val(label);
					$this.waypayback = value;
				}
			});
			
			$('#bankloan').selectDialog({
				list : [ '是|1', '否|0'],
				callback : function(value, label) {
					$('#bankloan').find('input').val(label);
					$this.bankloan = value;
				}
			});
			
			$('#personguar').selectDialog({
				list : [ '是|1', '否|0' ],
				callback : function(value, label) {
					$('#personguar').find('input').val(label);
					$this.personguar = value;
				}
			});
			
			
			var date = new Date();
			var year = date.getFullYear();
			var yearList = [];
			for(var i=0; i<100; i++){
				var curYear = (year-i)+"|"+(year-i);
				yearList.push(curYear);
			}
			
			
			$('#localliveyear').selectDialog({
				list : yearList,
				callback : function(value, label) {
					$('#localliveyear').find('input').val(label);
					$this.localliveyear = value;
				}
			});
			
				$('#earlistyear').selectDialog({
					list : yearList,
					callback : function(value, label) {
						$('#earlistyear').find('input').val(label);
						$this.earlistyear = value;
					}
				});
			
				$('#joinyear').selectDialog({
					list : yearList,
					callback : function(value, label) {
						$('#joinyear').find('input').val(label);
						$this.joinyear = value;
					}
				});
		},
		
		Back : function(){
			
			
			var selbox = $('.selectBox');
			selbox.remove();
			App.back();
			
		},
		// 检查借款年限
		checkloanline : function(year) {
			if (Utils.isNum(year)) {
				return true;
			} else {

				return false;
			}
		},

		cancel : function() {
			var selbox = $('.selectBox');
			selbox.remove();
			App.navigate("houseloan/houseloanCtl/loanCenter");

		},

		toloancomf : function() {
			var $this = this;
			var firstinfo = App.storage.get("firstinfo");
			var applyerinfo = App.storage.get("applyerinfo");

			var borrowyear = $("#borrowyear").val();
			if(borrowyear=="0"){
				Utils.alertinfo("借款年限不能为0！");
				return;
				
			}
			if (borrowyear) {
				if (!this.checkloanline(borrowyear)) {
					Utils.alertinfo("借款年限格式不正确！");
					return;
				}
			} else {

				Utils.alertinfo("请输入借款年限！");
                return;
			}
			/*//本地入住
			var localliveyear = $("#localliveyear").val();
			if (localliveyear) {
				if (!this.checkloanline(localliveyear)) {
					Utils.alertinfo("本地入住年份格式不正确！");
					return;
				}
			}
			
			//最早就业年份
			var earlistyear = $("#earlistyear").val();
			if (earlistyear) {
				if (!this.checkloanline(earlistyear)) {
					Utils.alertinfo("最早就业年份格式不正确！");
					return;
				}
			}
			
			//加入现单位年份
			var joinyear = $("#joinyear").val();
			if (joinyear) {
				if (!this.checkloanline(joinyear)) {
					Utils.alertinfo("加入现单位年份格式不正确！");
					return;
				}
			} */
			//房屋数量
			var houseNo = $("#houseNo").val();
			if (houseNo) {
				if (!this.checkloanline(houseNo)) {
					Utils.alertinfo("房屋数量格式不正确！");
					return;
				}
			} 
			//车辆数量
			var carNo = $("#carNo").val();
			if (carNo) {
				if (!this.checkloanline(carNo)) {
					Utils.alertinfo("车辆数量格式不正确！");
					return;
				}
			} 
			
			
			if(($("#earlistyear input").val()==""||$("#localliveyear input").val()=="请选择")&&(firstinfo.houseLoadType == "6" || firstinfo.houseLoadType == "7"
				|| firstinfo.houseLoadType == "8")){
				
                  Utils.alertinfo("请选择本地入住年份");
				
				return;
				
			}
			if(($("#earlistyear input").val()==""||$("#earlistyear input").val()=="请选择")&&(firstinfo.houseLoadType == "6" || firstinfo.houseLoadType == "7"
				|| firstinfo.houseLoadType == "8")){
				
				Utils.alertinfo("请选择最早就业年份");
				
				return;
			
				
			}
			if(($("#earlistyear input").val()==""||$("#joinyear input").val()=="请选择")&&(firstinfo.houseLoadType == "6" || firstinfo.houseLoadType == "7"
				|| firstinfo.houseLoadType == "8")){
				
				Utils.alertinfo("请选择加入现单位年份");
				
				return;
			
			}
			
			if($("#waypayback input").val()==""||$("#waypayback input").val()=="请选择"){
				
				Utils.alertinfo("请选择还款方式");
				
				return;
				
			}
			if(($("#bankloan input").val()==""||$("#bankloan input").val()=="请选择")&&(firstinfo.houseLoadType == "6" || firstinfo.houseLoadType == "7"
				|| firstinfo.houseLoadType == "8")){
				
				Utils.alertinfo("请选择是否有银行贷款");
				
				return;
				
			}
			if(($("#personguar input").val()==""||$("#personguar input").val()=="请选择")&&(firstinfo.houseLoadType == "6" || firstinfo.houseLoadType == "7"
				|| firstinfo.houseLoadType == "8")){
				
				Utils.alertinfo("请选择是否有对个人担保");
				
				return;
				
			}
			
		
			/*
			firstinfo.borrowDeadline=$("#borrowyear").val();
			firstinfo.repaymentType = this.waypayback;
			firstinfo.localLiveYear =this.localliveyear;
			firstinfo.eraliestWorkYear =this.earlistyear;
			firstinfo.joinNowcoYear =this.joinyear;
			firstinfo.bankLoan = this.bankloan;
			firstinfo.personAlguarantee = this.personguar;
			firstinfo.houseNum=	$("#houseNo").val();
			firstinfo.carNum = $("#carNo").val();
			App.storage.set("firstinfo",firstinfo);
			*/
			
		var twicecommicNum = Utils.removeComma($("#commicNum").text());
		var twiceggjNum = Utils.removeComma($("#ggjNum").text());
			
		var houseconfirminfo = App.storage.get("houseconfirminfo");
		
			var prams = {

				assessValue : houseconfirminfo.assessValue,
				bankLoan : this.bankloan,
				borrowDeadline : $("#borrowyear").val(),
				buildingArea : firstinfo.buildingArea,
				carNum : $("#carNo").val(),
				censusRegister : applyerinfo.censusRegister,
				certType : applyerinfo.certType,
				commercialBorNum : twicecommicNum,
				companyPhone : applyerinfo.companyPhone,
				dutyPosition : applyerinfo.dutyPosition,
				email : applyerinfo.email,
				eraliestWorkYear : $("#earlistyear input").val(),
				firstPayment : houseconfirminfo.firstPayment,
				fundBorrowNum :twiceggjNum ,
				fundNumber : applyerinfo.fundNumber,
				houseAddr : firstinfo.houseAddr,
				houseDate : firstinfo.houseDate,
				houseLoadType : firstinfo.houseLoadType,
				houseNum : $("#houseNo").val(),
				houseRice : houseconfirminfo.houseRice,
				houseStatus : firstinfo.houseStatus,
				houseType : firstinfo.houseType,
				intermediaryLinkman : firstinfo.intermediaryLinkman,
				intermediaryName : firstinfo.intermediaryName,
				intermediaryPhone : firstinfo.intermediaryPhone,
				joinNowcoYear : $("#joinyear input").val(),
				localLiveYear :$("#localliveyear input").val(),
				maritalStatus : applyerinfo.maritalStatus,
				mobileNo : firstinfo.mobileNo,
				monthlyIncome : applyerinfo.monthlyIncome,
				nowAddressStatus : applyerinfo.nowAddressStatus,
				otherLoanNumber : applyerinfo.otherLoanNumber,
				personAlguarantee : this.personguar,
				postAddress : applyerinfo.postAddress,
				postalCode : applyerinfo.postalCode,
				postalCode2 : applyerinfo.postalCode2,
				presentAddress : applyerinfo.presentAddress,
				repaymentType : this.waypayback,
				spouseBirthday : applyerinfo.spouseBirthday,
				spouseCensusRegister : applyerinfo.spouseCensusRegister,
				spouseCertNo : applyerinfo.spouseCertNo,
				spouseCompanyPhone : applyerinfo.spouseCompanyPhone,
				spouseDiplomas : applyerinfo.spouseDiplomas,
				spouseDutyPosition : applyerinfo.spouseDutyPosition,
				spouseFundNumber : applyerinfo.spouseFundNumber,
				spouseMobileNo : applyerinfo.spouseMobileNo,
				spouseMonthlyIncome : applyerinfo.spouseMonthlyIncome,
				spouseName : applyerinfo.spouseName,
				spouseShareMark : applyerinfo.spouseShareMark,
				spouseTechnicalpost : applyerinfo.spouseTechnicalpost,
				spouseWorkPlace : applyerinfo.spouseWorkPlace,
				strs : applyerinfo.strs,
				technicalpost : applyerinfo.technicalpost,
				topDiplomas : applyerinfo.topDiplomas,
				userName : applyerinfo.userName,
				workAddr : applyerinfo.workAddr,
				workPlace : applyerinfo.workPlace,

				certNo : applyerinfo.certNo,
				contractnum : App.storage.get("firstinfo").contractnum
			};

			App.storage.set("prams", prams);
			Client.openWaitPanel("拼命加载中，请稍候");

		Ajax({
				url : "/houseloan/houseloanstepthree",
				data : prams,
				success : function(data) {
					if (MUI.isEmpty(data.errorCode)) {
						App.navigate("houseloan/houseloanCtl/loanresult");
					} else {
						Client.alertinfo(data.errorMessage, "提醒");
					}
					Client.hideWaitPanel(1);

				}
			});

		}

	});
});
