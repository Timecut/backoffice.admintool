import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'production') {
    app.enableCors({
      ...corsConfig.cors
    });
  }
  await app.listen(process.env.PORT ?? 3000);
}

export const corsConfig = {
  cors: {
    origin: 'https://frontend-admintool.backoffice.mhub.se',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }
};


bootstrap();