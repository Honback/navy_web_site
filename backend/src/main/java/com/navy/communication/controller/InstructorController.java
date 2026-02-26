package com.navy.communication.controller;

import com.navy.communication.dto.InstructorCreateDto;
import com.navy.communication.model.Instructor;
import com.navy.communication.repository.InstructorRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/api/instructors")
public class InstructorController {

    private final InstructorRepository instructorRepository;
    private final Path uploadDir = Paths.get("/uploads/instructors");

    public InstructorController(InstructorRepository instructorRepository) {
        this.instructorRepository = instructorRepository;
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
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

    @PostMapping("/{id}/photo")
    public Instructor uploadPhoto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "강사를 찾을 수 없습니다."));

        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일이 비어있습니다.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미지 파일만 업로드 가능합니다.");
        }

        try {
            String originalName = file.getOriginalFilename();
            String ext = originalName != null && originalName.contains(".")
                    ? originalName.substring(originalName.lastIndexOf('.'))
                    : ".jpg";
            String filename = "instructor_" + id + ext;

            // Delete any previous photo with different extension
            Files.list(uploadDir)
                    .filter(p -> p.getFileName().toString().startsWith("instructor_" + id + "."))
                    .forEach(p -> { try { Files.deleteIfExists(p); } catch (IOException ignored) {} });

            Path target = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            instructor.setPhotoUrl("/api/instructors/" + id + "/photo");
            return instructorRepository.save(instructor);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 저장 실패");
        }
    }

    @GetMapping("/{id}/photo")
    public ResponseEntity<Resource> getPhoto(@PathVariable Long id) {
        try {
            Path[] candidates = Files.list(uploadDir)
                    .filter(p -> p.getFileName().toString().startsWith("instructor_" + id + "."))
                    .toArray(Path[]::new);

            if (candidates.length == 0) {
                return ResponseEntity.notFound().build();
            }

            Path photoPath = candidates[0];
            Resource resource = new UrlResource(photoPath.toUri());
            String ct = Files.probeContentType(photoPath);
            if (ct == null) ct = "image/jpeg";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(ct))
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}/photo")
    public Instructor deletePhoto(@PathVariable Long id) {
        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "강사를 찾을 수 없습니다."));

        try {
            Files.list(uploadDir)
                    .filter(p -> p.getFileName().toString().startsWith("instructor_" + id + "."))
                    .forEach(p -> { try { Files.deleteIfExists(p); } catch (IOException ignored) {} });
        } catch (IOException ignored) {}

        instructor.setPhotoUrl(null);
        return instructorRepository.save(instructor);
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
