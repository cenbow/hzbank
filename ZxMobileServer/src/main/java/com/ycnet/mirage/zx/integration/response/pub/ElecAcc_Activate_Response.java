package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ElecAcc_Activate_Response extends BaseResponseCommon{
	
	private ElecAcc_Activate_ResponseCd cd;

	public ElecAcc_Activate_ResponseCd getCd() {
		return cd;
	}

	public void setCd(ElecAcc_Activate_ResponseCd cd) {
		this.cd = cd;
	}
}
