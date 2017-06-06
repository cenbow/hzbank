package com.ycnet.mirage.zx.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import org.hibernate.validator.constraints.NotBlank;

import com.ycnet.mirage.domain.DomainImpl;

/**
 * 卡号白名单
 * @author syh
 *
 */
@Entity
public class Cardwhitelist extends DomainImpl{
	
	@NotBlank
	@Column(length = 200)
	private String cardno;

	public String getCardno() {
		return cardno;
	}

	public void setCardno(String cardno) {
		this.cardno = cardno;
	} 



}
