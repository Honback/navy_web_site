package com.navy.communication.controller;

import com.navy.communication.dto.LoginRequest;
import com.navy.communication.dto.RegisterRequest;
import com.navy.communication.model.User;
import com.navy.communication.model.UserStatus;
import com.navy.communication.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "등록되지 않은 이메일입니다."));
        if (user.getStatus() == UserStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "계정 승인 대기 중입니다. 관리자 승인 후 로그인 가능합니다.");
        }
        if (user.getStatus() == UserStatus.REJECTED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "계정 등록이 반려되었습니다. 관리자에게 문의하세요.");
        }
        return user;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public User register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 이메일입니다.");
        }
        User user = new User();
        user.setEmail(request.email());
        user.setName(request.name());
        user.setAffiliation(request.affiliation());
        user.setPhone(request.phone());
        user.setFleet(request.fleet());
        user.setShip(request.ship());
        user.setStatus(UserStatus.PENDING);
        return userRepository.save(user);
    }
}
