package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Register_Step1_Response extends BaseResponseCommon{
	
	private RegisterStep1ResponseCd cd;

	public RegisterStep1ResponseCd getCd() {
		return cd;
	}

	public void setCd(RegisterStep1ResponseCd cd) {
		this.cd = cd;
	}
	
}
