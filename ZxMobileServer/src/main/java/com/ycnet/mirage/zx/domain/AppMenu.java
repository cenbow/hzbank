package com.ycnet.mirage.zx.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

import org.hibernate.validator.constraints.NotBlank;

import com.ycnet.mirage.domain.DomainImpl;
import com.ycnet.mirage.domain.annotation.UniqueConstrain;
import com.ycnet.mirage.domain.annotation.UniqueConstrains;

/**
 * 客户端菜单配置表
 * @author xfc
 *
 */
@Entity
public class AppMenu extends DomainImpl{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	

	//菜单编号（Mxxx）
	private String No;
	
	//菜单名称
	private String MenuName;
	
	//菜单地址
	private String Url;
	
	//菜单图标链接
	private String icon;
	
	//菜单类型(菜单位置)
	private String type;
	
	//是否需要登陆(0不登陆，1登陆)
	private String isLogin = "0";
	
	//菜单顺序
	private String index;
		
	//菜单状态（0-失效，1-生效）
	private String status;

	//生效时间
	private String startDate;
		
	//失效时间
	private String endDate;
		
	public String getIndex() {
		return index;
	}

	public void setIndex(String index) {
		this.index = index;
	}

	/**
	 * @return the no
	 */
	public String getNo() {
		return No;
	}

	/**
	 * @param no the no to set
	 */
	public void setNo(String no) {
		No = no;
	}

	/**
	 * @return the menuName
	 */
	public String getMenuName() {
		return MenuName;
	}

	/**
	 * @param menuName the menuName to set
	 */
	public void setMenuName(String menuName) {
		MenuName = menuName;
	}

	/**
	 * @return the url
	 */
	public String getUrl() {
		return Url;
	}

	/**
	 * @param url the url to set
	 */
	public void setUrl(String url) {
		Url = url;
	}

	/**
	 * @return the status
	 */
	public String getStatus() {
		return status;
	}

	/**
	 * @param status the status to set
	 */
	public void setStatus(String status) {
		this.status = status;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getIsLogin() {
		return isLogin;
	}

	public void setIsLogin(String isLogin) {
		this.isLogin = isLogin;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	
}
