package com.ycnet.mirage.zx.utils;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.Cache.ValueWrapper;
import org.springframework.cache.CacheManager;

import com.ycnet.mirage.context.MirageException;
import com.ycnet.mirage.zx.config.MobileApplicationErrorCode;

/**
 * 缓存服务器数据保存类
 * @author lingal
 *
 */
public class MobileCacheUtils {
	
	private static CacheManager cacheManager;
	
	private static String cacheName;
	
	private static String imgCodeCacheName;
	
	private static Logger logger = LoggerFactory.getLogger(MobileCacheUtils.class);
	
	/**
	 * 验证用户session
	 * @param SessionToken
	 * @throws Exception
	 */
	public static Map<String, Object> checkSession(String SessionToken) throws Exception
	{
		logger.info("MobileCacheUtils.checkSession-----" + "缓存编号：" + SessionToken);
		
		if(SessionToken == null || "".equals(SessionToken))
		{
			logger.error("MobileCacheUtils.checkSession-----" + "请求缓存编号为空，session验证失败");
			throw new MirageException(MobileApplicationErrorCode.TRAN_DATA_ERROR);
		}
		
		//获取缓存
		Cache cache = getCache();
		
		ValueWrapper valueWrapper = null;
		
		//验证以SessionToken为key下的登录数据存不存在
		try
		{
			valueWrapper = cache.get(SessionToken.getBytes("UTF-8"));
		}
		catch(Exception e)
		{
			logger.info("缓存服务器异常");
			logger.error(e.getMessage(), e);
			throw new MirageException(MobileApplicationErrorCode.CONNECT_SERVER_ERROR);
		}
		
		if(valueWrapper == null)
		{
			logger.error("MobileCacheUtils.checkSession()-----" + "交易失败，用户session超时");
			throw new MirageException(MobileApplicationErrorCode.SESSION_TIME_OUT);
		}
		
		//验证以sessionCheckKey为key下的数据与传入的SessionToken是否一致
		
		Map<String, Object> sessionMap = new HashMap<String, Object>();
		
		try
		{
			sessionMap = (Map<String, Object>) valueWrapper.get();
		}
		catch(Exception e)
		{
			logger.info("缓存服务器异常");
			logger.error(e.getMessage(), e);
			throw new MirageException(MobileApplicationErrorCode.CONNECT_SERVER_ERROR);
		}
		
		String sessionCheckKey = (String) sessionMap.get("sessionCheckKey");
		
		valueWrapper = null;
		
		try
		{
			valueWrapper = cache.get(sessionCheckKey.getBytes("UTF-8"));
		}
		catch(Exception e)
		{
			logger.info("缓存服务器异常");
			logger.error(e.getMessage(), e);
			throw new MirageException(MobileApplicationErrorCode.CONNECT_SERVER_ERROR);
		}
		
		if(valueWrapper == null)
		{
			logger.error("MobileCacheUtils.checkSession()-----" + "交易失败，用户session超时");
			throw new MirageException(MobileApplicationErrorCode.SESSION_TIME_OUT);
		}
		
		String sessionCheckToken = null;
		
		try
		{
			sessionCheckToken = (String) valueWrapper.get();
		}
		catch(Exception e)
		{
			logger.info("缓存服务器异常");
			logger.error(e.getMessage(), e);
			throw new MirageException(MobileApplicationErrorCode.CONNECT_SERVER_ERROR);
		}
		
		//如果sessionCheckToken与sessionToken不一致，表明此数据被覆盖过(即又做过第二次登录)
		if(!SessionToken.equals(sessionCheckToken))
		{
			//移除已失效的登录缓存数据
			try
			{
				cache.evict(SessionToken.getBytes("UTF-8"));
			}
			catch(Exception e)
			{
				logger.info("缓存服务器异常");
				logger.error(e.getMessage(), e);
				throw new MirageException(MobileApplicationErrorCode.CONNECT_SERVER_ERROR);
			}
			
			throw new MirageException(MobileApplicationErrorCode.USER_OTHER_LOGIN);
		}
		else
		{
			//重置用户session超时时间
			try
			{
				cache.put(sessionCheckKey.getBytes("UTF-8"), SessionToken);
				cache.put(SessionToken.getBytes("UTF-8"), sessionMap);
			}
			catch(Exception e)
			{
				logger.error(e.getMessage(), e);
				throw new MirageException(MobileApplicationErrorCode.CONNECT_SERVER_ERROR);
			}
		}
		
		return sessionMap;
	}
	
	/**
	 * 获取用户客户号
	 * @param SessionToken
	 * @return
	 * @throws Exception
	 */
	public static String getCustomerId(String SessionToken) throws Exception
	{
		Map<String, Object> sessionMap = getSessionMap(SessionToken);
		
		String sessionId = (String) sessionMap.get("customerId");
		
		return sessionId;
	}
	
	/**
	 * 获取用户缓存数据Map
	 * @param SessionToken
	 * @return
	 * @throws Exception
	 */
	public static Map<String, Object> getSessionMap(String SessionToken) throws Exception
	{
		if(SessionToken == null || "".equals(SessionToken))
		{
			logger.info("用户缓存编号为空，伪造交易数据");
			
			throw new MirageException(MobileApplicationErrorCode.TRAN_DATA_ERROR);
		}
		
		ValueWrapper wrapper = MobileCacheUtils.getCacheValueWrapper(SessionToken);
		
		if(wrapper == null)
		{
			logger.info("用户登录信息超时");
			
			throw new MirageException(MobileApplicationErrorCode.SESSION_TIME_OUT);
		}
		
		Map<String, Object> sessionMap = new HashMap<String, Object>();
		
		try
		{
			sessionMap = (Map<String, Object>) wrapper.get();
		}
		catch(Exception e)
		{
			logger.info("缓存服务器异常");
			logger.error(e.getMessage(), e);
			throw new MirageException(MobileApplicationErrorCode.CONNECT_SERVER_ERROR);
		}
		
		return sessionMap;
	}
	
	public static void checkImageCode(String imageCheckCode, String imageCode) throws Exception
	{
		logger.info("MobileCacheUtils.checkImageCode-----" + "上送验证码key：" + imageCheckCode);
		logger.info("MobileCacheUtils.checkImageCode-----" + "上送验证码：" + imageCode);
		
		//imageCheckCode为UNCKECK不验证验证码
		if("UNCHECK".equals(imageCheckCode))
		{
			return;
		}
		
		if(imageCheckCode == null || "".equals(imageCheckCode) || imageCode == null || "".equals(imageCode))
		{
			logger.error("MobileCacheUtils.checkImageCode-----" + "伪造上送验证码数据");
			throw new MirageException(MobileApplicationErrorCode.TRAN_DATA_ERROR,"交易失败，伪造交易数据");
		}
		
		//获取缓存
		Cache cache = cacheManager.getCache(imgCodeCacheName);
		
		ValueWrapper wrapper = getImageCodeCacheValueWrapper(imageCheckCode);
		
		if(wrapper == null)
		{
			throw new MirageException(MobileApplicationErrorCode.IMAGE_CODE_TIME_OUT,"验证超时，请重新获取验证码");
		}
		
		String value = null;
		
		try
		{
			value = (String) wrapper.get();
		}
		catch(Exception e)
		{
			logger.info("缓存服务器异常");
			logger.error(e.getMessage(), e);
			throw new MirageException(MobileApplicationErrorCode.CONNECT_SERVER_ERROR);
		}
		
		if(!imageCode.equals(value))
		{
			//移除已失效的验证码缓存数据
			try
			{
				cache.evict(imageCheckCode.getBytes("UTF-8"));
			}
			catch(Exception e)
			{
				logger.info("缓存服务器异常");
				logger.error(e.getMessage(), e);
				throw new MirageException(MobileApplicationErrorCode.CONNECT_SERVER_ERROR);
			}
			throw new MirageException(MobileApplicationErrorCode.IMAGE_CODE_ERROR, "输入的验证码有误");
		}
	}
	
	/**
	 * 获取缓存wrapper
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public static ValueWrapper getImageCodeCacheValueWrapper(String key) throws Exception
	{
		try
		{
			Cache cache = cacheManager.getCache(imgCodeCacheName);
			
			ValueWrapper valueWrapper = cache.get(key.getBytes("UTF-8"));
			
			return valueWrapper;
		}
		catch(Exception e)
		{
			logger.info("缓存服务器异常");
			logger.error(e.getMessage(), e);
			throw new MirageException(MobileApplicationErrorCode.CONNECT_SERVER_ERROR);
		}
	}
	

	
	/**
	 * 获取缓存wrapper
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public static ValueWrapper getCacheValueWrapper(String key) throws Exception
	{
		Cache cache = getCache();
		
		try
		{
			ValueWrapper valueWrapper = cache.get(key.getBytes("UTF-8"));
			
			return valueWrapper;
		}
		catch(Exception e)
		{
			logger.info("缓存服务器异常");
			logger.error(e.getMessage(), e);
			throw new MirageException(MobileApplicationErrorCode.CONNECT_SERVER_ERROR);
		}
	}
	
	/**
	 * 获取缓存对象
	 * @param cacheManager
	 * @param cacheName
	 * @return
	 * @throws Exception
	 */
	public static Cache getCache() throws Exception
	{
		try
		{
			return cacheManager.getCache(cacheName);
		}
		catch(Exception e)
		{
			logger.info("缓存服务器异常");
			
			logger.error(e.getMessage(), e);
			
			throw new MirageException(MobileApplicationErrorCode.CONNECT_SERVER_ERROR);
		}
	}

	public static CacheManager getCacheManager() {
		return cacheManager;
	}

	public static void setCacheManager(CacheManager cacheManager) {
		MobileCacheUtils.cacheManager = cacheManager;
	}

	public static String getCacheName() {
		return cacheName;
	}

	public static void setCacheName(String cacheName) {
		MobileCacheUtils.cacheName = cacheName;
	}

	public static Logger getLogger() {
		return logger;
	}

	public static void setLogger(Logger logger) {
		MobileCacheUtils.logger = logger;
	}
	
	public static String getImgCodeCacheName() {
		return imgCodeCacheName;
	}

	public static void setImgCodeCacheName(String imgCodeCacheName) {
		MobileCacheUtils.imgCodeCacheName = imgCodeCacheName;
	}
	
}
