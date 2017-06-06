package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PwdRandom_Get_Response extends BaseResponseCommon{
	
	private PwdRandomGetResponseCd cd;

	public PwdRandomGetResponseCd getCd() {
		return cd;
	}

	public void setCd(PwdRandomGetResponseCd cd) {
		this.cd = cd;
	}
	
}
