package com.ycnet.mirage.zx.repository;

import java.util.List;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ycnet.mirage.zx.domain.Tempvalue;
import com.ycnet.mirage.repository.MirageRepository;

public interface TempvalueRepository extends MirageRepository<Tempvalue>{
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	List<Tempvalue> findByCertno(String certno);
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public Tempvalue saveAndFlush(Tempvalue tempvalue);
	
	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void delete(Long id);
	
}