package com.girasol.restaurant.controller;

import com.girasol.restaurant.dto.MediaAssetDto;
import com.girasol.restaurant.service.MediaAssetService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/media/images")
public class MediaAssetController {
    private final MediaAssetService mediaAssetService;

    @GetMapping
    public List<MediaAssetDto> images() {
        return mediaAssetService.findAll();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public MediaAssetDto upload(@RequestParam("file") MultipartFile file) {
        return mediaAssetService.upload(file);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        mediaAssetService.delete(id);
    }
}
