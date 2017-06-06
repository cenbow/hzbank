package com.ycnet.mirage.zx.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 代理配置类
 * @author lingal
 *
 */
@Component
@ConfigurationProperties("proxy")
public class ProxySettings {
	
	private Boolean isProxy;
	
	private String host;
	
	private int port;
	
	public Boolean getIsProxy() {
		return isProxy;
	}

	public void setIsProxy(Boolean isProxy) {
		this.isProxy = isProxy;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}
	
}
