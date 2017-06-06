package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Register_Step3_Response extends BaseResponseCommon{
	
	private RegisterStep3ResponseCd cd;

	public RegisterStep3ResponseCd getCd() {
		return cd;
	}

	public void setCd(RegisterStep3ResponseCd cd) {
		this.cd = cd;
	}
	
}
