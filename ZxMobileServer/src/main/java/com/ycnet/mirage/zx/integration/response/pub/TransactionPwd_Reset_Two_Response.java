package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionPwd_Reset_Two_Response extends BaseResponseCommon{
	private TransactionPwd_Reset_Two_ResponseCd cd;

	public TransactionPwd_Reset_Two_ResponseCd getCd() {
		return cd;
	}

	public void setCd(TransactionPwd_Reset_Two_ResponseCd cd) {
		this.cd = cd;
	}

	
}
