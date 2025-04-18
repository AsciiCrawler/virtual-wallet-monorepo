import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import { Document, Model } from 'mongoose';

@Schema({ collection: 'payments' })
export class PaymentModel extends Document {
  @Prop({ required: true })
  document: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true, type: Date })
  expiresAt: Date;

  @Prop({ required: true, default: false })
  processed: boolean;
}

export const PaymentModelSchema = SchemaFactory.createForClass(PaymentModel);

@Injectable()
export class PaymentRepository {
  constructor(@InjectModel(PaymentModel.name) private paymentModel: Model<PaymentModel>) {}

  async createPayment(document: string, amount: number): Promise<PaymentModel> {
    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    const expiresAt = moment().add(15, 'minutes').toDate();
    const payment = new this.paymentModel({
      document,
      amount,
      code,
      expiresAt,
      processed: false,
    });

    return payment.save();
  }

  async updatePaymentStatus(id: string, processed: boolean): Promise<PaymentModel | null> {
    return this.paymentModel
      .findByIdAndUpdate(
        id,
        { processed: processed },
        { new: true }, // Return the updated document
      )
      .exec();
  }

  async getPaymentByDocument(document: string): Promise<PaymentModel | null> {
    return this.paymentModel.findOne({ document }).exec();
  }

  async findById(id: string): Promise<PaymentModel | null> {
    return this.paymentModel.findById(id).exec();
  }
}
