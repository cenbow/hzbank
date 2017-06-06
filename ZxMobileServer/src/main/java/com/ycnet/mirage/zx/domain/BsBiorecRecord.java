package com.ycnet.mirage.zx.domain;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;

import org.hibernate.validator.constraints.NotBlank;

import com.ycnet.mirage.domain.DomainImpl;

/**
 * 人脸认证改造的交易流水表
 */
@Entity
public class BsBiorecRecord extends DomainImpl{
	
	@NotBlank
	@Column(length = 18)
	private String idNo; // 身份证号
	
	@NotBlank
	@Column(length = 2)
	private String recType; // 识别方式
	
	private Long compTimes; // 最近识别次数	Long
	
	@Column(length = 10)
	private String transDate; // 最近识别日期 Varchar2(10)
	
	private BigDecimal transAmt; // 最近识别金额	Number(16,2)
	
	@Column(length = 2)
	private String curType; // 最近交易类型	Varchar2(2)
	
	@Column(length = 2)
	private String transType; // 最近交易类型	Varchar2(2)
	
	private Long randomNum; // 最近识别随机数	Long

	public String getIdNo() {
		return idNo;
	}

	public void setIdNo(String idNo) {
		this.idNo = idNo;
	}

	public String getRecType() {
		return recType;
	}

	public void setRecType(String recType) {
		this.recType = recType;
	}

	public Long getCompTimes() {
		return compTimes;
	}

	public void setCompTimes(Long compTimes) {
		this.compTimes = compTimes;
	}

	public String getTransDate() {
		return transDate;
	}

	public void setTransDate(String transDate) {
		this.transDate = transDate;
	}

	public BigDecimal getTransAmt() {
		return transAmt;
	}

	public void setTransAmt(BigDecimal transAmt) {
		this.transAmt = transAmt;
	}

	public String getCurType() {
		return curType;
	}

	public void setCurType(String curType) {
		this.curType = curType;
	}

	public String getTransType() {
		return transType;
	}

	public void setTransType(String transType) {
		this.transType = transType;
	}

	public Long getRandomNum() {
		return randomNum;
	}

	public void setRandomNum(Long randomNum) {
		this.randomNum = randomNum;
	}

}
