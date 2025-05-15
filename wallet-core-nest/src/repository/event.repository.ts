import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import { ClientSession, Document, Model } from 'mongoose';

@Schema({ collection: 'events' })
export class EventModel extends Document {
  @Prop({ required: true })
  document: string;

  @Prop({ required: true })
  type: 'DEPOSIT' | 'PAYMENT'; // DEPOSIT - PAYMENT

  @Prop({ required: true })
  amount: number;

  // DEPOSIT Default true - PAYMENT Default false
  @Prop({ required: true, default: false })
  processed: boolean;

  @Prop({ required: false })
  code: string;

  @Prop({ required: false, type: Date })
  expiresAt: Date;

  @Prop({ required: true, type: Date })
  createdAt: Date;
}

export const EventModelSchema = SchemaFactory.createForClass(EventModel);

@Injectable()
export class EventRepository {
  constructor(@InjectModel(EventModel.name) private eventModel: Model<EventModel>) {}

  async createPaymentEvent(document: string, amount: number, session?: ClientSession): Promise<EventModel> {
    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    const expiresAt = moment().add(15, 'minutes').toDate();
    const event = new this.eventModel({
      document,
      amount,
      type: 'PAYMENT',
      createdAt: moment().toDate(),
      code,
      expiresAt,
      processed: false,
    });

    return event.save({ session });
  }

  async createDepositEvent(document: string, amount: number, session?: ClientSession): Promise<EventModel> {
    const event = new this.eventModel({
      document,
      amount,
      type: 'DEPOSIT',
      createdAt: moment().toDate(),
      processed: true,
    });

    return event.save({ session });
  }

  async updateEventStatus(id: string, processed: boolean, session?: ClientSession): Promise<EventModel | null> {
    return this.eventModel
      .findByIdAndUpdate(
        id,
        { processed: processed },
        { new: true, session }, // Return the updated document
      )
      .exec();
  }

  async getEventByDocument(document: string): Promise<EventModel | null> {
    return this.eventModel.findOne({ document }).exec();
  }

  async findEventById(id: string): Promise<EventModel | null> {
    return this.eventModel.findById(id).exec();
  }

  async getAllEventsByDocument(document: string): Promise<EventModel[]> {
    return this.eventModel.find({ document }).exec();
  }
}
