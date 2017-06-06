package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class LogonPwd_Reset_One_Response extends BaseResponseCommon{
	private LogonPwd_Reset_One_ResponseCd cd;

	public LogonPwd_Reset_One_ResponseCd getCd() {
		return cd;
	}

	public void setCd(LogonPwd_Reset_One_ResponseCd cd) {
		this.cd = cd;
	}
	
}
