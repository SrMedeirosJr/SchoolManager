import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildrenService } from './children.service';
import { ChildrenController } from './children.controller';
import { Child } from './child.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Child])],
  controllers: [ChildrenController],
  providers: [ChildrenService],
  exports: [ChildrenService],
})
export class ChildrenModule {}
