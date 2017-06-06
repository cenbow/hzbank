package com.ycnet.mirage.zx.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ycnet.mirage.repository.MirageRepository;
import com.ycnet.mirage.zx.domain.AppMenu;
import com.ycnet.mirage.zx.domain.Version;

public interface AppMenuRepository extends MirageRepository<AppMenu>{
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	List<AppMenu> findByStatus(String status);
	
	@Query("SELECT u FROM AppMenu u WHERE u.status = ?1 and u.type = ?2 "
			+ "and  ?3 >= u.startDate and ?3 <= u.endDate")
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	List<AppMenu> findByActive(String status,String type,String sysDate);
	
}
