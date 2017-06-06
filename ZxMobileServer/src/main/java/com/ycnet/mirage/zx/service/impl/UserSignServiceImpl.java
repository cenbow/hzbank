package com.ycnet.mirage.zx.service.impl;

import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.ycnet.mirage.zx.annotation.MirageLog;
import com.ycnet.mirage.zx.detail.SessionTokenDetail;
import com.ycnet.mirage.zx.detail.UserSignInDetail;
import com.ycnet.mirage.zx.service.UserSignService;


@Component
public class UserSignServiceImpl implements UserSignService{
	

	
	private static final Format tranFormat = new SimpleDateFormat("yyyyMMddHHmmss");
	
	private Logger logger = LoggerFactory.getLogger(UserSignServiceImpl.class);
	
	@Override
	@MirageLog(value = "直销用户登录功能")
	public Map<String, Object> userSignIn(UserSignInDetail detail)
			throws Exception {
		logger.info("直销用户登录功能开始");
		
				
		Calendar calendar = Calendar.getInstance();
		
	
			
			Map<String, Object> sessionMap = new HashMap<String, Object>();
			
			sessionMap.put("sessionToken", 1);
			sessionMap.put("customerId", 2);
			sessionMap.put("iAccountInfo", 3);
			sessionMap.put("iCardInfo", 4);
			sessionMap.put("customerLastLogon", 5);
			sessionMap.put("customerLogonCount", 6);
			sessionMap.put("pwdModify", 7);
			sessionMap.put("pwdMessage", 8);
			sessionMap.put("customerNameCN", 9);
			//返回服务器日期
			Format format = new SimpleDateFormat("yyyyMMddhhmmss");
			
			String sysDate = format.format(calendar.getTime());
			sessionMap.put("sysDate", sysDate);
			
			logger.info("直销用户登录功能结束");
			return sessionMap;
		}

	@Override
	public Map<String, Object> userSignOff(SessionTokenDetail detail) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void getImageCode(String key, HttpServletResponse response) throws Exception {
		// TODO Auto-generated method stub
		
	}
		
}
	
	

