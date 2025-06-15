import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface PaymentDocument extends Document {
  _id: Types.ObjectId;
  orderId: string;
  amount: number;
  token: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true })
export class Payment {
  // @Prop({ type: Types.ObjectId, auto: true })
  // _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  orderId: string;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, required: true })
  token: string;


  @Prop({ type: String, default: 'pending' }) 
  status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
