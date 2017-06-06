package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class LogonPwd_Reset_Response extends BaseResponseCommon{
	
	private LogonPwdResetResponseCd cd;

	public LogonPwdResetResponseCd getCd() {
		return cd;
	}

	public void setCd(LogonPwdResetResponseCd cd) {
		this.cd = cd;
	}
	
}
