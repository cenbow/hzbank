package com.ycnet.mirage.zx.integration.request.pub;

import javax.xml.bind.annotation.XmlRootElement;

import com.ycnet.mirage.zx.integration.request.BaseRequestCommon;

@XmlRootElement(name = "root")
public class UserAlias_Check_Request extends BaseRequestCommon{
	
	private UserAliasCheckRequestCd cd;

	public UserAliasCheckRequestCd getCd() {
		return cd;
	}

	public void setCd(UserAliasCheckRequestCd cd) {
		this.cd = cd;
	}
	
}
