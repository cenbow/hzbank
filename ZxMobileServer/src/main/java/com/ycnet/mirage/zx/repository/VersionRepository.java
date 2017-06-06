package com.ycnet.mirage.zx.repository;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ycnet.mirage.repository.MirageRepository;
import com.ycnet.mirage.zx.domain.Version;

public interface VersionRepository extends MirageRepository<Version>{
	
	/**
	 * 根据客户端类型查询版本信息
	 * @param platform
	 * @return
	 */
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	Version findByPlatform(String platform);
}
