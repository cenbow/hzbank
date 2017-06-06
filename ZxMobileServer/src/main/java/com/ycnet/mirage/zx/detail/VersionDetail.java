package com.ycnet.mirage.zx.detail;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ycnet.mirage.zx.domain.Version;
import com.ycnet.mirage.zx.integration.response.AdvertiseInfo;

@JsonIgnoreProperties(ignoreUnknown = true)
public class VersionDetail extends ClientInfoDetail{
	
	//平台类型 01 iphone; 02 ipad; 03 andriod
	private String platform;
	
	//客户端版本号
	private String appVersion;
	
	//是否记录版本信息标记 0 不记录 1记录
	private String logFlag;
	
	//更新地址
	private String applink;
	
	//更新备注
	private String remark;
	
	//更新类型 0 不更新 1强制更新 2  非强制更新
	private String updateStatus;
	
	//获取随机数时间间隔
	private String keyoutTime;
	
	//系统时间(毫秒)
	private Long sysDate;
	
	//版本打开记录主键
	private Long versionOpenId;
	
	//启动图片信息
	private List<AdvertiseInfo> advertiseInfos;
	
	private String LoadingFileMd5;
	
	//菜单信息
	private List<AppMenuDetail> menus;
	
	//静态版本结果列表
	private List<String> origStatics;
		
	//静态版本结果列表
	private List<StaticVersionDetail> staticVersions;
	
	//静态资源获取方式（0-本地，1-服务端）
	private String staticLoadType;
		
	public VersionDetail() {
		// TODO Auto-generated constructor stub
	}
	
	public VersionDetail(Version version)
	{
		setPlatform(version.getPlatform());
		setAppVersion(version.getAppVersion());
		setApplink(version.getApplink());
		setRemark(version.getRemark());
	}
	
	public void updateVersionDetail(Version version)
	{
		setPlatform(version.getPlatform());
		setAppVersion(version.getAppVersion());
		setApplink(version.getApplink());
		setRemark(version.getRemark());
	}
	
	public Long getVersionOpenId() {
		return versionOpenId;
	}

	public void setVersionOpenId(Long versionOpenId) {
		this.versionOpenId = versionOpenId;
	}

	public Long getSysDate() {
		return sysDate;
	}

	public void setSysDate(Long sysDate) {
		this.sysDate = sysDate;
	}

	public String getLogFlag() {
		return logFlag;
	}

	public void setLogFlag(String logFlag) {
		this.logFlag = logFlag;
	}

	public String getApplink() {
		return applink;
	}

	public void setApplink(String applink) {
		this.applink = applink;
	}

	public String getUpdateStatus() {
		return updateStatus;
	}

	public void setUpdateStatus(String updateStatus) {
		this.updateStatus = updateStatus;
	}

	public String getPlatform() {
		return platform;
	}

	public void setPlatform(String platform) {
		this.platform = platform;
	}

	public String getAppVersion() {
		return appVersion;
	}

	public void setAppVersion(String appVersion) {
		this.appVersion = appVersion;
	}
	
	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getKeyoutTime() {
		return keyoutTime;
	}

	public void setKeyoutTime(String keyoutTime) {
		this.keyoutTime = keyoutTime;
	}

	public String getLoadingFileMd5() {
		return LoadingFileMd5;
	}

	public void setLoadingFileMd5(String loadingFileMd5) {
		LoadingFileMd5 = loadingFileMd5;
	}

	public List<AppMenuDetail> getMenus() {
		return menus;
	}

	public void setMenus(List<AppMenuDetail> menus) {
		this.menus = menus;
	}

	public List<StaticVersionDetail> getStaticVersions() {
		return staticVersions;
	}

	public void setStaticVersions(List<StaticVersionDetail> staticVersions) {
		this.staticVersions = staticVersions;
	}

	public List<String> getOrigStatics() {
		return origStatics;
	}

	public void setOrigStatics(List<String> origStatics) {
		this.origStatics = origStatics;
	}

	public String getStaticLoadType() {
		return staticLoadType;
	}

	public void setStaticLoadType(String staticLoadType) {
		this.staticLoadType = staticLoadType;
	}

	/**
	 * @return the advertiseInfos
	 */
	public List<AdvertiseInfo> getAdvertiseInfos() {
		return advertiseInfos;
	}

	/**
	 * @param advertiseInfos the advertiseInfos to set
	 */
	public void setAdvertiseInfos(List<AdvertiseInfo> advertiseInfos) {
		this.advertiseInfos = advertiseInfos;
	}


}
