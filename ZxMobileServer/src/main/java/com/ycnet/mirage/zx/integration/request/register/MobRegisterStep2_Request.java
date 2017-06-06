package com.ycnet.mirage.zx.integration.request.register;

import javax.xml.bind.annotation.XmlRootElement;

import com.ycnet.mirage.zx.detail.UserRegisterInputDetail;
import com.ycnet.mirage.zx.integration.request.BaseRequestCommon;

@XmlRootElement(name = "root")
public class MobRegisterStep2_Request extends BaseRequestCommon{
	
	private MobRegisterStep2RequestCd cd;
	
	public MobRegisterStep2_Request() {

	}
	
	public MobRegisterStep2_Request(UserRegisterInputDetail detail)
	{
		MobRegisterStep2RequestCd cd = new MobRegisterStep2RequestCd(detail);
		
		cd.setUserName(detail.getUserName());
		cd.setCardType(detail.getCardType());
		cd.setMobileNo(detail.getMobileNo());
		cd.setCertNo(detail.getCertNo());
		cd.setBindCardNo(detail.getBindCardNo());
		cd.setBankName(detail.getBankName());
		cd.setBankType(detail.getBankType());
		cd.setPayPwd(detail.getPayPwd());
		cd.setPwdkey(detail.getPwdkey());
		cd.setCustomerAddress(detail.getCustomerAddress());
		cd.setCustomerBirthday(detail.getCustomerBirthday());
		cd.setCustomerRace(detail.getCustomerRace());
		cd.setCustomerSex(detail.getCustomerSex());
		cd.setBatchNo(detail.getBatchNo());
		cd.setCardNo(detail.getCardNo());
		cd.setRandom(detail.getRandom());
		cd.setOrgan(detail.getOrgan());
		cd.setValidity(detail.getValidity());
		cd.setProfession(detail.getProfession());
		
		setCd(cd);
	}

	public MobRegisterStep2RequestCd getCd() {
		return cd;
	}

	public void setCd(MobRegisterStep2RequestCd cd) {
		this.cd = cd;
	}
	
}
