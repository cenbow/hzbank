package com.ycnet.mirage.zx.repository;

import java.util.List;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ycnet.mirage.zx.domain.Tempclientinfo;
import com.ycnet.mirage.repository.MirageRepository;

public interface TempclientinfoRepository extends MirageRepository<Tempclientinfo>{
	List<Tempclientinfo> findByMacaddress(String macaddress);
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public Tempclientinfo saveAndFlush(Tempclientinfo tempclientinfo);
	
	/*@Modifying
	@Query("DELETE FROM Tempclientinfo u WHERE u.certno = ?1")
	public void updateTempclientinfo(String certNo);*/
}
