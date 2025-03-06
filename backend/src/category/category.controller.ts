import { Controller, Post, Get, Delete, Param, Body, UseGuards  } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("category")
@UseGuards(AuthGuard)
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    async create(@Body("name") name: string) {
        return await this.categoryService.createCategory(name);
    }

    @Get()
    async findAll() {
        return await this.categoryService.getAllCategories();
    }

    @Delete(":id")
    async delete(@Param("id") id: number) {
        return await this.categoryService.deleteCategory(id);
    }
}
