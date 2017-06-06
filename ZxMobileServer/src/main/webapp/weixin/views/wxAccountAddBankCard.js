$(function(){
	$('#jobInfo').val("商业、服务业、贸易 办事人员");
	var jobInfo_g="商业、服务业、贸易 办事人员";
	var profession_g="C4";
	var jobPicker = new $.PopPicker({layer: 2});

	var job_b = [
	             {value:"1",text:"负责人"},
	             {value:"2",text:"专业技术人员"},
	             {value:"3",text:"财务人员"},
	             {value:"4",text:"办事人员"},
	             {value:"5",text:"生产操作人员"},
	             {value:"9",text:"其他"}];
	var job_a = [
	             {value:"A",text:"国家机关、党群组织、事业单位",children:job_b},
	             {value:"B",text:"工业生产、运输设备",children:job_b},
	             {value:"C",text:"商业、服务业、贸易",children:job_b},
	             {value:"D",text:"科研、文化、卫生、教育、法律",children:job_b},
	             {value:"E",text:"金融、电力 、电信、邮政",children:job_b},
	             {value:"F",text:"农、林、牧、渔、水利业",children:job_b},
	             {value:"G",text:"学生",children:job_b},
	             {value:"H",text:"离退休",children:job_b},
	             {value:"I",text:"军人",children:job_b},
	             {value:"J",text:"个体/自由职业者",children:job_b},
	             {value:"Z",text:"其他",children:job_b}];
	
	  jobPicker.setData(job_a);

	
	var prePara = Utils.search();
	var userName = decodeURIComponent(prePara['userName']);
	var certNo = decodeURIComponent(prePara['certNo']);
	var random = decodeURIComponent(prePara['random']);
	var mobileNo = decodeURIComponent(prePara['mobileNo']);
	var openId = decodeURIComponent(prePara['openId']);
	var cardType="";
	
	$("#userName").html(userName);
	$("#certNo").html(certNo);
	
	var params = {
			actionFlag:"01"
	};
	$("#second .more").click(function(){
		location.href="wxMoreBankList.html";
	});
	//获取后台银行列表/queryBankInfo
	ajax({ 
		url: "../../weixin/queryBankInfo", 
		data:params,
		success: function(data){
			if(Utils.isEmpty(data.errorCode)){
				var iBankInfo = data.iBankInfo;
				/*	if(iBankInfo.length>0){
				  $("#bnkListId").empty();
	            	$.each(iBankInfo,function(index,info){
	            		$("#bnkListId").append("<span>"+info.bankName+"</span>");
					  });*/
					
			
				var i=0;
				for(;i<iBankInfo.length&&i<5;i++){
					$("#first").append('<li> <i class="ico-bnk bnk-'+iBankInfo[i].bankIconUrl.substr(2)+'"/>'+'<p>'+iBankInfo[i].bankName+'</p></li>');
					
				}
				for(i=5;i<iBankInfo.length&&i<9;i++){
					$("#second").prepend('<li> <i class="ico-bnk bnk-'+iBankInfo[i].bankIconUrl.substr(2)+'"/>'+'<p>'+iBankInfo[i].bankName+'</p></li>');
					
				}
			 }
	   }
  });
	
	$('#showJobPicker').click(function(event) {
		  jobPicker.show(function(items) {
			  if(items[0].text.length > 6){
				  jobInfo_g = items[0].text.substring(0,6) + "... " + items[1].text;
			  }else{
				  jobInfo_g = items[0].text + " " + items[1].text;
			  }
			  $('#jobInfo').val(jobInfo_g);
			  profession_g = items[0].value+items[1].value;
		  });
	  });

	
	$("#input_cardNo").keyup(function(){
		var cardNo = $('#input_cardNo').val();
		$("#input_cardNo").val(Utils.getFmtAcc(cardNo));
	});
	
	//输入绑定银行卡，捕获keyup时间，后台请求卡信息
	$("#input_cardNo").blur(function(){
		var cardNo = $('#input_cardNo').val();
		$("#input_cardNo").val(Utils.getFmtAcc(cardNo));
		cardNo = cardNo.replace(/\s/g,"");
		if(Utils.isEmpty(cardNo)){
			return;
		}
		var params = {
				cardNo:cardNo,
				queryType:'1'
		};
		Utils.openWaitlayer();
		ajax({ 
			url: "../../weixin/checkCardBin", 
			data:params, 
			success: function(data){
				Utils.closeWaitlayer();

				if(Utils.isEmpty(data.errorCode)){
					var icoll = data.iCardBinInfo;
		    		if(icoll!=null&&icoll.length>0){
						var kColl = icoll[0];
						var cardType2 = kColl.cardType;
						if(cardType2=='0'){
							var orgCode = kColl.orgCode;
							if(orgCode=="313331000014"){
					    		cardType='00';	
	//				    		$("#mobileDiv").hide();
	//				    		$("#passwordDiv").show();
					    	}else{
					    		cardType = "04";
	//				    		$("#mobileDiv").show();
	//				    		$("#passwordDiv").hide();
					    	}
							$("#input_bankUrl").removeClass().addClass("ico-bnk bnk-"+kColl.bankIconUrl.split("_")[1]);
							$("#input_bank").val(kColl.orgName).attr("data-value",kColl.orgCode);
							checkButton();
						}else{
							Utils.alertinfo("您输入的卡类型为非借记卡");
						}
						
						
				    }else{
				    	Utils.alertinfo("暂不支持该银行");
				    }
				}else{
					Utils.alertinfo(data.errorMessage);		
				}
		},			
		error : function() {
			Utils.closeWaitlayer();
			Utils.alertinfo("服务器异常！");
		}
	  });
		
	});
	
	

/*	$("#input_cardNo").blur(function(){
		checkButton();
	});*/
	

	$("#submitBtn").click( function(){
		var bindCardNo = $('#input_cardNo').val();
		var bankName = $('#input_bank').val();
		bindCardNo = bindCardNo.replace(/\s/g,"");
		var bankType = $('#input_bank').attr("data-value");
		if(Utils.isEmpty(bindCardNo)){
			Utils.alertinfo("请输入有效卡号");
			return;
		}
		
		if(Utils.isEmpty(openId)){
			 Utils.alertinfo("请从杭州银官方微信号注册！");
			 return;
		}
		var params = {
				bindCardNo:bindCardNo,
				bankName:bankName,
				cardType:cardType,
				mobileNo:mobileNo,
				certNo:certNo,
				random:random,
				mobileNo:mobileNo,
				bankType:bankType,
				openId:openId,
				profession:profession_g,
				validDate:"",
				customerAddress:""
		};
		
		Utils.openWaitlayer();
		ajax({ 
			url: "../../weixin/registerStep2",
			data:params,
			success: function(data){
				Utils.closeWaitlayer();
				if(Utils.isEmpty(data.errorCode)){
					var subTime = data.subTime;
					var cardNo = data.cardNo;
					location.href ="wxAccountOpenInfo.html?userName="+encodeURIComponent(userName)+"&cardNo="+encodeURIComponent(cardNo)+"&subTime="+encodeURIComponent(subTime);
				}else{
					Utils.alertinfo(data.errorMessage);		
				}
			
		},
		error : function(XMLHttpRequest,textStatus,errorThrown) {
			
			Utils.closeWaitlayer();
			Utils.alertinfo("服务器异常！");
		}
	  });
	});


	function checkButton(){
		 (!Utils.isEmpty( $('#input_cardNo').val())&&!Utils.isEmpty($('#input_bank').attr("data-value"))) ?
				  $("#submitBtn").removeClass('disabled').removeAttr('disabled') : $("#submitBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		    
	}
	
});