package com.ycnet.mirage.zx.repository;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ycnet.mirage.repository.MirageRepository;
import com.ycnet.mirage.zx.domain.VersionHistory;

public interface VersionHistoryRepository extends MirageRepository<VersionHistory>{
	
	/**
	 * 查找版本历史记录
	 * @param platform
	 * @param appVersion
	 * @return
	 */
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	VersionHistory findByPlatformAndAppversion(String platform, String appVersion);
}
