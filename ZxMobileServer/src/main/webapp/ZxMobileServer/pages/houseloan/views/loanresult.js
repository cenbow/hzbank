define(function(require, exports, module){
	
	var LoanresultTpl = require("text!../template/loanresult.html");
	
	var LoanresultView = module.exports = ItemView.extend({
		
		events : {
			"click #resultcomf" : "toresultcomf"
		},
		
		template : LoanresultTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			  var pageTest = {
	    			  	title:'贷款申请',
	    				leftButton:{
	    					name : '',
	    					func :''
	    				},
	    				rightButton:{
	    					name : '',
	    					func :''
	    				}
	    		  }
	    		Client.initPageTitle(pageTest);
	    	    Client.hideWaitPanel(10);

		
	    	    var loanresult = App.storage.get("prams");
	    	    //用户名
	    	    $("#resusername").text(loanresult.userName);
	    	    //合同编号
	    	    $("#rescontractnum").text(loanresult.contractnum);
	    	   // 身份证号
	    	    $("#resCertNo").text(loanresult.certNo);
	    	    //贷款金额
	    	    var flag = loanresult.houseLoadType;
	    	    var commLoan = parseFloat(loanresult.commercialBorNum).toFixed(2);
	    	    var fundLoan = parseFloat(loanresult.fundBorrowNum).toFixed(2);
	    	    var loannumber = parseFloat(commLoan*1+fundLoan*1).toFixed(2);

	    	    //格式转换
	    	    var newcommLoan = Utils.formatCurrency(loanresult.commercialBorNum,2);

	    	    var newfundLoan = Utils.formatCurrency(loanresult.fundBorrowNum,2);

	    	    
	    	    var newloannumber = Utils.formatCurrency(loannumber,2);
	    	    
	    	    
	    	    if(flag=="3"||flag=="4"||flag=="5"){
	    	    	
	    	    	$("#loannum").text(newfundLoan);
	    	    	
	    	    	
	    	    }else if(flag=="2"){
	    	    	$("#loannum").text(newcommLoan);
	    	    	
	    	    	
	    	    	
	    	    }else if(flag=="6"||flag=="7"||flag=="8"){
	    	    	
	    	    	$("#loannum").text(newloannumber);
	    	    	
	    	    	
	    	    }
	    	    
	    	    //还款期限
	    	  $("#repayyear").text(loanresult.borrowDeadline+"年"+"("+loanresult.borrowDeadline*12+")期");
	    	 
	    	 /* var myDate = new Date();
	    	  var aaa = myDate.getFullYear();
	    	   // alert(aaa);
	    	    
	    	    var bbb = myDate.getMonth()+1;
	    	    //alert(bbb);
	    	    var ccc= myDate.getDate();
	    	   // alert(ccc);
	    	    
	    	    var ddd = parseInt(aaa)+parseInt(loanresult.borrowDeadline);
	    	    
	    	    var eee = aaa+"-"+bbb+"-"+ccc+"---"+ddd+"-"+bbb+"-"+ccc;
	    	    
	    	    //借款周期
	    	    $("#borrowyear").text(eee);
	    	    
	    	 */
	    	
		},
		
		cancel : function(){
			
			var index = App.browseList.indexOf("houseloan/houseloanCtl/loanCenter");
    	  	App.browseList.splice(1,index-1);
			App.back();
			
		},		
		
		toresultcomf : function(){		
			App.navigate("houseloan/houseloanCtl/loanCenter");
				
		}
		
		
		
	
	});
});
