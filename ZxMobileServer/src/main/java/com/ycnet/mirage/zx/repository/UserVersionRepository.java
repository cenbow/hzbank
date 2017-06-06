package com.ycnet.mirage.zx.repository;

import com.ycnet.mirage.repository.MirageRepository;
import com.ycnet.mirage.zx.domain.UserVersion;

public interface UserVersionRepository extends MirageRepository<UserVersion>{
	
	/**
	 * 根据Mac地址查询版本绑定信息
	 * @param macAddress
	 * @return
	 */
	UserVersion findByMacAddress(String macAddress);
}
