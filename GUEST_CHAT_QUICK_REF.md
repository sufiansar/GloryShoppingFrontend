# Guest Chat System - Quick Implementation Reference

## Files Modified (5 Total)

### 1. `/src/types/chat.interface.ts`

**Changes:** Added guestId, type, url, isRead fields to IMessage. Made fields optional in IChat for guest support.

### 2. `/src/action/chat/chat.action.ts`

**Changes:** Updated all API endpoints from `/chats/` to `/chat/` (removed 's'). Updated function signatures to match backend.

**Key Functions:**

```typescript
startChatAsGuest(); // No body needed
sendMessageAsGuest(chatId, content, guestId); // Requires guestId
getChatMessagesAsGuest(chatId, guestId); // guestId in query param
getAllChatsForAdmin(page, limit); // With pagination
getFullChatConversation(chatId); // Admin view
sendMessageAsAdmin(chatId, content); // Admin reply
```

### 3. `/src/components/modules/Chat/ChatWindow.tsx`

**Changes:** Added guest user detection, proper sender type handling, guest badge display, and localStorage integration.

**Key Logic:**

```typescript
const guestId = localStorage.getItem("guestId");
const isGuestChat = !!chat.guestId;
senderType = guestId ? "GUEST" : session?.user?.id ? "USER" : "GUEST";
```

### 4. `/src/components/modules/Chat/AdminChatList.tsx`

**Changes:** Added guest display helpers, improved chat list rendering with guest badges, better name/email handling.

**Display Functions:**

```typescript
getDisplayName(chat); // First 5 words of name
getDisplayIdentifier(chat); // Email or guest ID preview
```

### 5. `/src/hooks/use-chat-socket.ts`

**Changes:** Added guestId to message payload when senderType is "GUEST".

**Updated Payload:**

```typescript
const messagePayload = {
  chatId,
  content,
  senderType,
  guestId: senderType === "GUEST" ? guestId : null,
  senderName,
  guestEmail,
};
```

## Backend API Endpoints Summary

| Method | Endpoint                              | Purpose                                    |
| ------ | ------------------------------------- | ------------------------------------------ |
| POST   | `/chat/start-guest`                   | Start guest chat → returns chatId, guestId |
| POST   | `/chat/{id}/send-guest`               | Send guest message                         |
| GET    | `/chat/{id}/messages-guest?guestId=X` | Get guest messages                         |
| POST   | `/chat/{id}/send-admin`               | Send admin reply                           |
| GET    | `/chat/admin/all-chats`               | Get all chats for admin                    |
| GET    | `/chat/admin/{id}`                    | Get full conversation                      |

## Response Structure

### Guest Message Response

```json
{
  "id": "msg-id",
  "chatId": "chat-id",
  "guestId": "guest-id",
  "senderType": "GUEST",
  "senderName": null,
  "content": "message text",
  "type": "TEXT",
  "isRead": false,
  "createdAt": "2026-03-28T..."
}
```

### Admin Chat List Item

```json
{
  "id": "chat-id",
  "guestId": "guest-id",
  "status": "ACTIVE",
  "senderInfo": {
    "type": "GUEST",
    "name": "Guest Name",
    "email": "guest@email.com",
    "id": "guest-id"
  },
  "lastMessage": {...},
  "messages": [...]
}
```

## localStorage Keys

```
guestId    → Unique guest session ID
guestName  → Display name for guest
guestEmail → Email address for notifications
```

## Socket Authentication

```typescript
auth: {
  userId: user?.id,
  guestId: localStorage.getItem("guestId"),
  role: "GUEST" // or "USER" or "ADMIN"
}
```

## Testing Quick Commands

### Start Guest Chat

```bash
curl -X POST http://localhost:5000/api/v1/chat/start-guest
# Response: { chatId, guestId } → Save guestId to localStorage
```

### Send Guest Message

```bash
curl -X POST http://localhost:5000/api/v1/chat/{chatId}/send-guest \
  -H "Content-Type: application/json" \
  -d '{"guestId": "xxx", "content": "Hello"}'
```

### Get Guest Messages

```bash
curl "http://localhost:5000/api/v1/chat/{chatId}/messages-guest?guestId={guestId}"
```

### Admin Views All Chats

```bash
curl http://localhost:5000/api/v1/chat/admin/all-chats
```

### Admin Replies

```bash
curl -X POST http://localhost:5000/api/v1/chat/{chatId}/send-admin \
  -H "Content-Type: application/json" \
  -d '{"content": "Admin response"}'
```

## Common Issues & Solutions

| Issue                             | Solution                                                |
| --------------------------------- | ------------------------------------------------------- |
| guestId not found in localStorage | Save it from `/chat/start-guest` response immediately   |
| Messages not showing for guest    | Check guestId is in query params for GET messages-guest |
| Admin can't see guest chats       | Verify user has ADMIN role and proper auth token        |
| Socket connection fails           | Check guestId in auth payload, BASE_URL is correct      |
| Guest messages not updating       | Verify socket.io event names match backend              |

## Notes for Developers

- Always store guestId immediately after chat initiation
- Guest chats have `guestId` instead of `userId`
- Messages distinguish sender by `senderType` field
- Admin can identify guests by blue badge and senderInfo.type === "GUEST"
- First 5 words of name shown in admin list for brevity
- All null checks include fallbacks for display names
