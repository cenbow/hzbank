package com.ycnet.mirage.zx.integration.response.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class queryTransferLimitAmt_ResponseCd {
	private String maxLimitAmt;//大额最低额度
	private String liqLimt;		//网银互联汇款最高金额
	private String minChanAmt;//小额最低金额
	private String maxChanAmt;//大额最低金额
	private String startTime; //大额开始时间
	private String endTime;	  //大额结束时间
	
	public String getMaxLimitAmt() {
		return maxLimitAmt;
	}
	public void setMaxLimitAmt(String maxLimitAmt) {
		this.maxLimitAmt = maxLimitAmt;
	}
	public String getLiqLimt() {
		return liqLimt;
	}
	public void setLiqLimt(String liqLimt) {
		this.liqLimt = liqLimt;
	}
	public String getMinChanAmt() {
		return minChanAmt;
	}
	public void setMinChanAmt(String minChanAmt) {
		this.minChanAmt = minChanAmt;
	}
	public String getMaxChanAmt() {
		return maxChanAmt;
	}
	public void setMaxChanAmt(String maxChanAmt) {
		this.maxChanAmt = maxChanAmt;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	
}
