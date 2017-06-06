package com.ycnet.mirage.zx.integration.response.register;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MobRegisterStep2_Response extends BaseResponseCommon{
	
	private MobRegisterStep2ResponseCd cd;

	public MobRegisterStep2ResponseCd getCd() {
		return cd;
	}

	public void setCd(MobRegisterStep2ResponseCd cd) {
		this.cd = cd;
	}
	
}
