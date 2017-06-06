/**
 * 
 */
package com.ycnet.mirage.zx.config;

import java.util.HashSet;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.jedis.JedisConnection;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisSentinelPool;
import redis.clients.jedis.Protocol;

/**
 * IFP平台JedisConnection工厂,提供高可用的Jedis Sentinel Connection
 * 
 * @author lingal
 * 
 */
public class IfpJedisSentinelConnectionFactory implements InitializingBean,
		DisposableBean, RedisConnectionFactory {

	private final static Log log = LogFactory.getLog(IfpJedisSentinelConnectionFactory.class);
	
	public static final int DEFAULT_SENTINEL_PORT = 26379; 

	private String sentinelAndPort = "localhost:" + DEFAULT_SENTINEL_PORT;
	private String mastername = "mymaster";
	private int timeout = Protocol.DEFAULT_TIMEOUT;
	private String password;
	private JedisSentinelPool pool = null;
	private GenericObjectPoolConfig poolConfig = new GenericObjectPoolConfig();
	private int dbIndex = 0;
	private boolean convertPipelineAndTxResults = true;

	/**
	 * <ol>
	 * <b></b>
	 * <li></li>
	 * </ol>
	 * 
	 * @see org.springframework.dao.support.PersistenceExceptionTranslator#translateExceptionIfPossible(java.lang.RuntimeException)
	 */
	public DataAccessException translateExceptionIfPossible(RuntimeException arg0) {
		return null;
	}

	/**
	 * <ol>
	 * <b></b>
	 * <li></li>
	 * </ol>
	 * 
	 * @see org.springframework.data.redis.connection.RedisConnectionFactory#getConnection()
	 */
	public JedisConnection getConnection() {
		Jedis jedis = fetchJedisConnector();
		JedisConnection connection = new JedisConnection(jedis, pool, dbIndex);
		connection.setConvertPipelineAndTxResults(convertPipelineAndTxResults);
		return postProcessConnection(connection);
	}

	protected JedisConnection postProcessConnection(JedisConnection connection) {
		return connection;
	}

	/**
	 * <ol>
	 * <b></b>
	 * <li></li>
	 * </ol>
	 * 
	 * @see org.springframework.data.redis.connection.RedisConnectionFactory#getConvertPipelineAndTxResults()
	 */
	public boolean getConvertPipelineAndTxResults() {
		return convertPipelineAndTxResults;
	}

	/**
	 * <ol>
	 * <b></b>
	 * <li></li>
	 * </ol>
	 * 
	 * @see org.springframework.beans.factory.DisposableBean#destroy()
	 */
	public void destroy() throws Exception {
		if (pool != null) {
			try {
				pool.destroy();
			} catch (Exception ex) {
				log.warn("Cannot properly close Jedis pool", ex);
			}
			pool = null;
		}
	}

	/**
	 * <ol>
	 * <b></b>
	 * <li></li>
	 * </ol>
	 * 
	 * @see org.springframework.beans.factory.InitializingBean#afterPropertiesSet()
	 */
	public void afterPropertiesSet() throws Exception {
		Set<String> sentinels = new HashSet<String>();
		String[] hostAndPorts = sentinelAndPort.split(",");
		for (String hap : hostAndPorts) {
			sentinels.add(hap);
		}
		pool = new JedisSentinelPool(mastername, sentinels, poolConfig);
	}

	protected Jedis fetchJedisConnector() {
		try {
			return pool.getResource();
		} catch (Exception ex) {
			throw new RedisConnectionFailureException("Cannot get Jedis connection", ex);
		}
	}

	public String getSentinelAndPort() {
		return sentinelAndPort;
	}

	public void setSentinelAndPort(String sentinelAndPort) {
		this.sentinelAndPort = sentinelAndPort;
	}

	public String getMastername() {
		return mastername;
	}

	public void setMastername(String mastername) {
		this.mastername = mastername;
	}

	public int getTimeout() {
		return timeout;
	}

	public void setTimeout(int timeout) {
		this.timeout = timeout;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public JedisSentinelPool getPool() {
		return pool;
	}

	public GenericObjectPoolConfig getPoolConfig() {
		return poolConfig;
	}

	public void setPoolConfig(GenericObjectPoolConfig poolConfig) {
		this.poolConfig = poolConfig;
	}
	
	

}
