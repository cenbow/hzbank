package com.ycnet.mirage.zx.integration.response.pub;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.integration.response.BaseResponseCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class FaceVerificationCheckResponse extends BaseResponseCommon{
	
	private FaceVerificationCheckResponseCd cd;

	public FaceVerificationCheckResponseCd getCd() {
		return cd;
	}

	public void setCd(FaceVerificationCheckResponseCd cd) {
		this.cd = cd;
	}


}
	