package com.ycnet.mirage.zx.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ycnet.mirage.repository.MirageRepository;
import com.ycnet.mirage.zx.domain.IpAddress;

public interface IpAddressRepository extends MirageRepository<IpAddress>{
	
	/**
	 * 根据IP查询信息
	 * @param ip
	 * @return
	 */
	public IpAddress findByIp(String ip);
	
	@Query(value = "SELECT * FROM YC_IPADDRESS WHERE YC_IP = ?1", nativeQuery = true)
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public IpAddress queryByIp(String ip);
	
	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public IpAddress saveAndFlush(IpAddress ipAddress);
	
}
