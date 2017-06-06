package com.ycnet.mirage.zx.integration.response.register;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MobRegisterStep1_Response extends BaseResponseCommon{
	
	private MobRegisterStep1ResponseCd cd;

	public MobRegisterStep1ResponseCd getCd() {
		return cd;
	}

	public void setCd(MobRegisterStep1ResponseCd cd) {
		this.cd = cd;
	}
	
}
