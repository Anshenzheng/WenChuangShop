package com.yuwen.wenchuang.service;

import com.yuwen.wenchuang.common.Result;
import com.yuwen.wenchuang.dto.LoginDTO;
import com.yuwen.wenchuang.dto.RegisterDTO;
import com.yuwen.wenchuang.entity.User;
import com.yuwen.wenchuang.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    
    public Result<Map<String, Object>> login(LoginDTO dto) {
        User user = userService.getByUsername(dto.getUsername());
        
        if (user == null) {
            return Result.error(401, "用户名或密码错误");
        }
        
        if (user.getStatus() != 1) {
            return Result.error(403, "账户已被禁用");
        }
        
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            return Result.error(401, "用户名或密码错误");
        }
        
        String token = jwtService.generateToken(user.getUsername(), user.getRole());
        
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", buildUserInfo(user));
        
        return Result.success("登录成功", result);
    }
    
    public Result<Map<String, Object>> register(RegisterDTO dto) {
        Result<User> registerResult = userService.register(dto);
        if (!registerResult.getCode().equals(200)) {
            return Result.error(registerResult.getMessage());
        }
        
        User user = registerResult.getData();
        String token = jwtService.generateToken(user.getUsername(), user.getRole());
        
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", buildUserInfo(user));
        
        return Result.success("注册成功", result);
    }
    
    public Result<Map<String, Object>> getCurrentUser(String username) {
        User user = userService.getByUsername(username);
        if (user == null) {
            return Result.error(404, "用户不存在");
        }
        
        return Result.success(buildUserInfo(user));
    }
    
    private Map<String, Object> buildUserInfo(User user) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("nickname", user.getNickname());
        userInfo.put("email", user.getEmail());
        userInfo.put("phone", user.getPhone());
        userInfo.put("avatar", user.getAvatar());
        userInfo.put("role", user.getRole());
        userInfo.put("status", user.getStatus());
        return userInfo;
    }
}
