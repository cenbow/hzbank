$(function(){
	
	var prePara = Utils.search();
	var openId = decodeURIComponent(prePara['openId']);
	checkNext();
	var mobileNo = $("#mobileNoText").val();
		var btn_sendSMS = $("#btn_sendSMS").text();
		if (!Utils.isEmpty(mobileNo)&&Utils.checkMobile(mobileNo)&&!Utils.isEmpty(btn_sendSMS)&&"获取验证码"==btn_sendSMS){
			//显示输入验证码
			$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
		} else{
			$("#btn_sendSMS").addClass('disabled').attr('disabled',true);
		} 

		
	$("#input_RecommendNum,#vCodeId").keyup(function(){
		checkNext();
	});
	
	$("#input_certNo").blur(function(){
		//身份证号码验证
		var cert = $("#input_certNo").val();
		if (!Utils.isEmpty(cert)&&!Utils.IdentityCodeValid(cert)){
			Utils.alertinfo("请输入正确的身份证号码");
		}
		
		checkNext();
		
	});
	
	$("#mobileNoText").keyup(function(){
		var mobileNo = $("#mobileNoText").val();
		var btn_sendSMS = $("#btn_sendSMS").text();
		if (!Utils.isEmpty(mobileNo)&&Utils.checkMobile(mobileNo)&&!Utils.isEmpty(btn_sendSMS)&&"获取验证码"==btn_sendSMS){
			//显示输入验证码
			$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
		} else{
			$("#btn_sendSMS").addClass('disabled').attr('disabled',true);
		} 
		
		checkNext();
	});
	$("#mobileNoText").blur(function(){
		var mobileNo = $("#mobileNoText").val();
		var btn_sendSMS = $("#btn_sendSMS").text();
		if (!Utils.isEmpty(mobileNo)&&Utils.checkMobile(mobileNo)&&!Utils.isEmpty(btn_sendSMS)&&"获取验证码"==btn_sendSMS){
			//显示输入验证码
			$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
		}else{
			if(!Utils.isEmpty(mobileNo)&&(!Utils.isEmpty(btn_sendSMS)&&"获取验证码"==btn_sendSMS))
				Utils.alertinfo("请输入正确的手机号码");
			$("#btn_sendSMS").addClass('disabled').attr('disabled',true);
		}
		
		checkNext();
	});

	//获取验证码
	$("#btn_sendSMS").click( function(){
		if($("#btn_sendSMS").hasClass('disabled')){ //确定按钮可点击(华为机处理)
			return;
		}
		var mobileNo = $("#mobileNoText").val();
		if (Utils.isEmpty(mobileNo)){
	    	Utils.alertinfo("请输入您的手机号码");	
			return;
		}
		if (!Utils.checkMobile(mobileNo)){
	    	Utils.alertinfo("您输入的手机号码有误，请重新输入");	
			return;
		}
		
		var cert = $("#input_certNo").val();
		if (!Utils.isEmpty(cert)&&!Utils.IdentityCodeValid(cert)){
			Utils.alertinfo("请输入正确的身份证号码");
			return;
		}
		
		
		$("#btn_sendSMS").addClass('disabled');
		var vCode = $("#vCodeId").val();
		var param = {
				mobileNo: mobileNo,
				vBasis: vBasis,
				openId:openId
		};
		var $this = this;
		ajax({
			url:"../../weixin/sendRegisterSMS",
			data:param,
			success:function(data){
				if(Utils.isEmpty(data.errorCode)){
					$this.sendFlag=true;
					var count = 60;//60秒不允许再次发送
					var timerID = setInterval(function(){
						$('#btn_sendSMS').text(count + '秒后重发');
						count--;
						if(count == 0||$("#btn_sendSMS").length==0){
							clearInterval(timerID);
							$this.sendFlag=false;
							$("#btn_sendSMS").removeClass('disabled');
							$('#btn_sendSMS').text('获取验证码');
						}
					},1000);
					$('#btn_sendSMS').text(count+ '秒后重发');
					count--;
	
				}else{
					Utils.alertinfo(data.errorMessage);
					$("#btn_sendSMS").removeClass('disabled');
				}
		},
		error:function(){
			$("#btn_sendSMS").removeClass('disabled');
		}});
  	});
	
	
	
	$(".checkbox").click(function(){
		
		if($(".checkbox").hasClass("checked")){
			$(".checkbox").removeClass("checked");
		}else{
			$(".checkbox").addClass("checked");
		}

		checkNext();
	});
	
	
	$("#showAgreement").click(function(){
		$("#userRegPage2").show();
		$("#btn-wrap").show();
	});
	
	
	$("#agreeBtn").click(function(){
		$("#userRegPage2").hide();
		if(!$(".checkbox").hasClass("checked")){
			$(".checkbox").addClass("checked");
		}
		$("#btn-wrap").hide();
		checkNext();
	});
	
	$("#closeBtn").click(function(){
		$("#userRegPage2").hide();
		$("#btn-wrap").hide();
	});
	
	var vBasis='PB1101';
	$("#nextButton1").click(function(){
		
		if($("#nextButton1").hasClass('disabled')){ //确定按钮可点击(华为机处理)
			return;
		}
		
		var userName = $("#input_userName").val();
		var certNo = $("#input_certNo").val();
		var mobileNo = $("#mobileNoText").val();
		var vCode = $("#vCodeId").val();
		
		var recommendNum = $("#input_RecommendNum").val();
		
		if(Utils.isEmpty(openId)){
			 Utils.alertinfo("请从杭州银官方微信号注册！");
			 return;
		}
		if (!Utils.isEmpty(recommendNum)){
			if((recommendNum.length!=6 && recommendNum.length!=8 && recommendNum.length!=11)||!Utils.isInteger(recommendNum)){
				Utils.alertinfo("请输入6位、8位或11位数字邀请码");	
				return;					
			}
		}
		
		var param = {
				mobileNo:mobileNo,
				userName:userName,
				certNo:certNo,
				vCode:vCode,
				vBasis:vBasis,
				RecommendNum:recommendNum,
				openId:openId
		};
		Utils.openWaitlayer();
		ajax({
			url:"../../weixin/registerStep1",
			data:param, 
			success:function(data){
				Utils.closeWaitlayer();
				if(Utils.isEmpty(data.errorCode)){
					var totalNum = data.totalNum;
					var paramValue = {
							userName:userName,
							certNo:certNo};
					var random = data.random;
					location.href="wxAccountAddBankCard.html?userName="+encodeURIComponent(userName)
								+"&certNo="+encodeURIComponent(certNo)+"&random="+encodeURIComponent(random)+"&mobileNo="+encodeURIComponent(mobileNo)+"&openId="+encodeURIComponent(openId);
					
				}else{
					if(!Utils.isEmpty(data.errorCode)&&data.errorCode=="EBZX0101"){
						$("#dialogInfo").show();
					}else{
						 Utils.alertinfo(data.errorMessage);
					}
					$("#nextButton1").removeClass('disabled');
				}
			},
			error:function(){
				Utils.closeWaitlayer();
				$("#nextButton1").removeClass('disabled');
			}
		});
	});
	
	$("#loginZX").click(function(){
		$("#dialogInfo").hide();
		location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.yt.hz.financial#rd";
	});
	$("#cancle").click(function(){
		$("#dialogInfo").hide();
	})
	
	 function checkNext(){
		if(  ((!Utils.isEmpty($("#mobileNoText").val())&&Utils.checkMobile($("#mobileNoText").val()))&&
				(!Utils.isEmpty($('#vCodeId').val())&&($('#vCodeId').val().length==6))&&
				!Utils.isEmpty($('#input_userName').val())&&
				Utils.IdentityCodeValid($('#input_certNo').val())&&
				!Utils.isEmpty($('#input_certNo').val())&&($('#checkReg').hasClass("checked")))){
			    $("#nextButton1").removeClass('disabled').removeAttr('disabled');
		}else{
			    $("#nextButton1").addClass('disabled').attr('disabled',true);
		}
	}
	
	

	
	
});