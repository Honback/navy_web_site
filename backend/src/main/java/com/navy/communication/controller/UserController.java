package com.navy.communication.controller;

import com.navy.communication.dto.UserCreateDto;
import com.navy.communication.model.User;
import com.navy.communication.model.UserRole;
import com.navy.communication.model.UserStatus;
import com.navy.communication.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @PostMapping
    public User create(@RequestBody UserCreateDto dto) {
        if (userRepository.findByEmail(dto.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 이메일입니다.");
        }
        User user = new User();
        user.setEmail(dto.email());
        user.setName(dto.name());
        user.setAffiliation(dto.affiliation());
        user.setPhone(dto.phone());
        user.setRole(UserRole.valueOf(dto.role()));
        user.setStatus(UserStatus.ACTIVE);
        return userRepository.save(user);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody UserCreateDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
        user.setEmail(dto.email());
        user.setName(dto.name());
        user.setAffiliation(dto.affiliation());
        user.setPhone(dto.phone());
        user.setRole(UserRole.valueOf(dto.role()));
        return userRepository.save(user);
    }

    @PatchMapping("/{id}/approve")
    public User approve(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
        user.setStatus(UserStatus.ACTIVE);
        return userRepository.save(user);
    }

    @PatchMapping("/{id}/reject")
    public User reject(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
        user.setStatus(UserStatus.REJECTED);
        return userRepository.save(user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
        }
        userRepository.deleteById(id);
    }
}
