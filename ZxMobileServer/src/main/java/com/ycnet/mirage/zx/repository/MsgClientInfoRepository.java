package com.ycnet.mirage.zx.repository;

import com.ycnet.mirage.repository.MirageRepository;
import com.ycnet.mirage.zx.domain.MsgClientInfo;

public interface MsgClientInfoRepository extends MirageRepository<MsgClientInfo>{
	
	MsgClientInfo findByMacAddress(String address);
	
	MsgClientInfo findByCId(String cId);
	
}
