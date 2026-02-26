package com.navy.communication.repository;

import com.navy.communication.model.VenueContact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VenueContactRepository extends JpaRepository<VenueContact, Long> {
    List<VenueContact> findByVenueId(Long venueId);
}
