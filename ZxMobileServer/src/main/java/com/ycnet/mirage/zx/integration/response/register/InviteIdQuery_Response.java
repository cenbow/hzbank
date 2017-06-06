package com.ycnet.mirage.zx.integration.response.register;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class InviteIdQuery_Response extends BaseResponseCommon{
	
	private InviteIdQuery_ResponseCd cd;

	public InviteIdQuery_ResponseCd getCd() {
		return cd;
	}

	public void setCd(InviteIdQuery_ResponseCd cd) {
		this.cd = cd;
	}
	
}
