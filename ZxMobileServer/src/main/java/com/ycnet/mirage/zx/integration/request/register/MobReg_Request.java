package com.ycnet.mirage.zx.integration.request.register;

import javax.xml.bind.annotation.XmlRootElement;

import com.ycnet.mirage.zx.detail.UserRegisterInputDetail;
import com.ycnet.mirage.zx.integration.request.BaseRequestCommon;

@XmlRootElement(name = "root")
public class MobReg_Request extends BaseRequestCommon{
	
	private MobRegRequestCd cd;
	
	public MobReg_Request() {
		// TODO Auto-generated constructor stub
	}
	
	public MobReg_Request(UserRegisterInputDetail detail)
	{
		MobRegRequestCd requestCd = new MobRegRequestCd(detail);
		
		requestCd.setMobileNo(detail.getMobileNo());
		requestCd.setPassword(detail.getPassword());
		requestCd.setPwdkey(detail.getPwdkey());
		requestCd.setvBasis(detail.getvBasis());
		requestCd.setvCode(detail.getvCode());
		requestCd.setRecommendNum(detail.getRecommendNum());
		
		setCd(requestCd);
	}

	public MobRegRequestCd getCd() {
		return cd;
	}

	public void setCd(MobRegRequestCd cd) {
		this.cd = cd;
	}
	
}
