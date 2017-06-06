package com.ycnet.mirage.zx.repository;

import java.util.List;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ycnet.mirage.repository.MirageRepository;
import com.ycnet.mirage.zx.domain.UserBehavior;

public interface UserBehaviorRepository extends MirageRepository<UserBehavior>{
	
	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public <S extends UserBehavior> List<S> save(Iterable<S> entities);
	
}	
