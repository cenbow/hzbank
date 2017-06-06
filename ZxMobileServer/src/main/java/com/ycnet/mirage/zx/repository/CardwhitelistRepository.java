package com.ycnet.mirage.zx.repository;


import java.util.List;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ycnet.mirage.zx.domain.Cardwhitelist;
import com.ycnet.mirage.repository.MirageRepository;

public interface CardwhitelistRepository extends MirageRepository<Cardwhitelist>{
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	List<Cardwhitelist> findByCardno(String cardno);
}
	