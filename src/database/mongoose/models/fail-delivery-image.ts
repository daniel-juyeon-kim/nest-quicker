import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class FailDeliveryImage {
  @Prop({ required: true })
  _id: number;
  @Prop({ type: Buffer, required: true })
  image: Buffer;
  @Prop({ required: true })
  reason: string;
}

export const FailDeliveryImageSchema =
  SchemaFactory.createForClass(FailDeliveryImage);
