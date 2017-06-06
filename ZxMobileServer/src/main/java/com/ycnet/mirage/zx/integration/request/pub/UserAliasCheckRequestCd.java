package com.ycnet.mirage.zx.integration.request.pub;
import com.ycnet.mirage.zx.detail.ClientInfoDetail;
import com.ycnet.mirage.zx.detail.SessionTokenDetail;
import com.ycnet.mirage.zx.integration.request.ClientInfoRequestCommon;

public class UserAliasCheckRequestCd extends ClientInfoRequestCommon{
	
	private String customerAlias;
	
	public UserAliasCheckRequestCd(){
		
	}
	
	public UserAliasCheckRequestCd(ClientInfoDetail detail){
		super(detail);
	}

	public UserAliasCheckRequestCd(SessionTokenDetail detail){
		super(detail);
	}
	
	public String getCustomerAlias() {
		return customerAlias;
	}

	public void setCustomerAlias(String customerAlias) {
		this.customerAlias = customerAlias;
	}
	
}
