package com.ycnet.mirage.zx.integration.request.register;

import javax.xml.bind.annotation.XmlElement;

import com.ycnet.mirage.zx.detail.ClientInfoDetail;
import com.ycnet.mirage.zx.integration.request.ClientInfoRequestCommon;

public class MobRegisterStep1RequestCd extends ClientInfoRequestCommon{
		
	private String mobileNo;
	
	private String vCode;
	
	private String vBasis;
		
	private String RecommendNum;
	
	public MobRegisterStep1RequestCd(){
		
	}
	
	public MobRegisterStep1RequestCd(ClientInfoDetail detail){
		super(detail);
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
	
	@XmlElement(name = "RecommendNum")
	public String getRecommendNum() {
		return RecommendNum;
	}

	public void setRecommendNum(String recommendNum) {
		RecommendNum = recommendNum;
	}


}
