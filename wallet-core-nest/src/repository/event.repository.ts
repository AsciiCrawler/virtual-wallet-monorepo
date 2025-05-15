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

  @Prop({ required: true, type: Date, default: moment().toDate() })
  createdAt: Date;
}

export const EventModelSchema = SchemaFactory.createForClass(EventModel);

@Injectable()
export class EventRepository {
  constructor(@InjectModel(EventModel.name) private paymentModel: Model<EventModel>) {}

  async createPaymentEvent(document: string, amount: number, session?: ClientSession): Promise<EventModel> {
    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    const expiresAt = moment().add(15, 'minutes').toDate();
    const event = new this.paymentModel({
      document,
      amount,
      type: 'PAYMENT',

      code,
      expiresAt,
      processed: false,
    });

    return event.save({ session });
  }

  async createDepositEvent(document: string, amount: number, session?: ClientSession): Promise<EventModel> {
    const event = new this.paymentModel({
      document,
      amount,
      type: 'DEPOSIT',

      processed: true,
    });

    return event.save({ session });
  }

  async updateEventStatus(id: string, processed: boolean, session?: ClientSession): Promise<EventModel | null> {
    return this.paymentModel
      .findByIdAndUpdate(
        id,
        { processed: processed },
        { new: true, session }, // Return the updated document
      )
      .exec();
  }

  async getEventByDocument(document: string): Promise<EventModel | null> {
    return this.paymentModel.findOne({ document }).exec();
  }

  async findEventById(id: string): Promise<EventModel | null> {
    return this.paymentModel.findById(id).exec();
  }

  async getAllEventsByDocument(document: string): Promise<EventModel[]> {
    return this.paymentModel.find({ document }).exec();
  }
}
