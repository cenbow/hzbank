define(function (require, exports, module) {
	
	var depositSignTemplate = require("text!../template/depositSign.html");
	
	var depositSignView = module.exports = ItemView.extend({
		
        template : depositSignTemplate,
        
        events:{
        	 "click #checkbox1":"checkButton",      	
        	 "click #checkbox2":"checkButton",
	    	 "click #showPage3" : "showPage3",
        	 "click #showPage4,#checkReg2" : "showPage4",
        	 "click #signBtn" : "signDesign",
         	 "click #agreeBtn1":"agreeBtn1",      	
        	 "click #closeBtn1":"showPage1",     
        	 "click #agreeBtn2":"agreeBtn2",      	
        	 "click #closeBtn2":"showPage1",
        	 "click #questionSubmit":"questionSubmit",        	 
        },
        
        initialize : function(){
        	//初始化菜单方法
        	var pageStep1 = {
        		title:'结构性存款签约',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        	};
        	
        	Client.initPageTitle(pageStep1);
    		Client.hideWaitPanel(1);
        },
		signDesign : function(){
			if($("#signBtn").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
			var $this = this;

			var checkStt1 = document.getElementById("checkbox1").checked;
			var checkStt2 = document.getElementById("checkbox2").checked;
			var mgrNo = $("#mgrNo").val().trim();
			if(!checkStt1){
				Client.alertinfo("请阅读个人结构性存款协议书");
				return;
			}
			if(!checkStt2){
				Client.alertinfo("请阅读并填写个人结构性存款产品适合度评估表");
				return;
			}
			if (mgrNo) {
				if (mgrNo.length!=6||!Utils.isInteger(mgrNo)) {
					Utils.alertinfo("请输入正6位数字推荐人编号");
					return;
				}
			}
			var param = {
					"cardNo": Utils.getEleCard().cardNo,
					"accountType": Utils.getEleCard().accountType,
					"mgrNo": mgrNo
			};
			
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/design/designabilitySign",data:param, success:function(data){  //修改客户信息
				if(Utils.isEmpty(data.errorCode)){
					App.navigate("design/designCtl/depositBuy");
				}else{
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(1);
				}
			},error:function(){
				Client.hideWaitPanel(1);
			}});
		},
        goBack : function(){
        	App.back();
    	}, 
		//控制页面显示
		showPage : function(num){
			for(var i=1;i<=5;i++){
				if(i==num){
					$("#deSignPage"+i).show();
				}else{
					$("#deSignPage"+i).hide();
				}
			}
		},
		showPage1 : function(){
        	var pageStep1 = {
					title:'结构性存款签约',
        			leftButton:{
        				name : '返回',
        				func: 'curView.goBack()'
        			}
        		};

        	Client.initPageTitle(pageStep1);
    		Client.menuOpt("5");
			this.showPage(1);
		},
		showPage3 : function(){
			//初始化结果页面头部菜单
			Client.menuOpt("0");
			//页面滚动到最顶端
			window.scrollTo(0, 0);
			var pageStep = {
					title:'结构性存款签约',
					leftButton:{
						name: '返回',
						func: 'curView.showPage1()'
					}
			};
			Client.initPageTitle(pageStep);
			var $this = this;
			setTimeout(function(){
				$this.showPage(3);
			},100);
		},
		showPage4 : function(){
			//初始化结果页面头部菜单
			Client.menuOpt("0");
			//页面滚动到最顶端
			window.scrollTo(0, 0);
			var pageStep = {
        		title:'结构性存款签约',
				leftButton:{
					name: '返回',
					func: 'curView.showPage1()'
				}
			};
			Client.initPageTitle(pageStep);	
			var $this = this;
			setTimeout(function(){
				$this.showPage(4);
			},100);
		},
		agreeBtn1 : function(){
			var pageStep = {
	        		title:'结构性存款签约',
					leftButton:{
						name: '返回',
						func: 'curView.showPage1()'
					}
				};
				Client.initPageTitle(pageStep);	
    		Client.menuOpt("5");
    		$('#checkbox1').remove();
    		$('#checkReg1').prepend('<input type="checkbox" checked id="checkbox1" />');
    		this.checkButton();
			this.showPage(1);
		},
		agreeBtn2 : function(){
			var pageStep = {
	        		title:'结构性存款签约',
					leftButton:{
						name: '返回',
						func: 'curView.showPage1()'
					}
				};
			Client.initPageTitle(pageStep);	
    		Client.menuOpt("5");
    		$('#checkbox2').remove();
    		$('#checkReg2').prepend(' <input type="checkbox" id="checkbox2" disabled="disabled" checked>');
    		this.checkButton();
			this.showPage(1);
		},
		questionSubmit : function(){
			var elements =$('.agreement input') ;
			var str ="";
			for (var i =0; i<elements.length;i++){
				var element = elements[i];
				
				if(element.type=='radio'&&element.checked==true){
					str += element.value;
				}
			}

			if(str=="000"){
				this.agreeBtn2();
			}else{
				Utils.alertinfo('Q1、Q2、Q3三者都选择"是"，才是符合本产品的客户，如需签约请仔细阅读并填写');
			}
		},
    	checkButton : function(){
    		  //验证码开始进行匹配
    		  (($('#checkbox1').attr("checked"))&&($('#checkbox2').attr("checked"))) ?
    				    $("#signBtn").removeClass('disabled').removeAttr('disabled') : $("#signBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
      	},	
    	
	});
});