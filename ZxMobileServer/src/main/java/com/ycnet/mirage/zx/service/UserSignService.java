package com.ycnet.mirage.zx.service;

import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import com.ycnet.mirage.zx.detail.SessionTokenDetail;
import com.ycnet.mirage.zx.detail.UserSignInDetail;

public interface UserSignService {
	
	/**
	 * 用户登录
	 * @param detail
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> userSignIn(UserSignInDetail detail) throws Exception;
	
	/**
	 * 用户退出
	 * @param detail
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> userSignOff(SessionTokenDetail detail) throws Exception;
	
	/**
	 * 获取图片验证码
	 * @param request
	 * @throws Exception
	 */
	void getImageCode( String key,HttpServletResponse response) throws Exception;
}
