package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Register_Step2_Response extends BaseResponseCommon{
	
	private RegisterStep2ResponseCd cd;

	public RegisterStep2ResponseCd getCd() {
		return cd;
	}

	public void setCd(RegisterStep2ResponseCd cd) {
		this.cd = cd;
	}
	
}
