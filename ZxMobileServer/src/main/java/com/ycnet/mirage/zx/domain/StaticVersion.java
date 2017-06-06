package com.ycnet.mirage.zx.domain;

import javax.persistence.Entity;

import org.hibernate.validator.constraints.NotBlank;

import com.ycnet.mirage.domain.DomainImpl;
import com.ycnet.mirage.domain.annotation.UniqueConstrain;
import com.ycnet.mirage.domain.annotation.UniqueConstrains;

/**
 * 静态资源版本表
 * @author xfc
 *
 */
@UniqueConstrains(constrains = @UniqueConstrain(fields = "staticVersion", alias = "静态版本号"))
@Entity
public class StaticVersion extends DomainImpl{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	

	//静态资源包下载地址
	@NotBlank
	private String staticZipFile;
	
	//静态资源包MD5
	@NotBlank
	private String staticZipFileMd;
	
	//资源包大小
	private String staticZipSize;
	
	//静态资源更新提醒
	private String staticUpdateContent;
	
	//静态资源版本
	@NotBlank
	private String staticVersion;
	
	//全量版本号
	@NotBlank
	private String generalVersion;
		
	//静态资源版本类型（0-增量更新，1-全量更新）
	@NotBlank
	private String staticUpdateType;
	
	//静态资源获取方式（0-本地，1-服务端）
	private String staticLoadType;
	
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

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public String getGeneralVersion() {
		return generalVersion;
	}

	public void setGeneralVersion(String generalVersion) {
		this.generalVersion = generalVersion;
	}

	/**
	 * @return the staticZipSize
	 */
	public String getStaticZipSize() {
		return staticZipSize;
	}

	/**
	 * @param staticZipSize the staticZipSize to set
	 */
	public void setStaticZipSize(String staticZipSize) {
		this.staticZipSize = staticZipSize;
	}

	/**
	 * @return the staticLoadType
	 */
	public String getStaticLoadType() {
		return staticLoadType;
	}

	/**
	 * @param staticLoadType the staticLoadType to set
	 */
	public void setStaticLoadType(String staticLoadType) {
		this.staticLoadType = staticLoadType;
	}

	
}
