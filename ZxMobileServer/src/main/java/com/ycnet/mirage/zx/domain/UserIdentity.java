package com.ycnet.mirage.zx.domain;

import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.validation.constraints.NotNull;

import com.ycnet.mirage.domain.DomainImpl;

/**
 * 用户身份证照信息表
 * @author lingal
 */
@Entity
public class UserIdentity extends DomainImpl{
	
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
	 * 影像服务器文件批次号
	 */
	private String batchNo;
	
	
	public String getMobileNo() {
		return mobileNo;
	}

	public void setMobileNo(String mobileNo) {
		this.mobileNo = mobileNo;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	/**
	 * @return the batchNo
	 */
	public String getBatchNo() {
		return batchNo;
	}

	/**
	 * @param batchNo the batchNo to set
	 */
	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
	}

}
