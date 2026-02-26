package com.navy.communication.repository;

import com.navy.communication.model.BoardPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BoardPostRepository extends JpaRepository<BoardPost, Long> {
    List<BoardPost> findAllByOrderByCreatedAtDesc();
}
