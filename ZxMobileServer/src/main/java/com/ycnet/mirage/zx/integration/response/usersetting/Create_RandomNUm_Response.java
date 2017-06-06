package com.ycnet.mirage.zx.integration.response.usersetting;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Create_RandomNUm_Response extends BaseResponseCommon{
	
	private CreateRandomNUmResponseCd cd;

	public CreateRandomNUmResponseCd getCd() {
		return cd;
	}

	public void setCd(CreateRandomNUmResponseCd cd) {
		this.cd = cd;
	}
	
}
