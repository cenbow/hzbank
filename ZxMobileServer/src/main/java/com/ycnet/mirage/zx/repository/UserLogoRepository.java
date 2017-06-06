package com.ycnet.mirage.zx.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ycnet.mirage.repository.MirageRepository;
import com.ycnet.mirage.zx.domain.UserLogo;

public interface UserLogoRepository extends MirageRepository<UserLogo>{
	
	/**
	 * 根据客户号查证头像信息
	 * @param customerId
	 * @return
	 */
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	UserLogo findByCustomerId(String customerId);
	
	/**
	 * 根据客户手机号查询头像信息
	 * @param mobileNo
	 * @return
	 */
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	UserLogo findByMobileNo(String mobileNo);
	
	/**
	 * 查询联系人头像
	 * @author wangst
	 * @return
	 */
	@Query("select s from UserLogo s where s.mobileNo in ?1")
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	List<UserLogo> findByMobileNos(List<String> phone);
}
