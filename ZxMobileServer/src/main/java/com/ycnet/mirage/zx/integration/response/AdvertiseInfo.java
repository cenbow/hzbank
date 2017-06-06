package com.ycnet.mirage.zx.integration.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AdvertiseInfo {
	
	private String adCode;
	
	private String adOrder;
	
	private String adName;
	
	private String adSize;
	
	private String adUrl;
	
	private String adIsPointTo;
	
	private String adPointTo;

	public String getAdCode() {
		return adCode;
	}

	public void setAdCode(String adCode) {
		this.adCode = adCode;
	}

	public String getAdOrder() {
		return adOrder;
	}

	public void setAdOrder(String adOrder) {
		this.adOrder = adOrder;
	}

	public String getAdName() {
		return adName;
	}

	public void setAdName(String adName) {
		this.adName = adName;
	}

	public String getAdSize() {
		return adSize;
	}

	public void setAdSize(String adSize) {
		this.adSize = adSize;
	}

	public String getAdUrl() {
		return adUrl;
	}

	public void setAdUrl(String adUrl) {
		this.adUrl = adUrl;
	}

	public String getAdIsPointTo() {
		return adIsPointTo;
	}

	public void setAdIsPointTo(String adIsPointTo) {
		this.adIsPointTo = adIsPointTo;
	}

	public String getAdPointTo() {
		return adPointTo;
	}

	public void setAdPointTo(String adPointTo) {
		this.adPointTo = adPointTo;
	}
	
}
