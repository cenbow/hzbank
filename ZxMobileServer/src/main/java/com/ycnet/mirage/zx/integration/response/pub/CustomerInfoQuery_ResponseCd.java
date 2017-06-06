package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CustomerInfoQuery_ResponseCd {

	private String profession; //职业
	
	private String certExpiryDate;//证件到期日

	public String getProfession() {
		return profession;
	}

	public void setProfession(String profession) {
		this.profession = profession;
	}

	public String getCertExpiryDate() {
		return certExpiryDate;
	}

	public void setCertExpiryDate(String certExpiryDate) {
		this.certExpiryDate = certExpiryDate;
	}

}
