package com.ycnet.mirage.zx.repository;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ycnet.mirage.zx.domain.IdcheckLog;
import com.ycnet.mirage.repository.MirageRepository;

public interface IdcheckLogRepository extends MirageRepository<IdcheckLog>{
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public IdcheckLog saveAndFlush(IdcheckLog idcheckLog);
}
