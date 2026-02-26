package com.navy.communication.controller;

import com.navy.communication.dto.NoticeCreateDto;
import com.navy.communication.model.Notice;
import com.navy.communication.repository.NoticeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    private final NoticeRepository noticeRepository;

    public NoticeController(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    @GetMapping
    public List<Notice> getAll() {
        return noticeRepository.findAllByOrderByImportantDescCreatedAtDesc();
    }

    @PostMapping
    public Notice create(@RequestBody NoticeCreateDto dto) {
        Notice notice = new Notice();
        notice.setTitle(dto.title());
        notice.setContent(dto.content());
        notice.setAuthor(dto.author());
        notice.setImportant(dto.important() != null ? dto.important() : false);
        return noticeRepository.save(notice);
    }

    @PutMapping("/{id}")
    public Notice update(@PathVariable Long id, @RequestBody NoticeCreateDto dto) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        notice.setTitle(dto.title());
        notice.setContent(dto.content());
        notice.setAuthor(dto.author());
        notice.setImportant(dto.important() != null ? dto.important() : false);
        return noticeRepository.save(notice);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!noticeRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        noticeRepository.deleteById(id);
    }
}
