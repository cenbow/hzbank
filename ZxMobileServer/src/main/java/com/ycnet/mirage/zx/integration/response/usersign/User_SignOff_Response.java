package com.ycnet.mirage.zx.integration.response.usersign;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class User_SignOff_Response extends BaseResponseCommon{
	
	private UserSignOffResponseCd cd;

	public UserSignOffResponseCd getCd() {
		return cd;
	}

	public void setCd(UserSignOffResponseCd cd) {
		this.cd = cd;
	}
	
}
