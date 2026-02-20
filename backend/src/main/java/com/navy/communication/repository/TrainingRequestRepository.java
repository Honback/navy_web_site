package com.navy.communication.repository;

import com.navy.communication.model.RequestStatus;
import com.navy.communication.model.TrainingRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TrainingRequestRepository extends JpaRepository<TrainingRequest, Long> {
    List<TrainingRequest> findAllByOrderByCreatedAtDesc();
    List<TrainingRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<TrainingRequest> findByRequestDateAndStatus(LocalDate requestDate, RequestStatus status);
}
