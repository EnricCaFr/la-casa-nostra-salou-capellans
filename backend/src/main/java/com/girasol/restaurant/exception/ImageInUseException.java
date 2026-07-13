package com.girasol.restaurant.exception;

import java.util.List;

public class ImageInUseException extends RuntimeException {
    private final List<String> itemNames;

    public ImageInUseException(List<String> itemNames) {
        super("No puedes eliminar esta imagen porque esta siendo usada por " + itemNames.size() + " plato(s).");
        this.itemNames = itemNames;
    }

    public List<String> getItemNames() {
        return itemNames;
    }
}
