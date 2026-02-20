package com.navy.communication.controller;

import com.navy.communication.dto.InstructorScheduleCreateDto;
import com.navy.communication.dto.InstructorScheduleResponseDto;
import com.navy.communication.model.Instructor;
import com.navy.communication.model.InstructorSchedule;
import com.navy.communication.repository.InstructorRepository;
import com.navy.communication.repository.InstructorScheduleRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/instructor-schedules")
@Transactional(readOnly = true)
public class InstructorScheduleController {

    private final InstructorScheduleRepository scheduleRepository;
    private final InstructorRepository instructorRepository;

    public InstructorScheduleController(InstructorScheduleRepository scheduleRepository,
                                         InstructorRepository instructorRepository) {
        this.scheduleRepository = scheduleRepository;
        this.instructorRepository = instructorRepository;
    }

    @GetMapping
    public List<InstructorScheduleResponseDto> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return scheduleRepository.findAllByDateRange(startDate, endDate)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/instructor/{instructorId}")
    public List<InstructorScheduleResponseDto> getByInstructor(
            @PathVariable Long instructorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<InstructorSchedule> schedules;
        if (startDate != null && endDate != null) {
            schedules = scheduleRepository.findByInstructorIdAndDateRange(instructorId, startDate, endDate);
        } else {
            schedules = scheduleRepository.findByInstructorIdOrderByScheduleDateAsc(instructorId);
        }
        return schedules.stream().map(this::toDto).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public InstructorScheduleResponseDto create(@RequestBody InstructorScheduleCreateDto dto) {
        Instructor instructor = instructorRepository.findById(dto.instructorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "강사를 찾을 수 없습니다."));

        InstructorSchedule schedule = new InstructorSchedule();
        schedule.setInstructor(instructor);
        schedule.setScheduleDate(dto.scheduleDate());
        schedule.setEndDate(dto.endDate());
        schedule.setDescription(dto.description());
        schedule.setSource("MANUAL");

        return toDto(scheduleRepository.save(schedule));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void delete(@PathVariable Long id) {
        InstructorSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "일정을 찾을 수 없습니다."));
        if ("REQUEST".equals(schedule.getSource())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "승인된 요청의 일정은 요청 관리에서 취소해주세요.");
        }
        scheduleRepository.deleteById(id);
    }

    private InstructorScheduleResponseDto toDto(InstructorSchedule s) {
        return new InstructorScheduleResponseDto(
                s.getId(),
                s.getInstructor().getId(),
                s.getInstructor().getName(),
                s.getInstructor().getRank(),
                s.getScheduleDate(),
                s.getEndDate(),
                s.getDescription(),
                s.getSource(),
                s.getRequest() != null ? s.getRequest().getId() : null,
                s.getCreatedAt()
        );
    }
}
