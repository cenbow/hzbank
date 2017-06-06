package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PubAppar_Query_SingleResponse extends BaseResponseCommon{
	
	private PubApparQuerySingleResponseCd cd;

	public PubApparQuerySingleResponseCd getCd() {
		return cd;
	}

	public void setCd(PubApparQuerySingleResponseCd cd) {
		this.cd = cd;
	}

	
}
