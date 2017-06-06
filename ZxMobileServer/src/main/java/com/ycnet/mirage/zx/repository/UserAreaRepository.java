package com.ycnet.mirage.zx.repository;

import com.ycnet.mirage.repository.MirageRepository;
import com.ycnet.mirage.zx.domain.UserArea;

public interface UserAreaRepository extends MirageRepository<UserArea>{
	
	/**
	 * 根据mac地址查询用户区域绑定信息
	 * @param macAddress
	 * @return
	 */
	UserArea findByMacAddress(String macAddress);
}
