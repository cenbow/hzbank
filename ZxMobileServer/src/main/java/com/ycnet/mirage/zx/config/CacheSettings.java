package com.ycnet.mirage.zx.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 缓存配置信息
 * @author lingal
 *
 */
@Component
@ConfigurationProperties("cache")
public class CacheSettings {
	
	private String cacheName;
	
	private String imgCodeCacheName;
	
	public String getImgCodeCacheName() {
		return imgCodeCacheName;
	}

	public void setImgCodeCacheName(String imgCodeCacheName) {
		this.imgCodeCacheName = imgCodeCacheName;
	}
	
	public String getCacheName() {
		return cacheName;
	}

	public void setCacheName(String cacheName) {
		this.cacheName = cacheName;
	}
}
