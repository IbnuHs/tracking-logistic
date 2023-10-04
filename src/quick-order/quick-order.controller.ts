import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QuickOrderService } from './quick-order.service';
import { CreateQuickOrderDto } from './dto/create-quick-order.dto';
import { UpdateQuickOrderDto } from './dto/update-quick-order.dto';

@Controller('quick-order')
export class QuickOrderController {
  constructor(private readonly quickOrderService: QuickOrderService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createQuickOrderDto: CreateQuickOrderDto) {
    return this.quickOrderService.createQuickOrder(createQuickOrderDto);
  }

  @Get()
  findAll() {
    return this.quickOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quickOrderService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuickOrderDto: UpdateQuickOrderDto,
  ) {
    return this.quickOrderService.update(+id, updateQuickOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quickOrderService.remove(+id);
  }
}
