package com.navy.communication.service;

import com.navy.communication.dto.AvailabilityResponseDto;
import com.navy.communication.dto.TrainingRequestCreateDto;
import com.navy.communication.dto.TrainingRequestResponseDto;
import com.navy.communication.model.*;
import com.navy.communication.repository.InstructorRepository;
import com.navy.communication.repository.InstructorScheduleRepository;
import com.navy.communication.repository.TrainingRequestRepository;
import com.navy.communication.repository.UserRepository;
import com.navy.communication.repository.VenueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
public class TrainingRequestService {

    private final TrainingRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final InstructorRepository instructorRepository;
    private final VenueRepository venueRepository;
    private final InstructorScheduleRepository scheduleRepository;

    public TrainingRequestService(TrainingRequestRepository requestRepository,
                                  UserRepository userRepository,
                                  InstructorRepository instructorRepository,
                                  VenueRepository venueRepository,
                                  InstructorScheduleRepository scheduleRepository) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.instructorRepository = instructorRepository;
        this.venueRepository = venueRepository;
        this.scheduleRepository = scheduleRepository;
    }

    @Transactional
    public TrainingRequestResponseDto createRequest(TrainingRequestCreateDto dto) {
        User user = userRepository.findById(dto.userId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Venue venue = venueRepository.findById(dto.venueId())
                .orElseThrow(() -> new IllegalArgumentException("Venue not found"));

        Venue secondVenue = null;
        if (dto.secondVenueId() != null) {
            secondVenue = venueRepository.findById(dto.secondVenueId())
                    .orElseThrow(() -> new IllegalArgumentException("Second venue not found"));
        }

        TrainingRequest request = new TrainingRequest();
        request.setUser(user);

        if (dto.identityInstructorId() != null) {
            request.setIdentityInstructor(instructorRepository.findById(dto.identityInstructorId()).orElse(null));
        }
        if (dto.securityInstructorId() != null) {
            request.setSecurityInstructor(instructorRepository.findById(dto.securityInstructorId()).orElse(null));
        }
        if (dto.communicationInstructorId() != null) {
            request.setCommunicationInstructor(instructorRepository.findById(dto.communicationInstructorId()).orElse(null));
        }

        request.setVenue(venue);
        request.setSecondVenue(secondVenue);
        request.setTrainingType(dto.trainingType());
        request.setFleet(dto.fleet());
        request.setRequestDate(dto.requestDate());
        request.setRequestEndDate(dto.requestEndDate());
        request.setStartTime(dto.startTime());
        request.setNotes(dto.notes());

        TrainingRequest saved = requestRepository.save(request);
        return toResponseDto(saved);
    }

    @Transactional
    public TrainingRequestResponseDto assignInstructors(Long requestId, Long identityId, Long securityId, Long communicationId) {
        TrainingRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found: " + requestId));

        if (identityId != null) {
            request.setIdentityInstructor(instructorRepository.findById(identityId).orElse(null));
        } else {
            request.setIdentityInstructor(null);
        }
        if (securityId != null) {
            request.setSecurityInstructor(instructorRepository.findById(securityId).orElse(null));
        } else {
            request.setSecurityInstructor(null);
        }
        if (communicationId != null) {
            request.setCommunicationInstructor(instructorRepository.findById(communicationId).orElse(null));
        } else {
            request.setCommunicationInstructor(null);
        }

        TrainingRequest saved = requestRepository.save(request);
        return toResponseDto(saved);
    }

    @Transactional(readOnly = true)
    public List<TrainingRequestResponseDto> getAllRequests() {
        return requestRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TrainingRequestResponseDto> getRequestsByUser(Long userId) {
        return requestRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    @Transactional
    public TrainingRequestResponseDto updateStatus(Long requestId, RequestStatus status) {
        TrainingRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found: " + requestId));

        RequestStatus oldStatus = request.getStatus();
        request.setStatus(status);
        TrainingRequest saved = requestRepository.save(request);

        // Auto-create instructor schedules on APPROVE
        if (status == RequestStatus.APPROVED && oldStatus != RequestStatus.APPROVED) {
            createSchedulesForRequest(saved);
        }

        // Remove schedules if cancelled/rejected after approval
        if ((status == RequestStatus.CANCELLED || status == RequestStatus.REJECTED)
                && oldStatus == RequestStatus.APPROVED) {
            scheduleRepository.deleteByRequestId(requestId);
        }

        return toResponseDto(saved);
    }

    @Transactional(readOnly = true)
    public AvailabilityResponseDto getAvailability(LocalDate date) {
        // Get booked instructor IDs from instructor_schedules table
        List<Long> bookedInstructorIds = scheduleRepository.findBookedInstructorIdsByDate(date);

        // Get booked venue IDs from approved requests
        List<TrainingRequest> approved = requestRepository.findByRequestDateAndStatus(date, RequestStatus.APPROVED);
        List<Long> bookedVenueIds = approved.stream()
                .map(r -> r.getVenue().getId())
                .distinct()
                .toList();

        return new AvailabilityResponseDto(bookedInstructorIds, bookedVenueIds);
    }

    @Transactional
    public TrainingRequestResponseDto updatePlan(Long requestId, String plan) {
        TrainingRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found: " + requestId));
        request.setPlan(plan);
        TrainingRequest saved = requestRepository.save(request);
        return toResponseDto(saved);
    }

    private void createSchedulesForRequest(TrainingRequest request) {
        List<Instructor> instructors = new ArrayList<>();
        if (request.getIdentityInstructor() != null) instructors.add(request.getIdentityInstructor());
        if (request.getSecurityInstructor() != null) instructors.add(request.getSecurityInstructor());
        if (request.getCommunicationInstructor() != null) instructors.add(request.getCommunicationInstructor());

        instructors.stream()
                .map(Instructor::getId)
                .distinct()
                .forEach(instructorId -> {
                    Instructor inst = instructors.stream()
                            .filter(i -> i.getId().equals(instructorId))
                            .findFirst().orElseThrow();

                    InstructorSchedule schedule = new InstructorSchedule();
                    schedule.setInstructor(inst);
                    schedule.setScheduleDate(request.getRequestDate());
                    schedule.setEndDate(request.getRequestEndDate());
                    schedule.setDescription("교육 요청 #" + request.getId() + " (" + request.getFleet() + ")");
                    schedule.setSource("REQUEST");
                    schedule.setRequest(request);
                    scheduleRepository.save(schedule);
                });
    }

    private TrainingRequestResponseDto toResponseDto(TrainingRequest r) {
        Instructor ii = r.getIdentityInstructor();
        Instructor si = r.getSecurityInstructor();
        Instructor ci = r.getCommunicationInstructor();
        Venue sv = r.getSecondVenue();

        return new TrainingRequestResponseDto(
                r.getId(),
                r.getUser().getId(),
                r.getUser().getName(),
                r.getUser().getEmail(),
                ii != null ? ii.getId() : null,
                ii != null ? ii.getName() : null,
                ii != null ? ii.getRank() : null,
                si != null ? si.getId() : null,
                si != null ? si.getName() : null,
                si != null ? si.getRank() : null,
                ci != null ? ci.getId() : null,
                ci != null ? ci.getName() : null,
                ci != null ? ci.getRank() : null,
                r.getVenue().getId(),
                r.getVenue().getName(),
                r.getVenue().getRoomNumber(),
                sv != null ? sv.getId() : null,
                sv != null ? sv.getName() : null,
                sv != null ? sv.getRoomNumber() : null,
                r.getTrainingType(),
                r.getFleet(),
                r.getRequestDate(),
                r.getRequestEndDate(),
                r.getStartTime(),
                r.getStatus(),
                r.getNotes(),
                r.getPlan(),
                r.getCreatedAt()
        );
    }
}
