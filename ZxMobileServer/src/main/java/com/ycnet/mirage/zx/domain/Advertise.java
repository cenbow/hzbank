package com.ycnet.mirage.zx.domain;

import javax.persistence.Entity;

import com.ycnet.mirage.domain.DomainImpl;

/**
 *手机端广告图
 */
@Entity
public class Advertise extends DomainImpl{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	//广告编号
	private String adCode;
	
	//广告顺序
	private String adOrder;
	
	//名称
	private String adName;
	
	//图片大小（960*383,750*277,640*280）
	private String adSize;
	
	//图片url
	private String adUrl;
	
	//广告是否跳转（0 否，1 是）
	private String adIsPointTo;
	
	//跳转链接
	private String adPointTo;
	
	//广告位置类别(M001 首页，M002 投资页)
	private String type;
	
	//广告是否登陆（0 否，1是）
	private String isLogin;
	
	//广告状态 （0 否，1是）
	private String status;
		
	//灰度标记（0 非灰度，1灰度）
	private String inTest;
	
	public String getAdCode() {
		return adCode;
	}

	public void setAdCode(String adCode) {
		this.adCode = adCode;
	}

	public String getAdOrder() {
		return adOrder;
	}

	public void setAdOrder(String adOrder) {
		this.adOrder = adOrder;
	}

	public String getAdName() {
		return adName;
	}

	public void setAdName(String adName) {
		this.adName = adName;
	}

	public String getAdSize() {
		return adSize;
	}

	public void setAdSize(String adSize) {
		this.adSize = adSize;
	}

	public String getAdUrl() {
		return adUrl;
	}

	public void setAdUrl(String adUrl) {
		this.adUrl = adUrl;
	}

	public String getAdIsPointTo() {
		return adIsPointTo;
	}

	public void setAdIsPointTo(String adIsPointTo) {
		this.adIsPointTo = adIsPointTo;
	}

	public String getAdPointTo() {
		return adPointTo;
	}

	public void setAdPointTo(String adPointTo) {
		this.adPointTo = adPointTo;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getIsLogin() {
		return isLogin;
	}

	public void setIsLogin(String isLogin) {
		this.isLogin = isLogin;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getInTest() {
		return inTest;
	}

	public void setInTest(String inTest) {
		this.inTest = inTest;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	

}
