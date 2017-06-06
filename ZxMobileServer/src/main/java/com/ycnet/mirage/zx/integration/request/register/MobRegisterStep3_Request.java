package com.ycnet.mirage.zx.integration.request.register;

import javax.xml.bind.annotation.XmlRootElement;

import com.ycnet.mirage.zx.detail.UserRegisterDetail;
import com.ycnet.mirage.zx.detail.UserRegisterInputDetail;
import com.ycnet.mirage.zx.integration.request.BaseRequestCommon;

@XmlRootElement(name = "root")
public class MobRegisterStep3_Request extends BaseRequestCommon{
	
	private MobRegisterStep3RequestCd cd;
	
	public MobRegisterStep3_Request() {
		// TODO Auto-generated constructor stub
	}
	
	public MobRegisterStep3_Request(UserRegisterInputDetail detail)
	{
		MobRegisterStep3RequestCd cd = new MobRegisterStep3RequestCd(detail);
		
		cd.setCertNo(detail.getCertNo());
		cd.setUserName(detail.getUserName());
		cd.setPayPwd(detail.getPayPwd());
		cd.setPassword(detail.getPassword());
		cd.setMobileNo(detail.getMobileNo());
		cd.setCustomerAlias(detail.getCustomerAlias());
		cd.setPwdkey(detail.getPwdkey());
		cd.setGrayFlag(detail.getGrayFlag());
//		cd.setPwdLogin(detail.getPwdLogin());
//		cd.setCustomerEmail(detail.getCustomerEmail());
		cd.setRandom(detail.getRandom());
//		cd.setCardType(detail.getCardType());
		
		setCd(cd);
	}

	public MobRegisterStep3RequestCd getCd() {
		return cd;
	}

	public void setCd(MobRegisterStep3RequestCd cd) {
		this.cd = cd;
	}
	
}
