package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;


@JsonIgnoreProperties(ignoreUnknown = true)
public class CertNoCheck_Response extends BaseResponseCommon{
	
	private CertNoCheckResponseCd cd;

	/**
	 * @return the cd
	 */
	public CertNoCheckResponseCd getCd() {
		return cd;
	}

	/**
	 * @param cd the cd to set
	 */
	public void setCd(CertNoCheckResponseCd cd) {
		this.cd = cd;
	}


}
