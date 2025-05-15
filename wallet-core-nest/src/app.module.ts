import { Module } from '@nestjs/common';
import { CoreController } from './v1/core/core.controller';
import { CoreService } from './v1/core/core.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModel, UserModelSchema, UserRepository } from './repository/user.repository';
import { EventModel, EventModelSchema, EventRepository } from './repository/event.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING || ''),
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserModelSchema },
      { name: EventModel.name, schema: EventModelSchema },
    ]),
  ],
  controllers: [CoreController],
  providers: [CoreService, UserRepository, EventRepository],
})
export class AppModule {}
