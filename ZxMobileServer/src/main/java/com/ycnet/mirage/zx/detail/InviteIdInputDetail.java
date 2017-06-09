package com.ycnet.mirage.zx.detail;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 获取邀请人接收类
 * @author lingal
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class InviteIdInputDetail extends ClientInfoDetail{
	
	private String mobileNo;

	public String getMobileNo() {
		return mobileNo;
	}

	public void setMobileNo(String mobileNo) {
		this.mobileNo = mobileNo;
	}

}
