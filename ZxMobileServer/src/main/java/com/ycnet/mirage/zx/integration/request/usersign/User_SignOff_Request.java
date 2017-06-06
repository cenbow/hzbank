package com.ycnet.mirage.zx.integration.request.usersign;

import javax.xml.bind.annotation.XmlRootElement;

import com.ycnet.mirage.zx.integration.request.BaseRequestCommon;

@XmlRootElement(name = "root")
public class User_SignOff_Request extends BaseRequestCommon{
	
	private UserSignOffRequestCd cd;

	public UserSignOffRequestCd getCd() {
		return cd;
	}

	public void setCd(UserSignOffRequestCd cd) {
		this.cd = cd;
	}
	
}
