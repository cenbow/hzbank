package com.ycnet.mirage.zx.integration.response.usersetting;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ScoreDetail_Query_Response extends BaseResponseCommon{
	
	private ScoreDetailQueryResponseCd cd;

	public ScoreDetailQueryResponseCd getCd() {
		return cd;
	}

	public void setCd(ScoreDetailQueryResponseCd cd) {
		this.cd = cd;
	}
	
}
