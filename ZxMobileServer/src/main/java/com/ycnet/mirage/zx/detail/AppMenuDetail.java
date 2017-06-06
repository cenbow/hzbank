package com.ycnet.mirage.zx.detail;

import com.ycnet.mirage.zx.domain.AppMenu;

/**
 * 菜单信息
 * @author xfc
 *
 */
public class AppMenuDetail{
	
	
	public AppMenuDetail(){
		
	}
	
	public AppMenuDetail(AppMenu menu)
	{
		setNo(menu.getNo());
		setMenuName(menu.getMenuName());
		setUrl(menu.getUrl());
	}
	
	//菜单编号（Mxxx）
	private String No;
	
	//菜单名称
	private String MenuName;
	
	//菜单地址
	private String Url;

	public String getNo() {
		return No;
	}

	public void setNo(String no) {
		No = no;
	}

	public String getMenuName() {
		return MenuName;
	}

	public void setMenuName(String menuName) {
		MenuName = menuName;
	}

	public String getUrl() {
		return Url;
	}

	public void setUrl(String url) {
		Url = url;
	}	
	
	
}
