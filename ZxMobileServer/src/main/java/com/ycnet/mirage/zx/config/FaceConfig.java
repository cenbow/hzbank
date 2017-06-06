package com.ycnet.mirage.zx.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;



/**
 * Face++人脸识别配置
 */
@Component
@ConfigurationProperties("face.config")
public class FaceConfig {
	
	/**
	 * 核心返回的人行照保存地址
	 */
	private String tmpPhotoPath;
	
	private String tempData;
	
	private String tempDataPath;
	
	private String tempIdPath;
	
	/**
	 * face++服务地址
	 */
	private String faceWebRoot;
	
	/**
	 * 账户名称
	 */
	private String account;
	
	/**
	 * 账户密码
	 */
	private String password;
	
	/**
	 * 对比相似度
	 */
	private double  thresHold;

	private String mainKey;
	
	private String keyiv;
	
	public String getTmpPhotoPath() {
		return tmpPhotoPath;
	}

	public void setTmpPhotoPath(String tmpPhotoPath) {
		this.tmpPhotoPath = tmpPhotoPath;
	}

	public String getTempData() {
		return tempData;
	}

	public void setTempData(String tempData) {
		this.tempData = tempData;
	}

	public String getTempDataPath() {
		return tempDataPath;
	}

	public void setTempDataPath(String tempDataPath) {
		this.tempDataPath = tempDataPath;
	}

	public String getTempIdPath() {
		return tempIdPath;
	}

	public void setTempIdPath(String tempIdPath) {
		this.tempIdPath = tempIdPath;
	}

	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public double getThresHold() {
		return thresHold;
	}

	public void setThresHold(double thresHold) {
		this.thresHold = thresHold;
	}

	/**
	 * @return the faceWebRoot
	 */
	public String getFaceWebRoot() {
		return faceWebRoot;
	}

	/**
	 * @param faceWebRoot the faceWebRoot to set
	 */
	public void setFaceWebRoot(String faceWebRoot) {
		this.faceWebRoot = faceWebRoot;
	}

	public String getKeyiv() {
		return keyiv;
	}

	public void setKeyiv(String keyiv) {
		this.keyiv = keyiv;
	}

	public String getMainKey() {
		return mainKey;
	}

	public void setMainKey(String mainKey) {
		this.mainKey = mainKey;
	}

}
