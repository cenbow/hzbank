package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserCardManageResponse extends BaseResponseCommon{
	
	private UserCardManageResponseCd cd;

	public UserCardManageResponseCd getCd() {
		return cd;
	}

	public void setCd(UserCardManageResponseCd cd) {
		this.cd = cd;
	}
	
}
