package com.yuwen.wenchuang.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class OrderCreateDTO {
    @NotBlank(message = "收货人姓名不能为空")
    private String username;
    
    @NotBlank(message = "收货人电话不能为空")
    private String phone;
    
    @NotBlank(message = "收货地址不能为空")
    private String address;
    
    @NotNull(message = "购物车项不能为空")
    private List<Long> cartIds;
    
    private String remark;
}
