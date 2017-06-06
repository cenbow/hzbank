package com.ycnet.mirage.zx.integration.response.register;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MobRegisterStep3_Response extends BaseResponseCommon{
	
	private MobRegisterStep3ResponseCd cd;

	public MobRegisterStep3ResponseCd getCd() {
		return cd;
	}

	public void setCd(MobRegisterStep3ResponseCd cd) {
		this.cd = cd;
	}
	
}
