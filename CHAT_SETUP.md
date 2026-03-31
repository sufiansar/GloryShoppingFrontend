# Chat System - Quick Setup Guide

## What's New? 🎉

A complete real-time chat system with Socket.io integration is now ready to use!

### Components Added:

1. ✅ Chat button in navbar (with notification badge)
2. ✅ Chat page at `/chat` route
3. ✅ Real-time messaging with Socket.io
4. ✅ Guest & user support
5. ✅ Admin chat management
6. ✅ Typing indicators
7. ✅ Connection status monitoring

---

## Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

This will install `socket.io-client` which was added to `package.json`.

### Step 2: Configure Environment

Add to `.env.local`:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:YOUR_BACKEND_PORT
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Test Chat

1. Go to `http://localhost:3000/chat`
2. Or click the **Chat** button in navbar
3. Fill in form and start chatting!

---

## User Experiences

### 👤 Guest User

- Click Chat button → Floating widget appears
- Enter name & email → Start conversation
- Real-time messaging with support team
- No login required

### 👥 Registered User

- Click Chat button → Full chat interface
- Enter subject & message → Chat creates automatically
- See all previous conversations
- Real-time typing indicators

### 🛡️ Admin

- Access `/admin/chat` (when connected)
- View all customer conversations
- Real-time message notifications
- Send instant replies
- Close resolved tickets

---

## File Locations

| Feature          | File                                                  |
| ---------------- | ----------------------------------------------------- |
| Chat Button      | `/src/components/modules/Navbar/SecondaryNavbar.tsx`  |
| Chat Page        | `/src/app/(publicLayout)/chat/page.tsx`               |
| Socket.io Hook   | `/src/hooks/use-socket.ts`                            |
| Chat Window      | `/src/components/modules/Chat/ChatWindow.tsx`         |
| Guest Widget     | `/src/components/modules/Chat/FloatingChatWidget.tsx` |
| Chat Actions     | `/src/action/chat/chat.action.ts`                     |
| Type Definitions | `/src/types/chat.interface.ts`                        |

---

## Features Overview

### 🔌 Real-Time Events

- **join-chat** - User joins chat room
- **send-message** - Send message
- **admin-reply** - Admin responds
- **typing** - User is typing
- **stop-typing** - User stopped typing
- **message-received** - Receive new messages
- **user-typing** - See who's typing
- **new-message-admin** - Admin notification

### 💬 Message Features

- Real-time delivery with Socket.io
- Fallback to REST API if disconnected
- Typing indicators (●●●)
- Timestamps on messages
- User avatars with initials
- Message read status
- Chat status (OPEN, CLOSED, RESOLVED)

### 🎨 UI/UX

- Purple & pink gradient theme
- Dark mode support
- Mobile responsive
- Glassmorphic design
- Smooth animations
- Notification badges
- Connection status indicator

---

## Testing Socket.io

### In Development Console:

```javascript
// Check connection
console.log(socket.connected);

// Monitor events
socket.on("message-received", (msg) => {
  console.log("New message:", msg);
});

// Send test message
socket.emit("send-message", {
  chatId: "test-123",
  message: "Hello",
  senderName: "Test User",
});
```

---

## Common Tasks

### Show Unread Badge

```typescript
// In SecondaryNavbar.tsx
const [unreadCount, setUnreadCount] = useState(2);

// Update from state/context:
useEffect(() => {
  // Fetch unread count
  setUnreadCount(data.unreadCount);
}, []);
```

### Open Chat Programmatically

```typescript
import { useRouter } from "next/navigation";

const router = useRouter();
router.push("/chat?chat_id=123");
```

### Send Admin Message

```typescript
import { useChatSocket } from "@/hooks/use-socket";

const { sendAdminReply } = useChatSocket(chatId);
sendAdminReply("Thank you for your message!", "Admin Name");
```

### Show Typing Indicator

```typescript
const { startTyping, stopTyping } = useChatSocket(chatId);

// When user starts typing
startTyping("User Name");

// When user stops (auto with timeout)
stopTyping();
```

---

## Styling Colors

| Element    | Color  | Hex     |
| ---------- | ------ | ------- |
| Primary    | Purple | #ca428b |
| Secondary  | Pink   | #f59e0b |
| Active     | Green  | #22c55e |
| Pending    | Yellow | #eab308 |
| Error      | Red    | #ef4444 |
| Background | Slate  | #0f172a |

---

## Troubleshooting

### Chat button not showing?

- Clear browser cache
- Restart dev server
- Check SecondaryNavbar is imported in layout

### Messages not sending?

- Verify backend Socket.io is running
- Check `NEXT_PUBLIC_SOCKET_URL` is correct
- Look for errors in browser console
- Test API endpoint directly

### Typing indicators not working?

- Check socket connection is active (WiFi icon)
- Verify backend broadcasts typing events
- Test with multiple browser tabs
- Check event names match exactly

### Connection keeps dropping?

- Check network stability
- Increase reconnection timeout
- Verify CORS settings on backend
- Look for server errors

---

## Next Steps

1. **Connect to Backend**: Update Socket.io URL in `.env.local`
2. **Test Real-time**: Send messages between browser tabs
3. **Add Notifications**: Connect to notification system
4. **Admin Dashboard**: Link `/admin/chat` page
5. **Monitor**: Check server logs for Socket.io events

---

## API Reference

### Start Chat

```typescript
await startChatAsGuest({
  name: "John",
  email: "john@example.com",
  subject: "Help with order",
  initialMessage: "I need help...",
});
```

### Send Message

```typescript
await sendMessageAsUser(chatId, "My message");
```

### Get Chat Messages

```typescript
const messages = await getChatMessagesAsUser(chatId);
```

### Admin: Get All Chats

```typescript
const chats = await getAllChatsForAdmin();
```

### Admin: Send Reply

```typescript
await sendMessageAsAdmin(chatId, "We are here to help!");
```

---

## Performance Tips

- Socket.io messages are lightweight
- Auto-connects with exponential backoff
- Graceful degradation if Socket.io fails
- Message batching for high volume
- Efficient re-renders with React 19
- Optimized animations with CSS

---

## Security Notes

- Messages encrypted in transit (HTTPS/TLS)
- User validation on backend required
- Admin-only actions protected
- Rate limiting recommended
- Input sanitization on backend
- CORS properly configured

---

## Support

For detailed documentation, see:

- `SOCKET_IO_INTEGRATION.md` - Complete guide
- `CHAT_IMPLEMENTATION.md` - Original implementation

---

**Status**: ✅ Ready to Use  
**Version**: 1.0.0  
**Last Updated**: March 27, 2026
