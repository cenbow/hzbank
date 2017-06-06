package com.ycnet.mirage.zx.integration.request.usersign;
import com.ycnet.mirage.zx.detail.ClientInfoDetail;
import com.ycnet.mirage.zx.detail.SessionTokenDetail;
import com.ycnet.mirage.zx.integration.request.ClientInfoRequestCommon;

public class UserSignOffRequestCd extends ClientInfoRequestCommon{
	
	private String customerId;
	
	private String appKey;
	
	public UserSignOffRequestCd(){
		
	}
	
	public UserSignOffRequestCd(ClientInfoDetail detail){
		super(detail);
	}

	public UserSignOffRequestCd(SessionTokenDetail detail){
		super(detail);
	}
	
	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getAppKey() {
		return appKey;
	}

	public void setAppKey(String appKey) {
		this.appKey = appKey;
	}
	
}
