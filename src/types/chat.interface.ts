export interface IMessage {
  id: string;
  content: string;
  senderId?: string | null;
  guestId?: string | null;
  senderType: "USER" | "ADMIN" | "GUEST";
  senderName: string | null;
  senderImage?: string;
  createdAt: Date;
  isEdited: boolean;
  editedAt?: Date;
  type?: "TEXT" | "IMAGE" | "FILE";
  url?: string | null;
  isRead?: boolean;
}

export interface IChat {
  id: string;
  conversationId?: string;
  userId?: string | null;
  guestId?: string | null;
  guestEmail?: string | null;
  guestName?: string | null;
  subject?: string;
  status: "ACTIVE" | "OPEN" | "CLOSED" | "RESOLVED";
  messages?: IMessage[];
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: IMessage;
  unreadCount?: number;
  assignedAdminId?: string;
  assignedAdminName?: string;
  user?: any | null;
  senderInfo?: {
    type: "GUEST" | "USER";
    name: string | null;
    email: string | null;
    id: string;
  };
}

export interface INotification {
  id: string;
  type: "CHAT_MESSAGE" | "CHAT_ASSIGNED" | "CHAT_CLOSED" | "CHAT_RESOLVED";
  title: string;
  message: string;
  userId?: string;
  isGuest: boolean;
  guestEmail?: string;
  isRead: boolean;
  chatId: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface IChatSession {
  chatId: string;
  conversationId: string;
  isGuest: boolean;
  userId?: string;
  guestEmail?: string;
}
