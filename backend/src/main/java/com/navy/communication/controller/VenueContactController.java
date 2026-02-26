package com.navy.communication.controller;

import com.navy.communication.dto.VenueContactCreateDto;
import com.navy.communication.model.VenueContact;
import com.navy.communication.repository.VenueContactRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/venue-contacts")
public class VenueContactController {

    private final VenueContactRepository repository;

    public VenueContactController(VenueContactRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<VenueContact> getAll() {
        return repository.findAll();
    }

    @GetMapping("/venue/{venueId}")
    public List<VenueContact> getByVenue(@PathVariable Long venueId) {
        return repository.findByVenueId(venueId);
    }

    @PostMapping
    public VenueContact create(@RequestBody VenueContactCreateDto dto) {
        VenueContact contact = new VenueContact();
        applyDto(contact, dto);
        return repository.save(contact);
    }

    @PutMapping("/{id}")
    public VenueContact update(@PathVariable Long id, @RequestBody VenueContactCreateDto dto) {
        VenueContact contact = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "담당자를 찾을 수 없습니다."));
        applyDto(contact, dto);
        return repository.save(contact);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "담당자를 찾을 수 없습니다.");
        }
        repository.deleteById(id);
    }

    private void applyDto(VenueContact contact, VenueContactCreateDto dto) {
        contact.setVenueId(dto.venueId());
        contact.setName(dto.name());
        contact.setRole(dto.role());
        contact.setPhone(dto.phone());
        contact.setEmail(dto.email());
        contact.setPreferredContact(dto.preferredContact());
        contact.setNotes(dto.notes());
    }
}
