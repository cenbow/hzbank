package com.ycnet.mirage.zx.service.impl;

import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ycnet.mirage.context.MirageException;
import com.ycnet.mirage.event.OperationSuccess;
import com.ycnet.mirage.zx.annotation.MirageLog;
import com.ycnet.mirage.zx.config.FaceConfig;
import com.ycnet.mirage.zx.config.ImageServerConfig;
import com.ycnet.mirage.zx.config.MobileApplicationErrorCode;
import com.ycnet.mirage.zx.detail.InviteIdInputDetail;
import com.ycnet.mirage.zx.detail.NoSessionMobileInputDetail;
import com.ycnet.mirage.zx.detail.UserRegisterInputDetail;
import com.ycnet.mirage.zx.integration.request.register.MobRegisterStep1_Request;
import com.ycnet.mirage.zx.integration.request.register.MobRegisterStep2_Request;
import com.ycnet.mirage.zx.integration.request.register.MobRegisterStep3_Request;
import com.ycnet.mirage.zx.integration.response.pub.Mobile_Send_Response;
import com.ycnet.mirage.zx.integration.response.register.InviteIdQuery_Response;
import com.ycnet.mirage.zx.integration.response.register.MobRegisterStep1_Response;
import com.ycnet.mirage.zx.integration.response.register.MobRegisterStep2_Response;
import com.ycnet.mirage.zx.integration.response.register.MobRegisterStep3_Response;
import com.ycnet.mirage.zx.service.RegisterService;

@Component
public class RegisterServiceImpl implements RegisterService {

	private Logger logger = LoggerFactory.getLogger(RegisterServiceImpl.class);
	

	
	@Autowired
	FaceConfig faceConfig;
	
	@Autowired
	ImageServerConfig imageServerConfig;
	

	

	@Override
	@MirageLog(value = "实名注册步骤一功能")
	public Map<String, Object> registerStep1(UserRegisterInputDetail detail)
			throws Exception {
		logger.info("实名注册步骤一功能开始");
		
		if(detail.getMobileNo() == null  || "".equals(detail.getMobileNo()))
		{
			logger.info("上送的手机号为空");
			
			throw new MirageException(MobileApplicationErrorCode.TRAN_FAIL_ERROR, "用户手机号不能为空");
		}
		
		MobRegisterStep1_Request request = new MobRegisterStep1_Request(detail);		
		request.setReqServiceId("registerStep1");
		
		//MobRegisterStep1_Response response=xmlJsonGateway.registerStep1Request(request);
		
		Map<String, Object> returnMap = new HashMap<String, Object>();	
	/*	returnMap.put("totalNum", response.getCd().getTotalNum());
		returnMap.put("random", response.getCd().getRandom());
		returnMap.put("orcFlag", response.getCd().getOrcFlag());*/
		returnMap.put("grayFlag", detail.getGrayFlag());
		
		logger.info("实名注册步骤一功能结束");
		return returnMap;
	}

	@Override
	@MirageLog(value = "实名注册步骤二功能")
	public Map<String, Object> registerStep2(UserRegisterInputDetail detail)
			throws Exception {
		return null;
	}

	@Override
	@MirageLog(value = "查询邀请码功能")
	public Map<String, Object> inviteCodeQuery(InviteIdInputDetail detail)
			throws Exception {
		logger.info("查询邀请码功能开始");
		
		/*InviteIdQuery_Request request = new InviteIdQuery_Request(detail);	
		request.setReqServiceId("inviteIdQuery");
		
		InviteIdQuery_Response response = xmlJsonGateway.inviteIdQuery(request);*/
		
		Map<String, Object> returnMap = new HashMap<String, Object>();
		
		//returnMap.put("inviteCode", response.getCd().getInviteCode());
		
		logger.info("查询邀请码功能结束");
		return returnMap;
	}

	@Override
	@MirageLog(value = "发送注册短信功能")
	public OperationSuccess sendRegisterSMS(NoSessionMobileInputDetail detail)
			throws Exception {
		logger.info("发送注册短信功能开始");
		
//		Mobile_Send_Request request = new Mobile_Send_Request();
		
//		request.setReqServiceId("sendRegisterSMS");
		
//		MobileSendRequestCd cd = new MobileSendRequestCd(detail);
		
//		cd.setMobileNo(detail.getMobileNo());
//		cd.setvBasis(detail.getvBasis());	
//		
//		request.setCd(cd);
//		
//		Mobile_Send_Response response = xmlJsonGateway.sendRegisterSMS(request);
		
		logger.info("发送注册短信功能结束");
		return new OperationSuccess();
	}
	
	public static int getRandomString(){
		Random random = new Random();
		int x = random.nextInt(899999);
		x = x +100000;
		return x;
	}
}
