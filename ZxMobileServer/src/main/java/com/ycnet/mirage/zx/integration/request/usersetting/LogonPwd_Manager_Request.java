package com.ycnet.mirage.zx.integration.request.usersetting;

import javax.xml.bind.annotation.XmlRootElement;

import com.ycnet.mirage.zx.integration.request.BaseRequestCommon;

/**
 * 登录密码关闭
 * @author lingal
 *
 */
@XmlRootElement(name = "root")
public class LogonPwd_Manager_Request extends BaseRequestCommon{
	
	private LogonPwdManagerRequestCd cd;

	public LogonPwdManagerRequestCd getCd() {
		return cd;
	}

	public void setCd(LogonPwdManagerRequestCd cd) {
		this.cd = cd;
	}
	
}
