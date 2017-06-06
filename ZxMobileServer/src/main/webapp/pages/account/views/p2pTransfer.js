define(function (require, exports, module) {
	
	var P2pTransferTemplate = require("text!../template/p2pTransfer.html");
	
	var P2pTransferView = module.exports = ItemView.extend({
		
        template : P2pTransferTemplate,
        
        events:{
        	"click #makesure" : "makesure",
        	"blur #buyRate" : "buyRate",
        	"keyup #buyRate":"buyRate",
        	"click #pwd" : "showPwd",
        	"click #agree" : "agree",
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
	       				name : '帮助',
	       				func : 'curView.help()'
	       			}
	       	  };
        	Client.initPageTitle(pageStep1);
        	$("#cardNo").text(Utils.formatAcc(Utils.getEleCard().cardNo));
        	$("#income").text("0.00");
    		this.initData();

   		    
        },

        initData : function(){
        	var transferList = App.storage.get("_parameters");
        	if(transferList){
        		var financeName = App.storage.get("_parameters").financeName;
				var tranRateMin = Utils.formatCurrency(App.storage.get("_parameters").tranRateMin,2);//收益率下限
				var tranRateMax = Utils.formatCurrency(App.storage.get("_parameters").tranRateMax,2);//收益率上限
				var tranHoldDays = App.storage.get("_parameters").tranHoldDays-1;//已持有天数
				var transferCapital = Utils.formatCurrency(App.storage.get("_parameters").transferCapital,2);//当前持有人购买的本金
				var tranRate = Utils.formatCurrency(App.storage.get("_parameters").tranRate,2);//当前持有人收益率
				
				
				$("#financeName").text(financeName);
				$("#transferCapital").text(transferCapital);
				$("#tranRate").text(tranRate);
				$("#tranHoldDays").text(tranHoldDays);
				$("#tranRateMin").text(tranRateMin);
				$("#tranRateMax").text(tranRateMax);
				$("#principal").text(transferCapital);
    	    	Client.hideWaitPanel(1);
        	}
        },
        
        //计算您的收益
        buyRate : function(){
        	var buyRate = $("#buyRate").val()/100;
        	if($("#buyRate").val()=="" || $("#buyRate").val()==0){
        		$("#income").text("0.00");
        	}else{
        		var tranHoldDays = App.storage.get("_parameters").tranHoldDays;//已持有天数
    			var transferCapital = App.storage.get("_parameters").transferCapital;//当前持有人购买的本金
    			var tranRate = (App.storage.get("_parameters").tranRate)/100;//当前持有人收益率
    			var fundRestDay = App.storage.get("_parameters").fundRestDay;//当前持有人产品期限
    			var income1 = Utils.removeComma(Utils.formatCurrency((365+fundRestDay*tranRate)*transferCapital/(365+(fundRestDay-tranHoldDays+1)*buyRate),2));
    			var income = Utils.formatCurrency(income1-transferCapital,2);
    			$("#income").text(income);
        	}
        	
        },
        
		makesure : function(){
	    	var $this=this;
	    	if(isNaN(Utils.trim($("#buyRate").val()))){
	    		Utils.alertinfo("收益率格式错误,请重新输入！");	
	    		return false;
	    	}
	    	var financeNo = App.storage.get("_parameters").financeNo;
  			var tranRate  = Utils.removeComma(Utils.formatCurrency(Utils.trim($("#buyRate").val()),2));
  			var tranRateMin = parseFloat($("#tranRateMin").text());
			var tranRateMax = parseFloat($("#tranRateMax").text());
			var tranFlowNo = App.storage.get("_parameters").tranFlowNo;
			
			if(MUI.isEmpty(Utils.trim($("#buyRate").val()))){
				Utils.alertinfo("请输入买方收益率！");	
    			return false;
			}
			
			if(!/^[0-9]+(.[0-9]{1,2})?$/.test(Utils.trim($("#buyRate").val()))){
				Utils.alertinfo("请按照正确的收益率格式输入!");
				return false;
			}
  			if(parseFloat(tranRate)<tranRateMin || parseFloat(tranRate)>tranRateMax){
  				Utils.alertinfo("买方收益率请输入"+tranRateMin+"-"+tranRateMax+"之间的数据！");
    			return false;
  			}
  			
  			
  			if(!$this.pwd||!$this.pwdKey){
  				if(	$('.ui-view').attr('data-position')!=0){
	     			return;
	     		}
    			Utils.alertinfo("请输入交易密码！");
    			return false;
    		}
  			
    		var checkStt = document.getElementById("checkbox").checked;
			if(!checkStt){
				Utils.alertinfo("请阅读《转让受让协议》");
				return false;
			}
			var param={
				financeNo:financeNo,
				tranRate:tranRate, 
				password:this.pwd, 
				pwdkey:this.pwdKey, 
				tranFlowNo:tranFlowNo, 
			};
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/product/productTransfer",data:param, success:function(data){
				$this.clearPwd();
				if(Utils.isEmpty(data.errorCode)){
					var transferstate = data.transferstate;
					if(transferstate=="00"){
						App.storage.remove("paramAccount");
						var financeName = data.financeName;
						var transferAMT = data.transferAMT;
						var tranRate = data.tranRate;
						var limit = data.limit;
						
						var pamam = {
								financeName:financeName,
								transferAMT:transferAMT,
								tranRate:tranRate,
								limit:limit,
								transferstate:transferstate
						};
						App.navigate("account/mycountCtl/resultTransfer",pamam);
					}else{
						App.storage.remove("paramAccount");
						App.navigate("account/mycountCtl/resultTransfer");
					}
    			}else{
    				App.storage.remove("paramAccount");
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}
				
			},error:function(){
				Utils.alertinfo(data.errorMessage);
    			Client.hideWaitPanel(1);
    			$this.clearPwd();
    			
    		}});
		},
		
		showPwd : function(){
			Utils.focusPosition($("#pwd").parent());
			var opt = {
				elem:"#pwd",//当前对像
				type:'number',//text 字母与数字 number数字键盘
				max:'6',
				callback:'curView.savePassword'
			};
			Client.showPwdPicker(opt);
		},
		
		savePassword : function(obj){
			this.pwd = obj.pwd;
			this.pwdKey = obj.pwdKey;
		},
		
		clearPwd : function(){
    		$("#pwd").val("");
    		this.pwdKey = null;
    		this.pwd = null;
			Client.loadPwdKey();
			$("#login-pswd i").hide();
    	},
        
        goBack : function(){
        	App.back();
     	},
     	
     	agree : function(){
     		App.navigate("product/productCtl/productAgree5");
     	},
     	
     	help : function(){
     		App.navigate("account/mycountCtl/transferHelp");
      	},
      	
	});
});