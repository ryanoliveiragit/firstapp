import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  const corsOrigin = configService.get('CORS_ORIGIN') || 'http://localhost:1420';
  
  // Parse CORS origins - pode ser uma string única ou múltiplas separadas por vírgula
  const allowedOrigins = corsOrigin.includes(',') 
    ? corsOrigin.split(',').map(origin => origin.trim())
    : [corsOrigin];
  
  // Adiciona suporte para Tauri (permite requisições sem origem ou com origem null)
  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Permite requisições sem origem (como apps desktop Tauri)
      if (!origin) {
        return callback(null, true);
      }
      // Permite origens na lista
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      // Permite requisições do Tauri (tauri://localhost)
      if (origin.startsWith('tauri://')) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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

  await app.listen(port);
  console.log(`🚀 Backend rodando em http://localhost:${port}`);
  console.log(`📡 API disponível em http://localhost:${port}/api`);
  console.log(`🔐 Endpoint de validação: POST http://localhost:${port}/api/auth/validate`);
  console.log(`🌐 CORS configurado para: ${corsOrigin}`);
}

bootstrap();
