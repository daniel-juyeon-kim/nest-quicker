import { ChatMessages, MessageInfo } from '../../models';

export interface IChatMessageRepository {
  saveMessage(orderId: number, messageInfo: MessageInfo): Promise<void>;
  findAllMessageByOrderId(orderId: number): Promise<ChatMessages>;
  findRecentMessageByOrderId(orderId: number): Promise<MessageInfo>;
}
