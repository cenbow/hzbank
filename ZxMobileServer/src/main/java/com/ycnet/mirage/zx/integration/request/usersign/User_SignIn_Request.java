package com.ycnet.mirage.zx.integration.request.usersign;

import javax.xml.bind.annotation.XmlRootElement;

import com.ycnet.mirage.zx.detail.UserSignInDetail;
import com.ycnet.mirage.zx.integration.request.BaseRequestCommon;

/**
 * 用户登录发送报文
 * @author lingal
 */
@XmlRootElement(name = "root")
public class User_SignIn_Request extends BaseRequestCommon{
	
	private UserSignInRequestCd cd;
	
	public User_SignIn_Request() {
		// TODO Auto-generated constructor stub
	}
	
	public User_SignIn_Request(UserSignInDetail detail)
	{
		UserSignInRequestCd cd = new UserSignInRequestCd(detail);
		
		cd.setAppKey(detail.getAppKey());
		cd.setCheckCode(detail.getCheckCode());
		cd.setCustomerId(detail.getCustomerId());
		cd.setLogonLanguage(detail.getLogonLanguage());
		cd.setLogonType(detail.getLogonType());
		cd.setNetType(detail.getNetType());
		cd.setPassword(detail.getPassword());
		cd.setPwdkey(detail.getPwdkey());
		cd.setSubmitTimeStamp(detail.getSubmitTimeStamp());
		cd.setUserType(detail.getUserType());
		
		setCd(cd);
	}

	public UserSignInRequestCd getCd() {
		return cd;
	}

	public void setCd(UserSignInRequestCd cd) {
		this.cd = cd;
	}
	
}
