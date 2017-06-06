package com.ycnet.mirage.zx.integration.response.register;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MobRegStep1_Response extends BaseResponseCommon{
	
	private MobRegStep1ResponseCd cd;

	public MobRegStep1ResponseCd getCd() {
		return cd;
	}

	public void setCd(MobRegStep1ResponseCd cd) {
		this.cd = cd;
	}
	
}
