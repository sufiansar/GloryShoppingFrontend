# Guest Chat System Updates

## Overview

Updated the frontend chat system to fully support guest users with proper integration to backend APIs. Guests can now start conversations, send messages, and receive responses from admins.

## Changes Made

### 1. **chat.interface.ts** - Updated Type Definitions

- ✅ Added `guestId?: string | null` field to `IMessage` interface
- ✅ Added optional fields to `IMessage`: `type`, `url`, `isRead`
- ✅ Updated `IMessage.senderId` and `guestId` to be optional/nullable
- ✅ Updated `IMessage.senderName` to be `string | null`
- ✅ Added `guestId`, `user`, and `senderInfo` to `IChat` interface
- ✅ Made `userId`, `guestEmail`, `guestName` optional and nullable in `IChat`

### 2. **chat.action.ts** - Updated API Endpoints

Fixed all API endpoints to match backend specification:

- ✅ `/chat/start-guest` - Start guest chat (POST)
- ✅ `/chat/{chatId}/send-guest` - Send guest message (POST)
  - Body: `{ guestId, content }`
- ✅ `/chat/{chatId}/messages-guest?guestId={id}` - Get guest messages (GET)
- ✅ `/chat/admin/all-chats` - Get all chats for admin (GET)
- ✅ `/chat/admin/{chatId}` - Get full conversation (GET)
- ✅ `/chat/{chatId}/send-admin` - Send admin reply (POST)

**Updated Functions:**

- `sendMessageAsGuest(chatId, content, guestId)` - Now requires guestId
- `getChatMessagesAsGuest(chatId, guestId)` - Now includes guestId in query params
- `getAllChatsForAdmin(page, limit)` - Added pagination support

### 3. **ChatWindow.tsx** - Enhanced Guest Support

- ✅ Added guest detection: `isGuestChat = !!chat.guestId`
- ✅ Retrieve guestId from localStorage
- ✅ Updated message creation logic to handle guest, user, and admin types
- ✅ Enhanced optimistic message creation with proper sender type detection
- ✅ Added guest user badge to display
- ✅ Improved display name handling for admin view
- ✅ Added message type, url, and isRead fields support
- ✅ Better null/undefined handling for sender information

**Key Features:**

- Guest messages show with blue "Guest User" badge in admin view
- Proper sender type determination (GUEST/USER/ADMIN)
- Support for null senderName with fallback to "Guest" or "Admin"

### 4. **AdminChatList.tsx** - Guest User Display

- ✅ Added `getDisplayName(chat)` - Shows first 5 words of guest/user name
- ✅ Added `getDisplayIdentifier(chat)` - Shows email or guest ID preview
- ✅ Enhanced chat mapping to include all guest fields
- ✅ Added guest user badge next to names in list
- ✅ Improved filtering to work with display name and identifier
- ✅ Better handling of lastMessage display
- ✅ Updated socket sync to preserve guest information

**Chat List Display:**

- Guest name (first 5 words) with "Guest" badge
- Email or Guest ID identifier
- Last message preview
- Timestamp of last update
- Unread message count

### 5. **use-chat-socket.ts** - Socket Support for Guests

- ✅ Updated `sendMessage()` to include `guestId` in payload
- ✅ Added proper guestId detection for guest messages
- ✅ Message payload structure:
  ```javascript
  {
    chatId,
    content,
    senderType,
    guestId: (senderType === "GUEST" ? guestId : null),
    senderName,
    guestEmail
  }
  ```

## API Flow for Guest Users

### 1. Start Guest Chat

```
POST /chat/start-guest
Response: { chatId, guestId }
→ Store guestId in localStorage
```

### 2. Send Guest Message

```
POST /chat/{chatId}/send-guest
Body: { guestId, content }
Response: { message with senderType: "GUEST" }
```

### 3. Get Guest Messages

```
GET /chat/{chatId}/messages-guest?guestId={guestId}
Response: Array of messages
```

### 4. Admin Views All Chats

```
GET /chat/admin/all-chats?page=1&limit=10
Response: Chats with senderInfo showing guest details
```

### 5. Admin Sends Reply

```
POST /chat/{chatId}/send-admin
Body: { content }
Response: { message with senderType: "ADMIN" }
```

## Socket.io Events

**Guest User Authentication:**

```javascript
auth: {
  userId: user_id_or_null,
  guestId: guest_id_from_localStorage,
  role: "GUEST" (for guests)
}
```

**Send Message Event:**

- Guest sends with `senderType: "GUEST"` and includes `guestId`
- Admin sends with `senderType: "ADMIN"`
- User sends with `senderType: "USER"`

## Local Storage Keys

- `guestId` - Guest session identifier
- `guestName` - Guest display name
- `guestEmail` - Guest email address

## Testing Checklist

- [ ] Guest can start chat and receive chatId + guestId
- [ ] Guest messages appear in chat window
- [ ] Admin can see all chats with guest users listed first
- [ ] Guest users show with "Guest" badge
- [ ] Guest identifier shows first 5 words of name or email
- [ ] Admin can reply to guest messages
- [ ] Real-time socket updates work for guests
- [ ] Messages persist across page refreshes
- [ ] Guest chat displays properly without user session

## Notes

- Guest chats use `guestId` instead of `userId`
- All messages include `senderType` field to distinguish sender
- Admin can identify guest users by blue badge and senderInfo type
- Guest data is minimal (name, email, guestId) for privacy
