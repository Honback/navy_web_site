package com.navy.communication.controller;

import com.navy.communication.dto.VenueCreateDto;
import com.navy.communication.model.Venue;
import com.navy.communication.repository.VenueRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
public class VenueController {

    private final VenueRepository venueRepository;

    public VenueController(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    @GetMapping
    public List<Venue> getAll() {
        return venueRepository.findAll();
    }

    @PostMapping
    public Venue create(@RequestBody VenueCreateDto dto) {
        Venue venue = new Venue();
        applyDto(venue, dto);
        return venueRepository.save(venue);
    }

    @PutMapping("/{id}")
    public Venue update(@PathVariable Long id, @RequestBody VenueCreateDto dto) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "장소를 찾을 수 없습니다."));
        applyDto(venue, dto);
        return venueRepository.save(venue);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!venueRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "장소를 찾을 수 없습니다.");
        }
        venueRepository.deleteById(id);
    }

    private void applyDto(Venue venue, VenueCreateDto dto) {
        venue.setName(dto.name());
        venue.setAddress(dto.address());
        venue.setBuilding(dto.building());
        venue.setRoomNumber(dto.roomNumber());
        venue.setCapacity(dto.capacity() != null ? dto.capacity() : 0);
        venue.setRegion(dto.region());
        venue.setLectureCapacity(dto.lectureCapacity());
        venue.setAccommodationCapacity(dto.accommodationCapacity());
        venue.setMealCost(dto.mealCost());
        venue.setOverallRating(dto.overallRating());
        venue.setNotes(dto.notes());
        venue.setWebsite(dto.website());
        venue.setReservationContact(dto.reservationContact());
        venue.setSummary(dto.summary());
        venue.setLectureRooms(dto.lectureRooms());
        venue.setUsageFee(dto.usageFee());
        venue.setBannerSize(dto.bannerSize());
        venue.setDeskLayout(dto.deskLayout());
        venue.setRoomStatus(dto.roomStatus());
        venue.setRoomAmenities(dto.roomAmenities());
        venue.setPersonalItems(dto.personalItems());
        venue.setConvenienceFacilities(dto.convenienceFacilities());
        venue.setRestaurantContact(dto.restaurantContact());
        venue.setReservationRules(dto.reservationRules());
        venue.setImportantTips(dto.importantTips());
        venue.setSubFacilities(dto.subFacilities());
        venue.setEvaluation(dto.evaluation());
        venue.setSurveyImages(dto.surveyImages());
    }
}
