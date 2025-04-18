import { Module } from '@nestjs/common';
import { CoreController } from './v1/core/core.controller';
import { CoreService } from './v1/core/core.service';

@Module({
  imports: [],
  controllers: [CoreController],
  providers: [CoreService],
})
export class AppModule { }
