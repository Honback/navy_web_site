package com.navy.communication.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "venues")
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 200)
    private String address;

    @Column(length = 100)
    private String building;

    @Column(name = "room_number", length = 50)
    private String roomNumber;

    @Column(nullable = false)
    private Integer capacity;

    @Column(length = 50)
    private String region;

    @Column(name = "lecture_capacity")
    private Integer lectureCapacity;

    @Column(name = "accommodation_capacity")
    private Integer accommodationCapacity;

    @Column(name = "meal_cost", length = 100)
    private String mealCost;

    @Column(name = "overall_rating", length = 20)
    private String overallRating;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(length = 500)
    private String website;

    @Column(name = "reservation_contact", length = 300)
    private String reservationContact;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "lecture_rooms", columnDefinition = "TEXT")
    private String lectureRooms;

    @Column(name = "usage_fee", columnDefinition = "TEXT")
    private String usageFee;

    @Column(name = "banner_size", length = 300)
    private String bannerSize;

    @Column(name = "desk_layout", length = 300)
    private String deskLayout;

    @Column(name = "room_status", columnDefinition = "TEXT")
    private String roomStatus;

    @Column(name = "room_amenities", columnDefinition = "TEXT")
    private String roomAmenities;

    @Column(name = "personal_items", columnDefinition = "TEXT")
    private String personalItems;

    @Column(name = "convenience_facilities", columnDefinition = "TEXT")
    private String convenienceFacilities;

    @Column(name = "restaurant_contact", length = 300)
    private String restaurantContact;

    @Column(name = "reservation_rules", columnDefinition = "TEXT")
    private String reservationRules;

    @Column(name = "important_tips", columnDefinition = "TEXT")
    private String importantTips;

    @Column(name = "sub_facilities", columnDefinition = "TEXT")
    private String subFacilities;

    @Column(columnDefinition = "TEXT")
    private String evaluation;

    @Column(name = "survey_images", length = 500)
    private String surveyImages;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Venue() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public Integer getLectureCapacity() { return lectureCapacity; }
    public void setLectureCapacity(Integer lectureCapacity) { this.lectureCapacity = lectureCapacity; }

    public Integer getAccommodationCapacity() { return accommodationCapacity; }
    public void setAccommodationCapacity(Integer accommodationCapacity) { this.accommodationCapacity = accommodationCapacity; }

    public String getMealCost() { return mealCost; }
    public void setMealCost(String mealCost) { this.mealCost = mealCost; }

    public String getOverallRating() { return overallRating; }
    public void setOverallRating(String overallRating) { this.overallRating = overallRating; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getReservationContact() { return reservationContact; }
    public void setReservationContact(String reservationContact) { this.reservationContact = reservationContact; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getLectureRooms() { return lectureRooms; }
    public void setLectureRooms(String lectureRooms) { this.lectureRooms = lectureRooms; }

    public String getUsageFee() { return usageFee; }
    public void setUsageFee(String usageFee) { this.usageFee = usageFee; }

    public String getBannerSize() { return bannerSize; }
    public void setBannerSize(String bannerSize) { this.bannerSize = bannerSize; }

    public String getDeskLayout() { return deskLayout; }
    public void setDeskLayout(String deskLayout) { this.deskLayout = deskLayout; }

    public String getRoomStatus() { return roomStatus; }
    public void setRoomStatus(String roomStatus) { this.roomStatus = roomStatus; }

    public String getRoomAmenities() { return roomAmenities; }
    public void setRoomAmenities(String roomAmenities) { this.roomAmenities = roomAmenities; }

    public String getPersonalItems() { return personalItems; }
    public void setPersonalItems(String personalItems) { this.personalItems = personalItems; }

    public String getConvenienceFacilities() { return convenienceFacilities; }
    public void setConvenienceFacilities(String convenienceFacilities) { this.convenienceFacilities = convenienceFacilities; }

    public String getRestaurantContact() { return restaurantContact; }
    public void setRestaurantContact(String restaurantContact) { this.restaurantContact = restaurantContact; }

    public String getReservationRules() { return reservationRules; }
    public void setReservationRules(String reservationRules) { this.reservationRules = reservationRules; }

    public String getImportantTips() { return importantTips; }
    public void setImportantTips(String importantTips) { this.importantTips = importantTips; }

    public String getSubFacilities() { return subFacilities; }
    public void setSubFacilities(String subFacilities) { this.subFacilities = subFacilities; }

    public String getEvaluation() { return evaluation; }
    public void setEvaluation(String evaluation) { this.evaluation = evaluation; }

    public String getSurveyImages() { return surveyImages; }
    public void setSurveyImages(String surveyImages) { this.surveyImages = surveyImages; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
