package com.ycnet.mirage.zx.integration.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AdvertiseListQueryResponseCd {
	
	private List<AdvertiseInfo> adList;

	public List<AdvertiseInfo> getAdList() {
		return adList;
	}

	public void setAdList(List<AdvertiseInfo> adList) {
		this.adList = adList;
	}
	
}
