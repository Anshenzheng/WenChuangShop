package com.yuwen.wenchuang.controller;

import com.yuwen.wenchuang.common.Result;
import com.yuwen.wenchuang.dto.LoginDTO;
import com.yuwen.wenchuang.dto.RegisterDTO;
import com.yuwen.wenchuang.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@Valid @RequestBody LoginDTO dto) {
        return authService.login(dto);
    }
    
    @PostMapping("/register")
    public Result<Map<String, Object>> register(@Valid @RequestBody RegisterDTO dto) {
        return authService.register(dto);
    }
    
    @GetMapping("/me")
    public Result<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal String username) {
        return authService.getCurrentUser(username);
    }
}
