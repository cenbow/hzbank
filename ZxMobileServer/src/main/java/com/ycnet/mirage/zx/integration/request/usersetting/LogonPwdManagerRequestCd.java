package com.ycnet.mirage.zx.integration.request.usersetting;
import com.ycnet.mirage.zx.detail.ClientInfoDetail;
import com.ycnet.mirage.zx.detail.SessionTokenDetail;
import com.ycnet.mirage.zx.integration.request.ClientInfoRequestCommon;

public class LogonPwdManagerRequestCd extends ClientInfoRequestCommon{
	
	private String pswType;
	
	private String password;
	
	private String pwdKey;
	
	public LogonPwdManagerRequestCd(){
		
	}
	
	public LogonPwdManagerRequestCd(ClientInfoDetail detail){
		super(detail);
	}

	public LogonPwdManagerRequestCd(SessionTokenDetail detail){
		super(detail);
	}
	
	public String getPwdKey() {
		return pwdKey;
	}

	public void setPwdKey(String pwdKey) {
		this.pwdKey = pwdKey;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPswType() {
		return pswType;
	}

	public void setPswType(String pswType) {
		this.pswType = pswType;
	}
	
}
