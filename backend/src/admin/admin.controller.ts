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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';

@ApiTags('admin')
@Controller('admin/keys')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly adminService: AdminService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nova chave de licença' })
  @ApiBody({ type: CreateKeyDto })
  @ApiResponse({ status: 201, description: 'Chave criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createKeyDto: CreateKeyDto) {
    this.logger.log('📝 Criando nova chave...');
    return this.adminService.createKey(createKeyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as chaves de licença' })
  @ApiResponse({ status: 200, description: 'Lista de chaves retornada com sucesso' })
  findAll() {
    this.logger.log('📋 Listando todas as chaves...');
    return this.adminService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar chave por ID' })
  @ApiParam({ name: 'id', description: 'ID da chave (UUID)' })
  @ApiResponse({ status: 200, description: 'Chave encontrada' })
  @ApiResponse({ status: 404, description: 'Chave não encontrada' })
  findOne(@Param('id') id: string) {
    this.logger.log(`🔍 Buscando chave por ID: ${id}`);
    return this.adminService.findOne(id);
  }

  @Get('key/:key')
  @ApiOperation({ summary: 'Buscar chave por valor da chave' })
  @ApiParam({ name: 'key', description: 'Valor da chave de licença' })
  @ApiResponse({ status: 200, description: 'Chave encontrada' })
  @ApiResponse({ status: 404, description: 'Chave não encontrada' })
  findByKey(@Param('key') key: string) {
    this.logger.log(`🔍 Buscando chave: ${key}`);
    return this.adminService.findByKey(key);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar chave de licença' })
  @ApiParam({ name: 'id', description: 'ID da chave (UUID)' })
  @ApiBody({ type: UpdateKeyDto })
  @ApiResponse({ status: 200, description: 'Chave atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Chave não encontrada' })
  update(@Param('id') id: string, @Body() updateKeyDto: UpdateKeyDto) {
    this.logger.log(`✏️ Atualizando chave: ${id}`);
    return this.adminService.update(id, updateKeyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deletar chave de licença' })
  @ApiParam({ name: 'id', description: 'ID da chave (UUID)' })
  @ApiResponse({ status: 200, description: 'Chave deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Chave não encontrada' })
  remove(@Param('id') id: string) {
    this.logger.log(`🗑️ Deletando chave: ${id}`);
    return this.adminService.remove(id);
  }

  @Post(':id/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resetar uso da chave de licença' })
  @ApiParam({ name: 'id', description: 'ID da chave (UUID)' })
  @ApiResponse({ status: 200, description: 'Uso da chave resetado com sucesso' })
  @ApiResponse({ status: 404, description: 'Chave não encontrada' })
  resetUsage(@Param('id') id: string) {
    this.logger.log(`🔄 Resetando uso da chave: ${id}`);
    return this.adminService.resetUsage(id);
  }
}
