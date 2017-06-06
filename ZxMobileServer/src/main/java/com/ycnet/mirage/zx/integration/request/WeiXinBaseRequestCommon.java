package com.ycnet.mirage.zx.integration.request;

/**
 * 公用报文头
 * @author lingal
 *
 */
public class WeiXinBaseRequestCommon {
	
	private String reqServiceId;
	
	private String reqChannelId = "06";
	
	private String reqDataView = "JSON";
	
	private String EMP_SID;
	
	private String isLogin = "NO";
	
	private String appKey;
	
	private String customerId;
	
	public WeiXinBaseRequestCommon() {
		// TODO Auto-generated constructor stub
	}
	
	public WeiXinBaseRequestCommon(String reqServiceId, String reqChannelId, String reqDataView, String EMP_SID, String isLogin, String customerId)
	{
		this.reqServiceId = reqServiceId;
		this.reqChannelId = reqChannelId;
		this.reqDataView = reqDataView;
		this.EMP_SID = EMP_SID;
		this.isLogin = isLogin;
		this.customerId = customerId;
	}
	
	public WeiXinBaseRequestCommon(String reqServiceId, String reqChannelId,
			String reqDataView, String EMP_SID) {
		
		this.reqServiceId = reqServiceId;
		this.reqChannelId = reqChannelId;
		this.reqDataView = reqDataView;
		this.EMP_SID = EMP_SID;
	}

	public String getAppKey() {
		return appKey;
	}

	public void setAppKey(String appKey) {
		this.appKey = appKey;
		this.EMP_SID = this.appKey;
	}

	public String getIsLogin() {
		return isLogin;
	}

	public void setIsLogin(String isLogin) {
		this.isLogin = isLogin;
	}

	public String getReqServiceId() {
		return reqServiceId;
	}

	public void setReqServiceId(String reqServiceId) {
		this.reqServiceId = reqServiceId;
	}

	public String getReqChannelId() {
		return reqChannelId;
	}

	public void setReqChannelId(String reqChannelId) {
		this.reqChannelId = reqChannelId;
	}

	public String getReqDataView() {
		return reqDataView;
	}

	public void setReqDataView(String reqDataView) {
		this.reqDataView = reqDataView;
	}

	public String getEMP_SID() {
		return EMP_SID;
	}

	public void setEMP_SID(String eMP_SID) {
		EMP_SID = eMP_SID;
		this.appKey = this.EMP_SID;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}	
	
}
