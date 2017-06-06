package com.ycnet.mirage.zx.repository;

import java.util.List;

import com.ycnet.mirage.repository.MirageRepository;
import com.ycnet.mirage.zx.domain.WebClientVersion;

public interface WebClientVersionRepository extends MirageRepository<WebClientVersion>{
	
	List<WebClientVersion> findByPlatformAndAppVersion(String platform,String appVersion);
	
}
