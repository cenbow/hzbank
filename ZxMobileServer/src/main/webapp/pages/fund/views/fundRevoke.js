define(function (require, exports, module) {
	
	var fundRevokeTemplate = require("text!../template/fundRevoke.html");
	var FundRevokeView = module.exports = ItemView.extend({
		 
		template : fundRevokeTemplate,
	        
        events:{
        	"click #sureRevoke" : "sureRevoke",
			"click #pwd" : "showPwd",
        },
        initialize : function(){
        	var pageStep1 = {
        		title:'交易记录',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        
        	};
        	Client.initPageTitle(pageStep1);
        	Client.hideWaitPanel(1);
        	var param =App.storage.get("_parameters").iFundDealrepealInfo;
        	this.init(param);
        },
        
        init:function(param){
        	var transDate=Utils.formatDate(param.transferDate,'yyyyMMdd','yyyy-MM-dd');
        	$("#divData1").html('<h1>'+Utils.trim(param.fundName)+'</h1><p class="ft13 fc-b"><span>('+param.fundCode+')</span><span class="ft13 fc-b ml10">'+transDate+'</span></p>');
        	 if((param.transName)=="理财产品申购"){	
        		 $("#divData2").html(Utils.formatCurrency(param.fundAmt,2)+'(元)<p class="ft13 fc-b">'+param.tradeStatusName+'</p>');
			   }else if((param.transName)=="理财产品赎回"){
				   $("#divData2").html(Utils.formatCurrency(param.fundVol,2)+'(份)<p class="ft13 fc-b">'+param.tradeStatusName+'</p>');
			   }
        },
        
        sureRevoke :function(){
        	var $this=this;
        	if($("#sureRevoke").hasClass("disabled")){
    			return;
    		}
        	var cardNo = Utils.getEleCard().cardNo;
  			var accountType = Utils.getEleCard().accountType;
  			var SerialNo=App.storage.get("_parameters").iFundDealrepealInfo.SerialNo;
  			
  			if(!$this.pwd||!$this.pwdKey){
  				if(	$('.ui-view').attr('data-position')!=0){
	     			return;
	     		}
    			Utils.alertinfo("请输入交易密码！");
    			return false;
    		}
  			
  			var param={
					cardNo:cardNo, 
					accountType:accountType,
					password:this.pwd, 
					pwdkey:this.pwdKey,
					serialNo:SerialNo
				};
			Client.openWaitPanel("拼命加载中，请稍候");
  			Ajax({url:"/fund/fundBusiConcel",data:param, success:function(data){//基金撤单
					if(Utils.isEmpty(data.errorCode)){
						Utils.alertinfo("撤单成功！");
						$this.goBack();
						$this.clearPwd();
					}else{
						Utils.alertinfo(data.errorMessage);
	    				Client.hideWaitPanel(1);
	    				$this.clearPwd();
	    				return;
	    			}
					
				},error:function(){
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
    		if(this.pwd && this.pwdKey && $("#pwd").val().length>=6){
    			$("#sureRevoke").removeClass("disabled");
    		}else{
    			$("#sureRevoke").addClass("disabled");
    		}
    	},
    	
        goBack : function(){
        	App.back();
    	},
	});
});