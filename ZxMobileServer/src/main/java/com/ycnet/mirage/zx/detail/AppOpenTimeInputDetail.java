package com.ycnet.mirage.zx.detail;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * APP打开时间统计参数接收类
 * @author lingal
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AppOpenTimeInputDetail {
	
	//mac地址
	private String macAddress;
	
	//版本打开记录主键ID
	private Long versionOpenId;
	
	//打开时间（毫秒）
	private Long timeMillis;

	public String getMacAddress() {
		return macAddress;
	}

	public void setMacAddress(String macAddress) {
		this.macAddress = macAddress;
	}
	
	public Long getVersionOpenId() {
		return versionOpenId;
	}

	public void setVersionOpenId(Long versionOpenId) {
		this.versionOpenId = versionOpenId;
	}

	public Long getTimeMillis() {
		return timeMillis;
	}

	public void setTimeMillis(Long timeMillis) {
		this.timeMillis = timeMillis;
	}
}
