package com.navy.communication.repository;

import com.navy.communication.model.VenueRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VenueRoomRepository extends JpaRepository<VenueRoom, Long> {
    List<VenueRoom> findByVenueId(Long venueId);
}
