package com.ycnet.mirage.zx.integration.request.pub;
import com.ycnet.mirage.zx.detail.ClientInfoDetail;
import com.ycnet.mirage.zx.detail.SessionTokenDetail;
import com.ycnet.mirage.zx.integration.request.ClientInfoRequestCommon;

public class PubApparQuerySingleRequestCd extends ClientInfoRequestCommon{
	
	private String aprCode;
	
	private String aprValue;
	
	public PubApparQuerySingleRequestCd(){
		
	}
	
	public PubApparQuerySingleRequestCd(ClientInfoDetail detail){
		super(detail);
	}

	public PubApparQuerySingleRequestCd(SessionTokenDetail detail){
		super(detail);
	}
	
	public String getAprCode() {
		return aprCode;
	}

	public void setAprCode(String aprCode) {
		this.aprCode = aprCode;
	}

	public String getAprValue() {
		return aprValue;
	}

	public void setAprValue(String aprValue) {
		this.aprValue = aprValue;
	}
	
}
