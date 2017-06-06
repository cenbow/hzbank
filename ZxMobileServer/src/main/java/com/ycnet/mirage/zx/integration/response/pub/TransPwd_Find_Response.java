package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TransPwd_Find_Response extends BaseResponseCommon{
	private TransPwd_Find_ResponseCd cd;

	public TransPwd_Find_ResponseCd getCd() {
		return cd;
	}

	public void setCd(TransPwd_Find_ResponseCd cd) {
		this.cd = cd;
	}


}
