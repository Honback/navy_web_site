package com.navy.communication.controller;

import com.navy.communication.dto.BoardPostCreateDto;
import com.navy.communication.model.BoardPost;
import com.navy.communication.repository.BoardPostRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/board-posts")
public class BoardPostController {

    private final BoardPostRepository boardPostRepository;

    public BoardPostController(BoardPostRepository boardPostRepository) {
        this.boardPostRepository = boardPostRepository;
    }

    @GetMapping
    public List<BoardPost> getAll() {
        return boardPostRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public BoardPost create(@RequestBody BoardPostCreateDto dto) {
        BoardPost post = new BoardPost();
        post.setTitle(dto.title());
        post.setContent(dto.content());
        post.setSummary(dto.summary());
        post.setAuthor(dto.author());
        post.setTags(dto.tags());
        post.setImages(dto.images());
        return boardPostRepository.save(post);
    }

    @PutMapping("/{id}")
    public BoardPost update(@PathVariable Long id, @RequestBody BoardPostCreateDto dto) {
        BoardPost post = boardPostRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        post.setTitle(dto.title());
        post.setContent(dto.content());
        post.setSummary(dto.summary());
        post.setAuthor(dto.author());
        post.setTags(dto.tags());
        post.setImages(dto.images());
        return boardPostRepository.save(post);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!boardPostRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        boardPostRepository.deleteById(id);
    }
}
