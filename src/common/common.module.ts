import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from './middleware/logging/logging.middleware';

@Module({
  imports: [ConfigModule],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: 'coffees', method: RequestMethod.GET });
  }
}
