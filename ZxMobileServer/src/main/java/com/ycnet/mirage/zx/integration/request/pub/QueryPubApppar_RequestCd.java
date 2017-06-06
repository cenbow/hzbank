package com.ycnet.mirage.zx.integration.request.pub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.detail.ClientInfoDetail;
import com.ycnet.mirage.zx.detail.SessionTokenDetail;
import com.ycnet.mirage.zx.integration.request.ClientInfoRequestCommon;

@JsonIgnoreProperties(ignoreUnknown = true)
public class QueryPubApppar_RequestCd extends ClientInfoRequestCommon{
	
	private String aprCode;
	
	public QueryPubApppar_RequestCd(){
		
	}
	
	public QueryPubApppar_RequestCd(ClientInfoDetail detail){
		super(detail);
	}

	public QueryPubApppar_RequestCd(SessionTokenDetail detail){
		super(detail);
	}
	
	public String getAprCode() {
		return aprCode;
	}

	public void setAprCode(String aprCode) {
		this.aprCode = aprCode;
	}
	
	
}
