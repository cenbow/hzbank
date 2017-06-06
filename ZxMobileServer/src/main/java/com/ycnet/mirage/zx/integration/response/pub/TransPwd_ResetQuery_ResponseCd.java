package com.ycnet.mirage.zx.integration.response.pub;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TransPwd_ResetQuery_ResponseCd{
	private String turnPageTotalNum;
	
	private List<IPwdResetList> iPwdResetList;
	
	private String sysTime;

	public String getTurnPageTotalNum() {
		return turnPageTotalNum;
	}

	public void setTurnPageTotalNum(String turnPageTotalNum) {
		this.turnPageTotalNum = turnPageTotalNum;
	}

	public List<IPwdResetList> getiPwdResetList() {
		return iPwdResetList;
	}

	public void setiPwdResetList(List<IPwdResetList> iPwdResetList) {
		this.iPwdResetList = iPwdResetList;
	}

	public String getSysTime() {
		return sysTime;
	}

	public void setSysTime(String sysTime) {
		this.sysTime = sysTime;
	}

}
