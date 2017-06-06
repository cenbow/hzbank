package com.ycnet.mirage.zx.integration.request.register;

import javax.xml.bind.annotation.XmlRootElement;

import com.ycnet.mirage.zx.detail.ClientInfoDetail;
import com.ycnet.mirage.zx.detail.UserRegisterInputDetail;
import com.ycnet.mirage.zx.integration.request.BaseRequestCommon;
import com.ycnet.mirage.zx.integration.request.ClientInfoRequestCommon;

@XmlRootElement(name = "root")
public class MobRegisterStep1_Request extends BaseRequestCommon{
	
	private MobRegisterStep1RequestCd cd;
	
	public MobRegisterStep1_Request() {
		// TODO Auto-generated constructor stub
	}
	
	public MobRegisterStep1_Request(UserRegisterInputDetail detail)
	{
		MobRegisterStep1RequestCd requestCd = new MobRegisterStep1RequestCd(detail);
		
		requestCd.setMobileNo(detail.getMobileNo());
		requestCd.setvBasis(detail.getvBasis());
		requestCd.setvCode(detail.getvCode());
		requestCd.setRecommendNum(detail.getRecommendNum());
		
		setCd(requestCd);
	}

	public MobRegisterStep1RequestCd getCd() {
		return cd;
	}

	public void setCd(MobRegisterStep1RequestCd cd) {
		this.cd = cd;
	}
	
}
