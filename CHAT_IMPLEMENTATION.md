# Realtime Chat System Implementation Guide

## Overview

This is a complete realtime chat system with notifications for Glory Shopping Bangladesh. It supports guest users, registered users, and admin support.

## Architecture

### Components

1. **ChatWindow** - Main chat interface for conversations
2. **ChatList** - Admin dashboard to view all chats
3. **NotificationCenter** - Real-time notifications dropdown
4. **FloatingChatWidget** - Guest chat widget for public site

### Server Actions (Backend Calls)

- **Chat Actions** - Start chat, send messages, fetch messages
- **Notification Actions** - Get notifications, mark as read

## Features

### Guest Support

- Start chat without login
- Receive messages via email notifications
- Chat history stored by email

### User Support

- Start chat as logged-in user
- Real-time message notifications
- Conversation history

### Admin Features

- View all active chats
- Search and filter conversations
- Send responses to users/guests
- Close resolved chats
- Real-time message updates

### Notifications

- Message received notifications
- Chat assignment notifications
- Chat closure notifications
- Unread message badges
- Mark as read functionality

## Setup Instructions

### 1. Frontend Integration

#### Add to Public Site (Guest Widget)

```tsx
// src/app/(publicLayout)/layout.tsx
import { FloatingChatWidget } from "@/components/modules/Chat/FloatingChatWidget";

export default function PublicLayout({ children }) {
  return (
    <>
      {children}
      <FloatingChatWidget displayName="Support Team" />
    </>
  );
}
```

#### Add to Admin Dashboard

```tsx
// src/app/(dashboardLayout)/admin/chat/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ChatList } from "@/components/modules/Chat/ChatList";
import { ChatWindow } from "@/components/modules/Chat/ChatWindow";
import { getAllChatsForAdmin } from "@/action/chat/chat.action";

export default function AdminChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setIsLoading(true);
    const response = await getAllChatsForAdmin();
    if (response.success) {
      setChats(response.data);
    }
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen">
      <ChatList
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        isLoading={isLoading}
      />
      {selectedChat && (
        <div className="lg:col-span-2">
          <ChatWindow chat={selectedChat} isAdmin={true} />
        </div>
      )}
    </div>
  );
}
```

#### Add Notifications to Header

```tsx
// src/components/modules/Dashboard/site-header.tsx
import { NotificationCenter } from "@/components/modules/Chat/NotificationCenter";
import { getUserNotifications } from "@/action/notification/notification.action";
import { useEffect, useState } from "react";

export function SiteHeader({ userInfo }: DashboardNavbarProps) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const response = await getUserNotifications();
    if (response.success) {
      setNotifications(response.data);
    }
  };

  return (
    <header>
      {/* ... existing header code ... */}
      <NotificationCenter
        notifications={notifications}
        onRefresh={fetchNotifications}
      />
    </header>
  );
}
```

### 2. Database Schema (Prisma)

Add these models to your `schema.prisma`:

```prisma
model Chat {
  id              String    @id @default(cuid())
  conversationId  String
  userId          String?
  user            User?     @relation(fields: [userId], references: [id])
  guestEmail      String?
  guestName       String?
  subject         String
  status          String    @default("OPEN") // OPEN, CLOSED, RESOLVED
  messages        Message[]
  notifications   Notification[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  lastMessage     Message?  @relation("LastMessage", fields: [lastMessageId], references: [id])
  lastMessageId   String?
  assignedAdminId String?
  assignedAdmin   User?     @relation("AssignedChats", fields: [assignedAdminId], references: [id])
  unreadCount     Int       @default(0)

  @@index([userId])
  @@index([guestEmail])
  @@index([status])
}

model Message {
  id              String    @id @default(cuid())
  content         String
  senderId        String
  senderType      String    // USER, ADMIN, GUEST
  senderName      String
  senderImage     String?
  chatId          String
  chat            Chat      @relation(fields: [chatId], references: [id], onDelete: Cascade)
  isLastMessage   Chat?     @relation("LastMessage")
  isEdited        Boolean   @default(false)
  editedAt        DateTime?
  createdAt       DateTime  @default(now())

  @@index([chatId])
  @@index([senderId])
}

model Notification {
  id        String    @id @default(cuid())
  type      String    // CHAT_MESSAGE, CHAT_ASSIGNED, CHAT_CLOSED, CHAT_RESOLVED
  title     String
  message   String
  userId    String?
  user      User?     @relation(fields: [userId], references: [id])
  isGuest   Boolean   @default(false)
  guestEmail String?
  isRead    Boolean   @default(false)
  chatId    String
  chat      Chat      @relation(fields: [chatId], references: [id], onDelete: Cascade)
  metadata  Json?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([userId])
  @@index([chatId])
  @@index([guestEmail])
}
```

### 3. Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Endpoints Expected

```
POST   /chats/start-guest           - Start chat as guest
POST   /chats/:chatId/send-guest    - Send message as guest
GET    /chats/:chatId/messages-guest - Get messages (guest)

POST   /chats/start-user            - Start chat as user
POST   /chats/:chatId/send-user     - Send message as user
GET    /chats/:chatId/messages-user - Get messages (user)

GET    /chats/admin/all-chats       - Get all chats (admin)
GET    /chats/admin/:chatId         - Get full conversation (admin)
POST   /chats/:chatId/send-admin    - Send admin reply
PATCH  /chats/:chatId/close         - Close chat (admin)

GET    /notifications/user          - Get user notifications
PATCH  /notifications/:id/read      - Mark as read
GET    /notifications/guest         - Get guest notifications
```

## Usage Examples

### Start Chat (Guest)

```typescript
const response = await startChatAsGuest({
  guestEmail: "user@example.com",
  guestName: "John Doe",
  subject: "Product inquiry",
});
```

### Send Message (User)

```typescript
const response = await sendMessageAsUser(chatId, "Hello, how can you help?");
```

### Get Notifications (User)

```typescript
const response = await getUserNotifications();
```

## Real-Time Updates (Future Enhancement)

To add real-time updates with WebSocket/Socket.io:

1. Install dependencies:

```bash
npm install socket.io-client
```

2. Create a Socket hook:

```typescript
// src/hooks/use-socket.ts
import { useEffect, useState } from "react";
import io from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return socket;
}
```

3. Use in components:

```typescript
const socket = useSocket();

useEffect(() => {
  if (!socket) return;

  socket.on("chat:message", (message) => {
    setMessages((prev) => [...prev, message]);
  });

  return () => socket.off("chat:message");
}, [socket]);
```

## Customization

### Styling

- All components use Tailwind CSS with the purple/pink theme
- Dark mode support included
- Modify colors in component class names

### Colors

- Primary: `from-purple-500 to-pink-500`
- Border: `border-purple-200 dark:border-purple-500/30`
- Background: `bg-purple-50 dark:bg-purple-900/20`

### Notifications

- Customize notification types in `INotification` interface
- Modify notification display in `NotificationCenter`

## Features Roadmap

- [ ] Typing indicators
- [ ] Read receipts
- [ ] File/image sharing
- [ ] Chat history export
- [ ] Chatbot integration
- [ ] Video/audio calls
- [ ] Translation support
- [ ] Sentiment analysis

## Troubleshooting

**Messages not showing?**

- Check API endpoints are correct
- Verify authentication tokens are being sent
- Check browser console for errors

**Notifications not appearing?**

- Ensure notifications are being fetched periodically
- Check notification data structure matches interface
- Verify user is authenticated for user notifications

**Chat widget not loading?**

- Ensure `FloatingChatWidget` is added to layout
- Check z-index of other elements
- Verify API base URL is correct

## Support

For issues or questions, please check the chat server implementation or contact the development team.
