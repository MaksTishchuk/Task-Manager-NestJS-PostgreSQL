import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger} from "@nestjs/common";

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  const PORT = Number(process.env.PORT) || 3000
  app.setGlobalPrefix('api')
  await app.listen(PORT);
  logger.log(`Application listening on PORT ${PORT}!`)
}
bootstrap();
