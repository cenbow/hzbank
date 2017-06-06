package com.ycnet.mirage.zx.integration.request;

/**
 * 公用报文头
 * @author lingal
 *
 */
public class PayBaseRequestCommon {
	
	private String formatType  = "XML";
	
	private String reqServiceId;
	
	private String reqChannelId = "01";
	
	private String reqDataView = "JSON";
	
	private String EMP_SID;
	
	private String isLogin = "NO";
	
	private String bankId = "080000";
	
	private String customerId;

	private String terminalChan = "02";
	
	private String userRemoteIP;
	
	public PayBaseRequestCommon() {
		// TODO Auto-generated constructor stub
	}
	
	public PayBaseRequestCommon(String reqServiceId, String reqChannelId, String reqDataView, String EMP_SID, String isLogin, String customerId)
	{
		this.reqServiceId = reqServiceId;
		this.reqChannelId = reqChannelId;
		this.reqDataView = reqDataView;
		this.EMP_SID = EMP_SID;
		this.isLogin = isLogin;
		this.customerId = customerId;
	}
	
	public PayBaseRequestCommon(String reqServiceId, String reqChannelId,
			String reqDataView, String EMP_SID) {
		
		this.reqServiceId = reqServiceId;
		this.reqChannelId = reqChannelId;
		this.reqDataView = reqDataView;
		this.EMP_SID = EMP_SID;
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
		this.EMP_SID = eMP_SID;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	/**
	 * @return the formatType
	 */
	public String getFormatType() {
		return formatType;
	}

	/**
	 * @param formatType the formatType to set
	 */
	public void setFormatType(String formatType) {
		this.formatType = formatType;
	}

	/**
	 * @return the bankId
	 */
	public String getBankId() {
		return bankId;
	}

	/**
	 * @param bankId the bankId to set
	 */
	public void setBankId(String bankId) {
		this.bankId = bankId;
	}

	/**
	 * @return the terminalChan
	 */
	public String getTerminalChan() {
		return terminalChan;
	}

	/**
	 * @param terminalChan the terminalChan to set
	 */
	public void setTerminalChan(String terminalChan) {
		this.terminalChan = terminalChan;
	}

	/**
	 * @return the userRemoteIP
	 */
	public String getUserRemoteIP() {
		return userRemoteIP;
	}

	/**
	 * @param userRemoteIP the userRemoteIP to set
	 */
	public void setUserRemoteIP(String userRemoteIP) {
		this.userRemoteIP = userRemoteIP;
	}	
	
}
