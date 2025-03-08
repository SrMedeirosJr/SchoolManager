import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ["https://school-manager-sand.vercel.app", "http://localhost:3001"], 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, 
  });

  await app.listen(3000);
}
bootstrap();
