package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CardBin_Check_Response extends BaseResponseCommon{
	
	private CardBinCheckResponseCd cd;

	public CardBinCheckResponseCd getCd() {
		return cd;
	}

	public void setCd(CardBinCheckResponseCd cd) {
		this.cd = cd;
	}
	
}
