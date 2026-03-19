import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const combo = await this.prisma.courseCombination.findUnique({
      where: { id: dto.combinationId },
    });
    if (!combo) throw new NotFoundException(`Combination ${dto.combinationId} not found`);

    return this.prisma.order.create({
      data: {
        userId: dto.userId,
        combinationId: dto.combinationId,
        amount: combo.price,
        status: 'PENDING',
      },
      include: { combination: { include: { items: { include: { course: true } } } } },
    });
  }

  async findOne(id: string, requestingUserId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        combination: { include: { items: { include: { course: true } } } },
        userCourses: true,
      },
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    if (order.userId !== requestingUserId) throw new ForbiddenException();
    return order;
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        combination: { include: { items: { include: { course: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
