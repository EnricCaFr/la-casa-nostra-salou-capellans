package com.girasol.restaurant.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "restaurant_info")
public class RestaurantInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String claim;

    @Column(columnDefinition = "text")
    private String description;

    private String address;
    private String phone;
    private String email;
    private String whatsapp;

    @Column(name = "opening_hours", columnDefinition = "text")
    private String openingHours;

    @Column(name = "instagram_url")
    private String instagramUrl;

    @Column(name = "google_maps_url", columnDefinition = "text")
    private String googleMapsUrl;
}
