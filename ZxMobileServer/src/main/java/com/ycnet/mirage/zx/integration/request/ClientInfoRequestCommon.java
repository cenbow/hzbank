package com.ycnet.mirage.zx.integration.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.detail.ClientInfoDetail;
import com.ycnet.mirage.zx.detail.SessionTokenDetail;

/**
 * 客户端信息公用报文
 */
public class ClientInfoRequestCommon {
	
	//ip地址
	private String IPAddress;
	
	//经纬度
	private String location;
	
	//设备编号
	private String MACAddress;
	
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
	
	//手机型号
	private String mobileType;
	
	//分辨率
	private String resolution;
	
	//浏览器版本
	private String browserVersion;
	
	//灰度标记
	private String grayFlag;
	
	private String boxId;
	
	
	public String getBoxId() {
		return boxId;
	}

	public void setBoxId(String boxId) {
		this.boxId = boxId;
	}

	public ClientInfoRequestCommon(){
		
	}
	
	public ClientInfoRequestCommon(ClientInfoDetail detail){
		setAppVersion(detail.getAppVersion());
		setBrowserVersion(detail.getBrowserVersion());
		setGrayFlag(detail.getGrayFlag());
		setLocation(detail.getLocation());
		setMACAddress(detail.getMacAddress());
		setMerType(detail.getMerType());
		setMobileType(detail.getMobileType());
		setNetworkType(detail.getNetworkType());
		setPlatform(detail.getPlatform());
		setResolution(detail.getResolution());
		setSysVersion(detail.getSysVersion());
		setBoxId(detail.getBoxId());
		
		if(detail.getIpAddress() == null || detail.getIpAddress().equals("")){
			setIPAddress(detail.getIpAdress());
		}else{
			setIPAddress(detail.getIpAddress());
		}
	}
	
	public ClientInfoRequestCommon(SessionTokenDetail detail){
		setAppVersion(detail.getAppVersion());
		setBrowserVersion(detail.getBrowserVersion());
		setGrayFlag(detail.getGrayFlag());
		setLocation(detail.getLocation());
		setMACAddress(detail.getMacAddress());
		setMerType(detail.getMerType());
		setMobileType(detail.getMobileType());
		setNetworkType(detail.getNetworkType());
		setPlatform(detail.getPlatform());
		setResolution(detail.getResolution());
		setSysVersion(detail.getSysVersion());
		setBoxId(detail.getBoxId());
		
		if(detail.getIpAddress() == null || detail.getIpAddress().equals("")){
			setIPAddress(detail.getIpAdress());
		}else{
			setIPAddress(detail.getIpAddress());
		}
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

	public String getIPAddress() {
		return IPAddress;
	}

	public void setIPAddress(String iPAddress) {
		IPAddress = iPAddress;
	}

	public String getMACAddress() {
		return MACAddress;
	}

	public void setMACAddress(String mACAddress) {
		MACAddress = mACAddress;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
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
