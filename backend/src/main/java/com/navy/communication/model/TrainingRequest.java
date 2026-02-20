package com.navy.communication.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "training_requests")
public class TrainingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "identity_instructor_id")
    private Instructor identityInstructor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "security_instructor_id")
    private Instructor securityInstructor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "communication_instructor_id")
    private Instructor communicationInstructor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "second_venue_id")
    private Venue secondVenue;

    @Column(name = "training_type", nullable = false, length = 20)
    private String trainingType;

    @Column(nullable = false, length = 20)
    private String fleet;

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate;

    @Column(name = "request_end_date")
    private LocalDate requestEndDate;

    @Column(name = "start_time", length = 5)
    private String startTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(columnDefinition = "TEXT")
    private String plan;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public TrainingRequest() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Instructor getIdentityInstructor() { return identityInstructor; }
    public void setIdentityInstructor(Instructor identityInstructor) { this.identityInstructor = identityInstructor; }

    public Instructor getSecurityInstructor() { return securityInstructor; }
    public void setSecurityInstructor(Instructor securityInstructor) { this.securityInstructor = securityInstructor; }

    public Instructor getCommunicationInstructor() { return communicationInstructor; }
    public void setCommunicationInstructor(Instructor communicationInstructor) { this.communicationInstructor = communicationInstructor; }

    public Venue getVenue() { return venue; }
    public void setVenue(Venue venue) { this.venue = venue; }

    public Venue getSecondVenue() { return secondVenue; }
    public void setSecondVenue(Venue secondVenue) { this.secondVenue = secondVenue; }

    public String getTrainingType() { return trainingType; }
    public void setTrainingType(String trainingType) { this.trainingType = trainingType; }

    public String getFleet() { return fleet; }
    public void setFleet(String fleet) { this.fleet = fleet; }

    public LocalDate getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDate requestDate) { this.requestDate = requestDate; }

    public LocalDate getRequestEndDate() { return requestEndDate; }
    public void setRequestEndDate(LocalDate requestEndDate) { this.requestEndDate = requestEndDate; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
