package com.ycnet.mirage.zx.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ycnet.mirage.zx.domain.PubAppar;
import com.ycnet.mirage.repository.MirageRepository;

public interface PubApparRepository extends MirageRepository<PubAppar>{
	
	List<PubAppar> findByCodeAndLanguage(String code, String language);
	
	@Query("SELECT DISTINCT(u.code||u.language) FROM PubAppar u")
	List<String> queryAllParamType();
	
	@Query("SELECT u FROM PubAppar u WHERE u.code||u.language = ?1")
	List<PubAppar> queryPubApparListByType(String type);
	
	PubAppar findByCodeAndValueAndLanguage(String code, String value, String language);
	
	@Transactional
	List<PubAppar> findByValue(String value);
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	PubAppar findByNameAndType(String name, String type);
}
