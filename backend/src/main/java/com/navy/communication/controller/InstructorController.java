package com.navy.communication.controller;

import com.navy.communication.dto.InstructorCreateDto;
import com.navy.communication.model.Instructor;
import com.navy.communication.repository.InstructorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/instructors")
public class InstructorController {

    private final InstructorRepository instructorRepository;

    public InstructorController(InstructorRepository instructorRepository) {
        this.instructorRepository = instructorRepository;
    }

    @GetMapping
    public List<Instructor> getAll() {
        return instructorRepository.findAll();
    }

    @PostMapping
    public Instructor create(@RequestBody InstructorCreateDto dto) {
        Instructor instructor = new Instructor();
        applyDto(instructor, dto);
        return instructorRepository.save(instructor);
    }

    @PutMapping("/{id}")
    public Instructor update(@PathVariable Long id, @RequestBody InstructorCreateDto dto) {
        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "강사를 찾을 수 없습니다."));
        applyDto(instructor, dto);
        return instructorRepository.save(instructor);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!instructorRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "강사를 찾을 수 없습니다.");
        }
        instructorRepository.deleteById(id);
    }

    private void applyDto(Instructor instructor, InstructorCreateDto dto) {
        instructor.setName(dto.name());
        instructor.setRank(dto.rank());
        instructor.setSpecialty(dto.specialty());
        instructor.setPhone(dto.phone());
        instructor.setEmail(dto.email());
        instructor.setAffiliation(dto.affiliation());
        instructor.setEducationTopic(dto.educationTopic());
        instructor.setAvailableRegion(dto.availableRegion());
        instructor.setRating(dto.rating());
        instructor.setRecommendation(dto.recommendation());
        instructor.setCategory(dto.category() != null ? dto.category() : "소통");
        instructor.setNotes(dto.notes());
        instructor.setCareer(dto.career());
        instructor.setOneLineReview(dto.oneLineReview());
        instructor.setConditions(dto.conditions());
        instructor.setDeliveryScore(dto.deliveryScore());
        instructor.setExpertiseScore(dto.expertiseScore());
        instructor.setInteractionScore(dto.interactionScore());
        instructor.setTimeManagementScore(dto.timeManagementScore());
        instructor.setStrengths(dto.strengths());
        instructor.setWeaknesses(dto.weaknesses());
    }
}
