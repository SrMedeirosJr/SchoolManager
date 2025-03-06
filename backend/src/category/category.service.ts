import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) {}

    async createCategory(name: string): Promise<Category> {
        const category = this.categoryRepository.create({ name });
        return await this.categoryRepository.save(category);
    }

    async getAllCategories(): Promise<Category[]> {
        return await this.categoryRepository.find();
    }

    async deleteCategory(id: number): Promise<void> {
        await this.categoryRepository.delete(id);
    }
}
