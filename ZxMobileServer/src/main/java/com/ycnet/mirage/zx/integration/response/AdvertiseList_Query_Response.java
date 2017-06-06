package com.ycnet.mirage.zx.integration.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AdvertiseList_Query_Response extends BaseResponseCommon{
	
	private AdvertiseListQueryResponseCd cd;

	public AdvertiseListQueryResponseCd getCd() {
		return cd;
	}

	public void setCd(AdvertiseListQueryResponseCd cd) {
		this.cd = cd;
	}
	
}
