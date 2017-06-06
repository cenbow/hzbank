package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TransPwd_ResetQuery_Response extends BaseResponseCommon{
	private TransPwd_ResetQuery_ResponseCd cd;

	public TransPwd_ResetQuery_ResponseCd getCd() {
		return cd;
	}

	public void setCd(TransPwd_ResetQuery_ResponseCd cd) {
		this.cd = cd;
	}



}
