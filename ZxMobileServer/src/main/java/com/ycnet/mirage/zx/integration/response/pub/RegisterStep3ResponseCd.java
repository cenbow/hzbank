package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class RegisterStep3ResponseCd {
	
	private String cardNo;
	
	private String scoreTotal;
	
	private String scoreCurr;
	
	private String fundField1;
	
	private String fundField2;
	
	private String fundField3;
	
	private String fundField4;
	
	private String pld_couponcode;

	public String getCardNo() {
		return cardNo;
	}

	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}

	public String getScoreTotal() {
		return scoreTotal;
	}

	public void setScoreTotal(String scoreTotal) {
		this.scoreTotal = scoreTotal;
	}

	public String getScoreCurr() {
		return scoreCurr;
	}

	public void setScoreCurr(String scoreCurr) {
		this.scoreCurr = scoreCurr;
	}

	public String getFundField1() {
		return fundField1;
	}

	public void setFundField1(String fundField1) {
		this.fundField1 = fundField1;
	}

	public String getFundField2() {
		return fundField2;
	}

	public void setFundField2(String fundField2) {
		this.fundField2 = fundField2;
	}

	public String getFundField3() {
		return fundField3;
	}

	public void setFundField3(String fundField3) {
		this.fundField3 = fundField3;
	}

	public String getFundField4() {
		return fundField4;
	}

	public void setFundField4(String fundField4) {
		this.fundField4 = fundField4;
	}

	public String getPld_couponcode() {
		return pld_couponcode;
	}

	public void setPld_couponcode(String pld_couponcode) {
		this.pld_couponcode = pld_couponcode;
	}
	
}
