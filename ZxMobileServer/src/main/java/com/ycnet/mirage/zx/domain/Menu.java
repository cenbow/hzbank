package com.ycnet.mirage.zx.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

import org.hibernate.validator.constraints.NotBlank;

import com.ycnet.mirage.domain.DomainImpl;
import com.ycnet.mirage.domain.annotation.UniqueConstrain;
import com.ycnet.mirage.domain.annotation.UniqueConstrains;

/**
 * 菜单配置表
 * @author xfc
 *
 */
@Entity
public class Menu extends DomainImpl{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	//菜单编号
	private String menuNo;
	
	//菜单名称
	private String menuName;
	
	//菜单地址
	private String Url;
	
	//菜单图标地址
	private String icon;
	
	//菜单位置顺序
	private String position;
	
	//菜单类型（首页菜单，客户端菜单...）
	private String type;
	
	//支持的平台类型
	private String platformType;
	
	//菜单状态（0-失效，1-生效）
	private String isLogin;
		
	//菜单状态（0-失效，1-生效）
	private String status;

	public String getMenuNo() {
		return menuNo;
	}

	public void setMenuNo(String menuNo) {
		this.menuNo = menuNo;
	}

	public String getMenuName() {
		return menuName;
	}

	public void setMenuName(String menuName) {
		this.menuName = menuName;
	}

	public String getUrl() {
		return Url;
	}

	public void setUrl(String url) {
		Url = url;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getPlatformType() {
		return platformType;
	}

	public void setPlatformType(String platformType) {
		this.platformType = platformType;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	/**
	 * @return the isLogin
	 */
	public String getIsLogin() {
		return isLogin;
	}

	/**
	 * @param isLogin the isLogin to set
	 */
	public void setIsLogin(String isLogin) {
		this.isLogin = isLogin;
	}


	
}
