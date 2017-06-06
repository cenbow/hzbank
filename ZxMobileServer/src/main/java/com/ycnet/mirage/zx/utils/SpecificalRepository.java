package com.ycnet.mirage.zx.utils;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.transaction.annotation.Transactional;

@NoRepositoryBean
@Transactional
public interface SpecificalRepository<T> extends JpaRepository<T, String>, JpaSpecificationExecutor<T>{

}
