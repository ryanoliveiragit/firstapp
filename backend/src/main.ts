import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  
  // CORS totalmente liberado para permitir apps desktop (Tauri, Wails, etc.)
  // Permite todas as origens, incluindo requisições sem origem (apps desktop)
  const corsOptions = {
    origin: true, // Permite todas as origens
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24 horas
  };

  // Enable CORS
  app.enableCors(corsOptions);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger/OpenAPI Configuration
  const config = new DocumentBuilder()
    .setTitle('FirstApp API')
    .setDescription('API de autenticação e gerenciamento de chaves de licença')
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticação e validação de chaves')
    .addTag('admin', 'Endpoints administrativos para gerenciamento de chaves')
    .addServer(`http://localhost:${port}`, 'Servidor de desenvolvimento')
    .addServer('https://firstapp-3y74.onrender.com', 'Servidor de produção')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'FirstApp API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(port);
  console.log(`🚀 Backend rodando em http://localhost:${port}`);
  console.log(`📡 API disponível em http://localhost:${port}/api`);
  console.log(`📚 Documentação Swagger: http://localhost:${port}/api/docs`);
  console.log(`🔐 Endpoint de validação: POST http://localhost:${port}/api/auth/validate`);
  console.log(`🌐 CORS: Totalmente liberado (permite todas as origens, incluindo apps desktop)`);
}

bootstrap();
