import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';

@Controller('admin/keys')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly adminService: AdminService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createKeyDto: CreateKeyDto) {
    this.logger.log('📝 Criando nova chave...');
    return this.adminService.createKey(createKeyDto);
  }

  @Get()
  findAll() {
    this.logger.log('📋 Listando todas as chaves...');
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`🔍 Buscando chave por ID: ${id}`);
    return this.adminService.findOne(id);
  }

  @Get('key/:key')
  findByKey(@Param('key') key: string) {
    this.logger.log(`🔍 Buscando chave: ${key}`);
    return this.adminService.findByKey(key);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKeyDto: UpdateKeyDto) {
    this.logger.log(`✏️ Atualizando chave: ${id}`);
    return this.adminService.update(id, updateKeyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    this.logger.log(`🗑️ Deletando chave: ${id}`);
    return this.adminService.remove(id);
  }

  @Post(':id/reset')
  @HttpCode(HttpStatus.OK)
  resetUsage(@Param('id') id: string) {
    this.logger.log(`🔄 Resetando uso da chave: ${id}`);
    return this.adminService.resetUsage(id);
  }
}
