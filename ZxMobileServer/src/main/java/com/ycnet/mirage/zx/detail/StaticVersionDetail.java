package com.ycnet.mirage.zx.detail;

import com.ycnet.mirage.zx.domain.StaticVersion;

/**
 * 静态资源版本
 * @author xfc
 *
 */
public class StaticVersionDetail{
	
	
	public StaticVersionDetail(){
		
	}
	
	public StaticVersionDetail(StaticVersion version)
	{
		setStaticZipFile(version.getStaticZipFile());
		setStaticZipFileMd(version.getStaticZipFileMd());
		setStaticUpdateContent(version.getStaticUpdateContent().replaceAll("\\\\n", "\n"));
		setStaticVersion(version.getStaticVersion());
		setStaticUpdateType(version.getStaticUpdateType());
		setStaticZipSize(version.getStaticZipSize());
		if(Float.parseFloat(version.getStaticZipSize()) > 1048576){
			setAttentionType("1");
		}
	}
	
	//静态资源包下载地址
	private String staticZipFile;
	
	//静态资源包MD5
	private String staticZipFileMd;
	
	//资源包大小
	private String staticZipSize;
	
	//静态资源更新提醒
	private String staticUpdateContent;
	
	//静态资源版本
	private String staticVersion;
	
	//静态资源版本类型（0-增量更新，1-全量更新）
	private String staticUpdateType;
	
	//版本更新策略（0-不更新，1-更新）
	private String staticUpdateStatus = "0";
	
	//版本更新是否提示(0-不提示，1-提示)
	private String attentionType = "0";
	
	
	public String getStaticZipFile() {
		return staticZipFile;
	}

	public void setStaticZipFile(String staticZipFile) {
		this.staticZipFile = staticZipFile;
	}

	public String getStaticZipFileMd() {
		return staticZipFileMd;
	}

	public void setStaticZipFileMd(String staticZipFileMd) {
		this.staticZipFileMd = staticZipFileMd;
	}

	public String getStaticUpdateContent() {
		return staticUpdateContent;
	}

	public void setStaticUpdateContent(String staticUpdateContent) {
		this.staticUpdateContent = staticUpdateContent;
	}

	public String getStaticVersion() {
		return staticVersion;
	}

	public void setStaticVersion(String staticVersion) {
		this.staticVersion = staticVersion;
	}

	public String getStaticUpdateType() {
		return staticUpdateType;
	}

	public void setStaticUpdateType(String staticUpdateType) {
		this.staticUpdateType = staticUpdateType;
	}

	public String getStaticUpdateStatus() {
		return staticUpdateStatus;
	}

	public void setStaticUpdateStatus(String staticUpdateStatus) {
		this.staticUpdateStatus = staticUpdateStatus;
	}

	public String getStaticZipSize() {
		return staticZipSize;
	}

	public void setStaticZipSize(String staticZipSize) {
		this.staticZipSize = staticZipSize;
	}

	public String getAttentionType() {
		return attentionType;
	}

	public void setAttentionType(String attentionType) {
		this.attentionType = attentionType;
	}
	
	
}
