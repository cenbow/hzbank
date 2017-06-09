package com.ycnet.mirage.zx.detail;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class NoSessionMobileInputDetail extends ClientInfoDetail{

	private String mobileNo;
	
    private String vBasis;

	public String getMobileNo() {
		return mobileNo;
	}

	public void setMobileNo(String mobileNo) {
		this.mobileNo = mobileNo;
	}

	public String getvBasis() {
		return vBasis;
	}

	public void setvBasis(String vBasis) {
		this.vBasis = vBasis;
	}
}
