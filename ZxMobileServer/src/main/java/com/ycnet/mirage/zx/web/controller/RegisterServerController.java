package com.ycnet.mirage.zx.web.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ycnet.mirage.event.OperationSuccess;
import com.ycnet.mirage.zx.detail.InviteIdInputDetail;
import com.ycnet.mirage.zx.detail.NoSessionMobileInputDetail;
import com.ycnet.mirage.zx.detail.UserRegisterInputDetail;
import com.ycnet.mirage.zx.integration.response.pub.Mobile_Send_Response;
import com.ycnet.mirage.zx.service.RegisterService;
import com.ycnet.mirage.zx.utils.SpecificalMirageController;

/**
 * 注册接口
 * @author lingal
 *
 */
@RestController
@RequestMapping("/regServer")
public class RegisterServerController extends SpecificalMirageController{
	
	@Autowired
	RegisterService registerService;

	/**
	 *  注册第一步
	 * @param detail
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/registerStep1", method = RequestMethod.POST)
	public Map<String, Object> registerStep1(@RequestBody UserRegisterInputDetail detail) throws Exception
	{
		return registerService.registerStep1(detail);
	}
	
	/**
	 *  注册第二步
	 * @param detail
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/registerStep2", method = RequestMethod.POST)
	public Map<String, Object> registerStep2(@RequestBody UserRegisterInputDetail detail) throws Exception
	{
		return registerService.registerStep2(detail);
	}
	
	/**
	 *  注册第三步
	 * @param detail
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/registerStep3", method = RequestMethod.POST)
	public Map<String, Object> registerStep3(@RequestBody UserRegisterInputDetail detail) throws Exception
	{
		return registerService.registerStep3(detail);
	}
	
	/**
	 *  查询邀请码
	 * @param detail
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/inviteCodeQuery", method = RequestMethod.POST)
	public Map<String, Object> inviteCodeQuery(@RequestBody InviteIdInputDetail detail) throws Exception
	{
		return registerService.inviteCodeQuery(detail);
	}
	
	/**
	 *  发送注册短信
	 * @param detail
	 * @return
	 * @throws Exception
	 */	
	@RequestMapping(value = "/sendRegisterSMS", method = RequestMethod.POST)
	public OperationSuccess sendMobile(@RequestBody NoSessionMobileInputDetail detail) throws Exception
	{
		return registerService.sendRegisterSMS(detail);
	}

}
