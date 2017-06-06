package com.ycnet.mirage.zx.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;



/**
 * 抵易贷影像上传配置
 */
@Component
@ConfigurationProperties("mortgage.file.server")
public class MortgageConfig {
	
	private String ip;
	
	private String port;
	
	private String username;
	
	private String password;
	
	private String basedirUrl;
	
	private String objName1;
	
	private String objName2;
	
	private String tempPhotosPath;
	
	private int timeout;
	
	
	public int getTimeout() {
		return timeout;
	}

	public void setTimeout(int timeout) {
		this.timeout = timeout;
	}

	public String getTempPhotosPath() {
		return tempPhotosPath;
	}

	public void setTempPhotosPath(String tempPhotosPath) {
		this.tempPhotosPath = tempPhotosPath;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getPort() {
		return port;
	}

	public void setPort(String port) {
		this.port = port;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getBasedirUrl() {
		return basedirUrl;
	}

	public void setBasedirUrl(String basedirUrl) {
		this.basedirUrl = basedirUrl;
	}

	public String getObjName1() {
		return objName1;
	}

	public void setObjName1(String objName1) {
		this.objName1 = objName1;
	}

	public String getObjName2() {
		return objName2;
	}

	public void setObjName2(String objName2) {
		this.objName2 = objName2;
	}

	
	

}
