package com.ycnet.mirage.zx.repository;


import java.util.List;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ycnet.mirage.zx.domain.Whitelist;
import com.ycnet.mirage.repository.MirageRepository;

public interface WhitelistRepository extends MirageRepository<Whitelist>{
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	List<Whitelist> findByPersonid(String personid);
}
	