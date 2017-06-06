package com.ycnet.mirage.zx.web.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ycnet.mirage.zx.detail.SessionTokenDetail;
import com.ycnet.mirage.zx.detail.UserSignInDetail;
import com.ycnet.mirage.zx.service.UserSignService;
import com.ycnet.mirage.zx.utils.SpecificalMirageController;

@RestController
@RequestMapping("/userSign")
public class UserSignController extends SpecificalMirageController{
	
	@Autowired
	UserSignService userSignService;
	
	/**
	 * 用户登录
	 * @param detail
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/signIn", method = RequestMethod.POST)
	public Map<String, Object> userSignIn(@RequestBody UserSignInDetail detail) throws Exception 
	{
		return userSignService.userSignIn(detail);
	}
	
	/**
	 * 用户退出
	 * @param detail
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/signOff", method = RequestMethod.POST)
	public Map<String, Object> userSignOff(@RequestBody SessionTokenDetail detail) throws Exception
	{
		return userSignService.userSignOff(detail);
	}
	
	/**
	 * 获取图形验证码
	 * @param response
	 * @return
	 * @throws Exception
	 */	
	
	@RequestMapping(value = "/imageCode", method = RequestMethod.GET)
	public void getImageCode( String key, HttpServletResponse response) throws Exception
	{
		userSignService.getImageCode(key,response);
	}
	
}
