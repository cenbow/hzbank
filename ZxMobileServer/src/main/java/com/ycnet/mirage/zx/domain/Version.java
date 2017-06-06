package com.ycnet.mirage.zx.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

import org.hibernate.validator.constraints.NotBlank;

import com.ycnet.mirage.domain.DomainImpl;
import com.ycnet.mirage.domain.annotation.UniqueConstrain;
import com.ycnet.mirage.domain.annotation.UniqueConstrains;

/**
 * 版本控制表
 * @author lingal
 *
 */
@UniqueConstrains(constrains = @UniqueConstrain(fields = "platform", alias = "平台类型"))
@Entity
public class Version extends DomainImpl{
	
	//平台类型 01 iphone; 02 ipad; 03 andriod
	@NotBlank
	private String platform;
	
	//客户端版本号
	@NotBlank
	private String appVersion;
	
	//发布日期
	private String date;
	
	//更新地址
	@NotBlank
	private String applink;
	
	//更新备注
	@Column(length = 600)
	private String remark;
	
	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getApplink() {
		return applink;
	}

	public void setApplink(String applink) {
		this.applink = applink;
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
	
}
