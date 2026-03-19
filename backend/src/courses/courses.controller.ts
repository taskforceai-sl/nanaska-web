import { Controller, Get, Param, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /** GET /courses – list all individual subjects */
  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  /** GET /courses/combinations?level=certificate – list combinations, optionally filtered */
  @Get('combinations')
  findCombinations(@Query('level') level?: string) {
    return this.coursesService.findCombinations(level);
  }

  /** GET /courses/combinations/:id – single combination */
  @Get('combinations/:id')
  findCombinationById(@Param('id') id: string) {
    return this.coursesService.findCombinationById(id);
  }

  /** GET /courses/:id – single subject */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }
}
