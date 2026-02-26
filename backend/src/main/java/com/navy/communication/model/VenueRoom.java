package com.navy.communication.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "venue_rooms")
public class VenueRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "venue_id", nullable = false)
    private Long venueId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column
    private Integer capacity;

    @Column(name = "has_projector")
    private Boolean hasProjector;

    @Column(name = "has_microphone")
    private Boolean hasMicrophone;

    @Column(name = "has_whiteboard")
    private Boolean hasWhiteboard;

    @Column(name = "banner_size", length = 300)
    private String bannerSize;

    @Column(name = "podium_size", length = 300)
    private String podiumSize;

    @Column(name = "desk_layout", length = 300)
    private String deskLayout;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public VenueRoom() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getVenueId() { return venueId; }
    public void setVenueId(Long venueId) { this.venueId = venueId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Boolean getHasProjector() { return hasProjector; }
    public void setHasProjector(Boolean hasProjector) { this.hasProjector = hasProjector; }

    public Boolean getHasMicrophone() { return hasMicrophone; }
    public void setHasMicrophone(Boolean hasMicrophone) { this.hasMicrophone = hasMicrophone; }

    public Boolean getHasWhiteboard() { return hasWhiteboard; }
    public void setHasWhiteboard(Boolean hasWhiteboard) { this.hasWhiteboard = hasWhiteboard; }

    public String getBannerSize() { return bannerSize; }
    public void setBannerSize(String bannerSize) { this.bannerSize = bannerSize; }

    public String getPodiumSize() { return podiumSize; }
    public void setPodiumSize(String podiumSize) { this.podiumSize = podiumSize; }

    public String getDeskLayout() { return deskLayout; }
    public void setDeskLayout(String deskLayout) { this.deskLayout = deskLayout; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
