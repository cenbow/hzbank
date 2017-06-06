package com.ycnet.mirage.zx.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ycnet.mirage.repository.MirageRepository;
import com.ycnet.mirage.zx.domain.AppMenu;
import com.ycnet.mirage.zx.domain.StaticVersion;
import com.ycnet.mirage.zx.domain.Version;

public interface StaticVersionRepository extends MirageRepository<StaticVersion>{
	
	List<StaticVersion> findByStaticVersionGreaterThanAndStaticUpdateTypeOrderByStaticVersionDesc(String version,String type);
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	StaticVersion findByStaticVersion(String version);
	
	List<StaticVersion> findByStaticVersionIn(List<String> versions);
	
	List<StaticVersion> findByGeneralVersion(String version);
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	List<StaticVersion> findByStaticUpdateTypeOrderByGeneralVersionDesc(String version);
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	List<StaticVersion> findByStaticUpdateTypeAndGeneralVersionOrderByStaticVersionDesc(String type,String version );
	
	@Query("SELECT u FROM StaticVersion u WHERE u.staticUpdateType = ?1 and u.generalVersion = ?2 "
			+ "and u.staticVersion in ?3 order by u.staticVersion asc")
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	List<StaticVersion> findStaticVersion(String type,String version,List<String> cliVersion);
}
