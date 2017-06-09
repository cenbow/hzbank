package com.ycnet.mirage.zx.service;

import java.util.Map;

import com.ycnet.mirage.event.OperationSuccess;
import com.ycnet.mirage.zx.detail.InviteIdInputDetail;
import com.ycnet.mirage.zx.detail.NoSessionMobileInputDetail;
import com.ycnet.mirage.zx.detail.UserRegisterInputDetail;

public interface RegisterService {	

	/**
	 * 注册第一步
	 * @param detail
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> registerStep1(UserRegisterInputDetail detail) throws Exception;
	

	/**
	 * 注册第二步
	 * @param detail
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> registerStep2(UserRegisterInputDetail detail) throws Exception;
		

	/**
	 * 查询邀请码
	 * @param detail
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> inviteCodeQuery(InviteIdInputDetail detail) throws Exception;
	
	/**
	 * 发送短信验证码
	 * @param detail
	 * @return
	 * @throws Exception
	 */
	OperationSuccess sendRegisterSMS(NoSessionMobileInputDetail detail) throws Exception;
	

}
