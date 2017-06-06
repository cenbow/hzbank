package com.ycnet.mirage.zx.domain;

import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.validation.constraints.NotNull;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ycnet.mirage.domain.DomainImpl;

/**
 * 用户头像信息表
 * @author lingal
 */
@Entity
public class UserLogo extends DomainImpl{
	
	private static Logger logger = LoggerFactory.getLogger(UserLogo.class);
	
	/**
	 * 客户号
	 */
	@NotNull
	private String customerId;
	
	/**
	 * 手机号
	 */
	@NotNull
	private String mobileNo;
	
	/**
	 * 版本号
	 */
	@NotNull
	private Long version = 1L;
	
	/**
	 * 图片格式
	 */
	private String type;
	
	/**
	 * 图片BASE64编码字符串
	 */
	@Lob
	private byte[] image;
	
	public String getMobileNo() {
		return mobileNo;
	}

	public void setMobileNo(String mobileNo) {
		this.mobileNo = mobileNo;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	public String getImage() {
		if(image == null || image.length == 0)
		{
			return null;
		}
		
		try
		{
			return new String(image,"UTF-8");
		}
		catch(Exception e)
		{
			logger.error(e.getMessage(), e);
			return null;
		}
	}

	public void setImage(byte[] image) {
		this.image = image;
	}
	
}
