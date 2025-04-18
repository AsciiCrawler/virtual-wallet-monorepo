import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { CreateUserDto } from 'src/v1/core/core.zod';

@Schema({ collection: 'users' })
export class UserModel extends Document {
  @Prop({ required: true, unique: true })
  document: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, default: 0 })
  balance: number;
}

export const UserModelSchema = SchemaFactory.createForClass(UserModel);

@Injectable()
export class UserRepository {
  constructor(@InjectModel(UserModel.name) private userModel: Model<UserModel>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserModel> {
    const createdUser = new this.userModel({
      ...createUserDto,
      balance: 0, // Initialize balance to 0
    });

    return createdUser.save();
  }

  async depositFunds(document: string, amount: number): Promise<{ newBalance: number }> {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }

    const updatedUser = await this.userModel.findOneAndUpdate(
      { document },
      { $inc: { balance: amount } },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return { newBalance: updatedUser.balance };
  }

  /* TODO : Refactor */
  async reduceBalance(document: string, amount: number): Promise<{ newBalance: number }> {
    if (amount <= 0) {
      throw new Error('Reduction amount must be positive');
    }

    const updatedUser = await this.userModel.findOneAndUpdate(
      { document },
      { $inc: { balance: -amount } }, // Subtract the amount
      { new: true },
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return { newBalance: updatedUser.balance };
  }

  async getBalance(document: string): Promise<number> {
    const user = await this.userModel.findOne({ document }).select('balance');
    if (!user) {
      throw new Error('User not found');
    }
    return user.balance;
  }

  async getUserByDocument(document: string): Promise<UserModel> {
    const user = await this.userModel.findOne({ document });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
