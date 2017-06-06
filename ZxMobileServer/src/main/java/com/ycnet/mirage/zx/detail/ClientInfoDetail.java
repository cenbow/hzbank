package com.ycnet.mirage.zx.detail;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ClientInfoDetail {
	
	//ip地址
	private String ipAddress;
	
	//ip地址
	private String ipAdress;
		
	//经纬度
	private String location;
	
	//设备编号
	private String macAddress;
	
	//平台类型  01,iphone;02 ipad;03 android
	private String platform;
	
	//操作系统版本
	private String sysVersion;
	
	//网络类型
	private String networkType;
	
	//运营商类型
	private String merType;
	
	//app版本号
	private String appVersion;
	
	//用户登录缓存编号
	private String userSessionToken;
	
	//手机型号
	private String mobileType;
	
	//分辨率
	private String resolution;
	
	//浏览器版本
	private String browserVersion;
	
	//客户IP
	private String clientIp;
	
	//灰度标记
	private String grayFlag;
	
	private String boxId;
	
	public String getIpAdress() {
		return ipAdress;
	}

	public void setIpAdress(String ipAdress) {
		this.ipAdress = ipAdress;
	}

	public String getBoxId() {
		return boxId;
	}

	public void setBoxId(String boxId) {
		this.boxId = boxId;
	}

	public String getClientIp() {
		return clientIp;
	}

	public void setClientIp(String clientIp) {
		this.clientIp = clientIp;
	}

	public String getResolution() {
		return resolution;
	}

	public void setResolution(String resolution) {
		this.resolution = resolution;
	}

	public String getBrowserVersion() {
		return browserVersion;
	}

	public void setBrowserVersion(String browserVersion) {
		this.browserVersion = browserVersion;
	}

	public String getMobileType() {
		return mobileType;
	}

	public void setMobileType(String mobileType) {
		this.mobileType = mobileType;
	}

	public String getUserSessionToken() {
		return userSessionToken;
	}

	public void setUserSessionToken(String userSessionToken) {
		this.userSessionToken = userSessionToken;
	}

	public String getIpAddress() {
		return ipAddress;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getMacAddress() {
		return macAddress;
	}

	public void setMacAddress(String macAddress) {
		this.macAddress = macAddress;
	}

	public String getPlatform() {
		return platform;
	}

	public void setPlatform(String platform) {
		this.platform = platform;
	}

	public String getSysVersion() {
		return sysVersion;
	}

	public void setSysVersion(String sysVersion) {
		this.sysVersion = sysVersion;
	}
	
	public String getNetworkType() {
		return networkType;
	}

	public void setNetworkType(String networkType) {
		this.networkType = networkType;
	}

	public String getMerType() {
		return merType;
	}

	public void setMerType(String merType) {
		this.merType = merType;
	}

	public String getAppVersion() {
		return appVersion;
	}

	public void setAppVersion(String appVersion) {
		this.appVersion = appVersion;
	}

	public String getGrayFlag() {
		return grayFlag;
	}

	public void setGrayFlag(String grayFlag) {
		this.grayFlag = grayFlag;
	}
	
}
