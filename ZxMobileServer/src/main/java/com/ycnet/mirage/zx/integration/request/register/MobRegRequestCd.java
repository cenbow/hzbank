package com.ycnet.mirage.zx.integration.request.register;

import javax.xml.bind.annotation.XmlElement;

import com.ycnet.mirage.zx.detail.ClientInfoDetail;
import com.ycnet.mirage.zx.detail.SessionTokenDetail;
import com.ycnet.mirage.zx.integration.request.ClientInfoRequestCommon;

public class MobRegRequestCd extends ClientInfoRequestCommon{
			
	private String mobileNo;
	
	private String vCode;
	
	private String vBasis;
	
	private String password;

	private String pwdkey;
	
	private String RecommendNum;	
	
	public MobRegRequestCd(){
		
	}
	
	public MobRegRequestCd(ClientInfoDetail detail){
		super(detail);
	}

	public MobRegRequestCd(SessionTokenDetail detail){
		super(detail);
	}
	

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getMobileNo() {
		return mobileNo;
	}

	public void setMobileNo(String mobileNo) {
		this.mobileNo = mobileNo;
	}

	public String getvCode() {
		return vCode;
	}

	public void setvCode(String vCode) {
		this.vCode = vCode;
	}

	public String getvBasis() {
		return vBasis;
	}

	public void setvBasis(String vBasis) {
		this.vBasis = vBasis;
	}

	public String getPwdkey() {
		return pwdkey;
	}

	public void setPwdkey(String pwdkey) {
		this.pwdkey = pwdkey;
	}
	
	@XmlElement(name = "RecommendNum")
	public String getRecommendNum() {
		return RecommendNum;
	}

	public void setRecommendNum(String recommendNum) {
		RecommendNum = recommendNum;
	}


}
