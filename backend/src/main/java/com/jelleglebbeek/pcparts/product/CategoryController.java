package com.jelleglebbeek.pcparts.product;

import com.jelleglebbeek.pcparts.product.entities.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/category")
public class CategoryController {

    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping()
    public Iterable<Category> getAllCategories() {
        return this.categoryService.findAll();
    }

    @GetMapping("/{id}")
    public Category getCategory(@PathVariable String id) {
        return this.categoryService.findOne(id);
    }

    @PostMapping()
    public Category createCategory(@RequestBody Category category) {
        return this.categoryService.create(category);
    }

    @PatchMapping("/{id}")
    public Category updateCategory(@PathVariable String id, @RequestBody Category category) {
        return this.categoryService.update(id, category);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable String id) {
        this.categoryService.delete(id);
    }

}
