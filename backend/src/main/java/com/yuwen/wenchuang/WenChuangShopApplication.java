package com.yuwen.wenchuang;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.yuwen.wenchuang.mapper")
public class WenChuangShopApplication {
    public static void main(String[] args) {
        SpringApplication.run(WenChuangShopApplication.class, args);
    }
}
