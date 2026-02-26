package com.navy.communication.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "instructors")
public class Instructor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String rank;

    @Column(nullable = false, length = 100)
    private String specialty;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(length = 100)
    private String affiliation;

    @Column(name = "education_topic", length = 200)
    private String educationTopic;

    @Column(name = "available_region", length = 200)
    private String availableRegion;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating;

    @Column(length = 20)
    private String recommendation;

    @Column(nullable = false, length = 20)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(columnDefinition = "TEXT")
    private String career;

    @Column(name = "one_line_review", columnDefinition = "TEXT")
    private String oneLineReview;

    @Column(columnDefinition = "TEXT")
    private String conditions;

    @Column(name = "delivery_score", precision = 3, scale = 2)
    private BigDecimal deliveryScore;

    @Column(name = "expertise_score", precision = 3, scale = 2)
    private BigDecimal expertiseScore;

    @Column(name = "interaction_score", precision = 3, scale = 2)
    private BigDecimal interactionScore;

    @Column(name = "time_management_score", precision = 3, scale = 2)
    private BigDecimal timeManagementScore;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(columnDefinition = "TEXT")
    private String weaknesses;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Instructor() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRank() { return rank; }
    public void setRank(String rank) { this.rank = rank; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAffiliation() { return affiliation; }
    public void setAffiliation(String affiliation) { this.affiliation = affiliation; }

    public String getEducationTopic() { return educationTopic; }
    public void setEducationTopic(String educationTopic) { this.educationTopic = educationTopic; }

    public String getAvailableRegion() { return availableRegion; }
    public void setAvailableRegion(String availableRegion) { this.availableRegion = availableRegion; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getCareer() { return career; }
    public void setCareer(String career) { this.career = career; }

    public String getOneLineReview() { return oneLineReview; }
    public void setOneLineReview(String oneLineReview) { this.oneLineReview = oneLineReview; }

    public String getConditions() { return conditions; }
    public void setConditions(String conditions) { this.conditions = conditions; }

    public BigDecimal getDeliveryScore() { return deliveryScore; }
    public void setDeliveryScore(BigDecimal deliveryScore) { this.deliveryScore = deliveryScore; }

    public BigDecimal getExpertiseScore() { return expertiseScore; }
    public void setExpertiseScore(BigDecimal expertiseScore) { this.expertiseScore = expertiseScore; }

    public BigDecimal getInteractionScore() { return interactionScore; }
    public void setInteractionScore(BigDecimal interactionScore) { this.interactionScore = interactionScore; }

    public BigDecimal getTimeManagementScore() { return timeManagementScore; }
    public void setTimeManagementScore(BigDecimal timeManagementScore) { this.timeManagementScore = timeManagementScore; }

    public String getStrengths() { return strengths; }
    public void setStrengths(String strengths) { this.strengths = strengths; }

    public String getWeaknesses() { return weaknesses; }
    public void setWeaknesses(String weaknesses) { this.weaknesses = weaknesses; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
