import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class CompleteDeliveryImage {
  @Prop({ required: true })
  _id: number;
  @Prop({ required: true, type: Buffer })
  bufferImage: Buffer;
}

export const CompleteDeliveryImageSchema = SchemaFactory.createForClass(
  CompleteDeliveryImage,
);
