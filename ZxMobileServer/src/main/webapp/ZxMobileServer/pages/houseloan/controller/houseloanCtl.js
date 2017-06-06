define(function (require, exports, module) {
	//定义视图
	var BuyhousestepView = require("../views/buyhousestep");
	var LoancalculateView = require("../views/loancalculate");
	var LoancenterView = require("../views/loanCenter");	
	var TaxcalculateView = require("../views/taxcalculate");	
	var LoanapplyfirstView = require("../views/loanapplyfirst");	
	var IdentifycheckView = require("../views/identifycheck");
	var FacecheckView = require("../views/facecheck");
	var ResultView = require("../views/result");
	var QueryResultView = require("../views/queryresult");
	var HouseinfoView = require("../views/houseinfo");
	var ApplyerinfoView = require("../views/applyerinfo");
	var LoaninfoView = require("../views/loaninfo");
	var LoanresultView = require("../views/loanresult");
	var loancalculateresultView = require("../views/loancalculateresult");
	var TaxcalculateresultView = require("../views/taxcalculateresult");
	var loanquerystep1View = require("../views/loanquerystep1");
	var loanquerystep2View = require("../views/loanquerystep2");
	var loanqueryresultView = require("../views/loanqueryresult");
	var loanfacecheckView = require("../views/loanfacecheck");
	var HouseConcernView = require("../views/houseConcern");
	var NoloaninfoView = require("../views/noLoaninfo");
	
	//视图操作
	var LoanController = module.exports = Controller.extend({
		actions:{
			"buyhousestep" : "tobuyhousestep",
			"loancalculate" : "toloancalculate",
			"loanCenter" : "toloancenter",
			"taxcalculate" : "totaxcalculate",
			"loanapplyfirst" : "toloanapplyfirst",
			"identifycheck" : "toidentifycheck",
			"facecheck" : "tofacecheck",
			"result" : "toresult",
			"queryresult" : "toqueryresult",
			"houseinfo" : "tohouseinfo",
			"applyerinfo" : "toapplyerinfo",
			"loaninfo" : "toloaninfo",
			"loanresult" : "toloanresult",
			"loancalculateresult" : "toloancalculateresult",
			"taxcalculateresult" : "totaxcalculateresult",
			"loanquerystep1" : "toloanquerystep1",
			"loanquerystep2" : "toloanquerystep2",
			"loanqueryresult" : "toloanqueryresult",
			"loanfacecheck" : "toloanfacecheck",
			"houseConcern" : "tohouseConcern",
			"noLoaninfo" : "tonoLoaninfo"
			
			},
		
		/*fundListInfo : function(){
			App.container.show(new FundListInfoView({model:new Model()}));
		}		*/	
			
			toloancenter : function(){
				Client.menuOpt("0");
				App.container.show(new LoancenterView());
				
			},
			tobuyhousestep : function(){
				
				App.container.show(new BuyhousestepView());
				
			},
			toloancalculate : function(){
				
				App.container.show(new LoancalculateView());
				
			},
			totaxcalculate : function(){
				
				App.container.show(new TaxcalculateView());
				
			},
			
			toloanapplyfirst :function(){
				
				App.container.show(new LoanapplyfirstView());
				
				
			},
			
			toidentifycheck : function(){
				var model = App.storage.get("_parameters");
				App.container.show(new IdentifycheckView({model:new Model(model)}));
		
				
			},
			tofacecheck : function(){
				var model = App.storage.get("_parameters");
				App.container.show(new FacecheckView({model:new Model(model)}));
			},
			toresult : function(){
				var model = App.storage.get("_parameters");
				App.container.show(new ResultView({model:new Model(model)}));
			},
			
			tohouseinfo : function(){
				
				App.container.show(new HouseinfoView());
		
			},
			toapplyerinfo : function(){
				
				App.container.show(new ApplyerinfoView());
			},
			
			
			toloaninfo :function (){
				
				App.container.show(new LoaninfoView());
			
			},
			
			toloanresult :function (){
				
				App.container.show(new LoanresultView());
				
			},
			toqueryresult :function (){
				var model = App.storage.get("_parameters");
				App.container.show(new QueryResultView({model:new Model(model)}));
				
			},
			toloancalculateresult : function(){
				
				App.container.show(new loancalculateresultView());
				
				
			},
			totaxcalculateresult : function(){
				
				App.container.show(new TaxcalculateresultView());
				
				
			},
			toloanquerystep1 : function (){
				
			
				App.container.show(new loanquerystep1View());
				
				
			},
			toloanquerystep2 : function (){
				
				var model = App.storage.get("_parameters");
				App.container.show(new loanquerystep2View({model:new Model(model)}));
				
				
			},
			toloanqueryresult : function (){
				
				
				App.container.show(new loanqueryresultView());
			
			},
			toloanfacecheck : function(){
				
				App.container.show(new loanfacecheckView());
				
				
			},
			tohouseConcern : function(){
				
				App.container.show(new HouseConcernView());
				
				
				
			},
			tonoLoaninfo : function(){
				
				App.container.show(new NoloaninfoView());
				
				
				
			}
			
	});
	
});