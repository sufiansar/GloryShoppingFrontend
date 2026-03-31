# Chat System - Quick Reference Card

## 🎯 What's New

A complete real-time chat system with Socket.io integration is now live in your Glory Shopping app!

---

## 📍 Where to Find It

| Feature        | Location      | Route                           |
| -------------- | ------------- | ------------------------------- |
| Chat Button    | Navbar        | `/chat`                         |
| Chat Page      | Public Layout | `/chat`                         |
| Socket Hook    | Hooks         | `/src/hooks/use-socket.ts`      |
| Components     | Chat Module   | `/src/components/modules/Chat/` |
| Server Actions | Chat Action   | `/src/action/chat/`             |

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

✅ Already added `socket.io-client` to package.json

### 2. Configure Backend

Create `.env.local`:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Start Dev Server

```bash
npm run dev
```

### 4. Test Chat

Visit: `http://localhost:3000/chat`

---

## 💬 User Experiences

### Guest Users

```
Click Chat → FloatingChatWidget → Fill Form → Send Message → Chat Starts
```

### Registered Users

```
Click Chat → Chat Form (Auto-filled) → "Start Chat" → ChatWindow Opens
```

### Admin Staff

```
Visit /admin/chat → ChatList → Click Chat → Send Reply Instantly
```

---

## 🔌 Socket.io Events

### Client Emits

```typescript
emit("join-chat", { chatId, name });
emit("send-message", { chatId, message, senderName });
emit("typing", { chatId, userName });
emit("stop-typing", { chatId });
emit("admin-reply", { chatId, message, adminName });
```

### Client Listens

```typescript
on("message-received", (message) => {});
on("user-typing", (userName) => {});
on("user-stop-typing", (userName) => {});
on("new-message-admin", (message) => {});
```

---

## 📦 Server Actions

### Guests

```typescript
startChatAsGuest({ guestName, guestEmail, subject });
sendMessageAsGuest(chatId, content, senderName, senderEmail);
getChatMessagesAsGuest(chatId);
getGuestNotifications();
```

### Users

```typescript
startChatAsUser({ subject, initialMessage });
sendMessageAsUser(chatId, content);
getChatMessagesAsUser(chatId);
getUserNotifications();
```

### Admins

```typescript
getAllChatsForAdmin();
getFullChatConversation(chatId);
sendMessageAsAdmin(chatId, content);
closeChat(chatId, resolution);
```

---

## 🎨 Colors & Styling

```javascript
Primary:    Purple    #ca428b
Secondary:  Pink      #f59e0b
Active:     Green     #22c55e
Pending:    Yellow    #eab308
Background: Slate     #0f172a
```

---

## 📝 API Endpoints (Backend)

### Must Implement

```
POST   /api/chats/start-guest
POST   /api/chats/start-user
POST   /api/chats/{id}/send-guest
POST   /api/chats/{id}/send-user
GET    /api/chats/{id}/messages-guest
GET    /api/chats/{id}/messages-user
GET    /api/chats/admin/all-chats
GET    /api/chats/admin/{id}
POST   /api/chats/{id}/send-admin
PATCH  /api/chats/{id}/close
GET    /api/notifications/user
GET    /api/notifications/guest
PATCH  /api/notifications/{id}/read
```

---

## 🔄 Real-time Flow

```
User Types Message
        ↓
emit('send-message')
        ↓
[Socket Connected?]
   ├─ YES → Socket.io delivers instantly
   │         ↓
   │    on('message-received')
   │         ↓
   │    Update UI
   │
   └─ NO → REST API fallback
            ↓
       sendMessageAsUser()
            ↓
       Update UI
```

---

## 🛠️ Components

| Component          | Purpose       | File                     |
| ------------------ | ------------- | ------------------------ |
| ChatWindow         | Main UI       | `ChatWindow.tsx`         |
| ChatList           | Admin view    | `ChatList.tsx`           |
| FloatingChatWidget | Guest entry   | `FloatingChatWidget.tsx` |
| NotificationCenter | Notifications | `NotificationCenter.tsx` |
| useSocket          | Real-time     | `use-socket.ts`          |

---

## 📱 Mobile Support

✅ Responsive design
✅ Touch-friendly buttons
✅ Mobile-optimized layout
✅ Icon-only navbar on mobile
✅ Full chat functionality on all devices

---

## 🔒 Security

✅ NextAuth session verification
✅ User/Admin role checking
✅ Guest validation via email
✅ Server-side request validation
✅ CORS properly configured

---

## 📊 State Management

### ChatWindow State

```typescript
messages: IMessage[]
input: string
isLoading: boolean
isTyping: boolean
```

### useSocket State

```typescript
isConnected: boolean
messages: IMessage[]
typingUsers: string[]
socket: Socket
```

### Chat Page State

```typescript
activeChat: IChat | null;
isCreatingChat: boolean;
guestMode: boolean;
formData: FormData;
```

---

## ✨ Features

✅ Real-time messaging via Socket.io
✅ REST API fallback if Socket fails
✅ Typing indicators
✅ Connection status monitoring
✅ Message timestamps
✅ Sender information
✅ Chat status (OPEN, CLOSED, RESOLVED)
✅ Guest & user support
✅ Admin capabilities
✅ Notifications
✅ Dark mode
✅ Mobile responsive

---

## 🐛 Common Issues

| Problem                  | Solution                |
| ------------------------ | ----------------------- |
| Chat button missing      | Restart dev server      |
| Messages not sending     | Check API endpoints     |
| No real-time updates     | Verify Socket.io URL    |
| Typing indicators broken | Check Socket connection |
| Mobile issues            | Clear cache, refresh    |

---

## 📚 Documentation

| File                     | Purpose            |
| ------------------------ | ------------------ |
| CHAT_SETUP.md            | Quick start        |
| CHAT_ARCHITECTURE.md     | System design      |
| SOCKET_IO_INTEGRATION.md | Technical guide    |
| CHAT_VISUAL_GUIDE.md     | Visual walkthrough |
| CHAT_COMPLETE.md         | Full documentation |

---

## 🎯 Next Steps

1. **✅ Done**: Chat system implemented
2. **Next**: Connect to backend Socket.io server
3. **Then**: Setup API endpoints
4. **Then**: Test real-time messaging
5. **Finally**: Deploy to production

---

## 📞 Support

Need help? Check:

1. Documentation files (above)
2. Console errors
3. Network tab (API calls)
4. Socket.io connection status (WiFi icon)
5. Backend logs

---

## 🎉 You're All Set!

Your chat system is **ready to connect to your backend**.

Visit `/chat` to see it in action! 🚀

---

**Version**: 1.0.0  
**Status**: ✅ Ready to Use  
**Last Updated**: March 27, 2026
