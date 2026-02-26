package com.navy.communication.controller;

import com.navy.communication.dto.VenueRoomCreateDto;
import com.navy.communication.model.VenueRoom;
import com.navy.communication.repository.VenueRoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/venue-rooms")
public class VenueRoomController {

    private final VenueRoomRepository repository;

    public VenueRoomController(VenueRoomRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<VenueRoom> getAll() {
        return repository.findAll();
    }

    @GetMapping("/venue/{venueId}")
    public List<VenueRoom> getByVenue(@PathVariable Long venueId) {
        return repository.findByVenueId(venueId);
    }

    @PostMapping
    public VenueRoom create(@RequestBody VenueRoomCreateDto dto) {
        VenueRoom room = new VenueRoom();
        applyDto(room, dto);
        return repository.save(room);
    }

    @PutMapping("/{id}")
    public VenueRoom update(@PathVariable Long id, @RequestBody VenueRoomCreateDto dto) {
        VenueRoom room = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "강의실을 찾을 수 없습니다."));
        applyDto(room, dto);
        return repository.save(room);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "강의실을 찾을 수 없습니다.");
        }
        repository.deleteById(id);
    }

    private void applyDto(VenueRoom room, VenueRoomCreateDto dto) {
        room.setVenueId(dto.venueId());
        room.setName(dto.name());
        room.setCapacity(dto.capacity());
        room.setHasProjector(dto.hasProjector());
        room.setHasMicrophone(dto.hasMicrophone());
        room.setHasWhiteboard(dto.hasWhiteboard());
        room.setBannerSize(dto.bannerSize());
        room.setPodiumSize(dto.podiumSize());
        room.setDeskLayout(dto.deskLayout());
        room.setNotes(dto.notes());
    }
}
