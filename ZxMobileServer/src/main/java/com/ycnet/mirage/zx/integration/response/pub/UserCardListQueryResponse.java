package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserCardListQueryResponse extends BaseResponseCommon{
	
	private UserCardListQueryResponseCd cd;

	public UserCardListQueryResponseCd getCd() {
		return cd;
	}

	public void setCd(UserCardListQueryResponseCd cd) {
		this.cd = cd;
	}
	
}
