package com.ycnet.mirage.zx.repository;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ycnet.mirage.repository.MirageRepository;
import com.ycnet.mirage.zx.domain.UserIdentity;

public interface UserIdentityRepository extends MirageRepository<UserIdentity>{
	
	/**
	 * 根据客户号查询身份证信息
	 * @param customerId
	 * @return
	 */
	UserIdentity findByCustomerId(String customerId);
	
	/**
	 * 根据客户手机号查询身份证信息
	 * @param mobileNo
	 * @return
	 */
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	UserIdentity findByMobileNo(String mobileNo);
	
	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public UserIdentity saveAndFlush(UserIdentity userIdentity);
}
