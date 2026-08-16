# Socket.io Chat — Frontend Integration Guide

This document covers everything the frontend needs to connect and use the GloryShopping real-time chat system.

---

## Connection Setup

### Registered User (JWT)
```ts
import { io, Socket } from "socket.io-client";

const socket: Socket = io("https://api.gloryshoppingbd.store", {
  auth: {
    token: localStorage.getItem("accessToken"), // JWT access token
  },
  withCredentials: true,
});
```

### Guest User (no account)
```ts
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

// Generate once and store in localStorage
const guestId = localStorage.getItem("guestId") || uuidv4();
localStorage.setItem("guestId", guestId);

// First call REST API to create the chat session, then connect
// POST /api/chats/start-guest → returns { chatId, guestId }

const socket: Socket = io("https://api.gloryshoppingbd.store", {
  auth: {
    guestId, // Pass guestId, NO token needed
  },
  withCredentials: true,
});
```

### Admin / Super Admin (JWT)
```ts
// Same as registered user — role is read from the JWT automatically
const socket: Socket = io("https://api.gloryshoppingbd.store", {
  auth: {
    token: localStorage.getItem("accessToken"),
  },
  withCredentials: true,
});
```

---

## Events Reference

### Events you EMIT (Frontend → Server)

| Event | Payload | Who can emit |
|---|---|---|
| `join-chat` | `{ chatId }` | Everyone |
| `leave-chat` | `{ chatId }` | Everyone |
| `send-message` | `{ chatId, content }` | User / Guest only |
| `admin-reply` | `{ chatId, content, adminName? }` | Admin only |
| `mark-read` | `{ chatId }` | Everyone |
| `typing` | `{ chatId, senderName? }` | Everyone |
| `stop-typing` | `{ chatId }` | Everyone |

### Events you LISTEN to (Server → Frontend)

| Event | Payload | Who receives |
|---|---|---|
| `message-received` | `ChatMessage` object | Everyone in `chat-{chatId}` room |
| `new-message-admin` | `{ chatId, message, senderType }` | Admins only |
| `messages-read` | `{ chatId, readBy }` | Both parties |
| `user-typing` | `{ chatId, senderName, userId }` | Admins only |
| `admin-typing` | `{ chatId, senderName }` | User/Guest in that chat |
| `user-stop-typing` | `{ chatId, userId }` | Admins only |
| `admin-stop-typing` | `{ chatId }` | User/Guest in that chat |
| `chat-reopened` | `{ chatId }` | Admins only |
| `notification` | Notification object | Target user directly |
| `user_online` | `{ userId }` | Everyone |
| `user_offline` | `{ userId }` | Everyone |
| `error` | `{ message }` | Sender only |

---

## REST API Endpoints (for fetching history)

> All messaging is done via Socket.io. REST API is only for **fetching** data (chat list, history, etc.)

### Guest
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chats/start-guest` | Start a new guest chat → returns `{ chatId, guestId }` |
| `GET` | `/api/chats/:chatId/messages-guest?guestId=xxx` | Get chat history |

### Registered User
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/chats/start-user` | ✅ | Start / resume user chat |
| `GET` | `/api/chats/user/messages/all` | ✅ | Get all messages in user's chat |
| `PATCH` | `/api/chats/:chatId/mark-read` | ✅ | Mark admin messages as read in DB |

### Admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/chats/admin/all-chats` | ✅ Admin | Paginated list of all chats |
| `GET` | `/api/chats/admin/unread-counts` | ✅ Admin | Unread badge counts per chat |
| `GET` | `/api/chats/admin/:chatId` | ✅ Admin | Full conversation with messages |
| `PATCH` | `/api/chats/admin/:chatId/mark-read` | ✅ Admin | Mark user messages as read in DB |
| `PATCH` | `/api/chats/:chatId/close` | ✅ Admin | Close a chat |

---

## Code Examples

### User Chat Page (React / Next.js)

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function UserChatPage({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token },
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      // Join the specific chat room
      socket.emit("join-chat", { chatId });
      // Mark all admin messages as read immediately
      socket.emit("mark-read", { chatId });
    });

    socket.on("message-received", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("admin-typing", () => setIsTyping(true));
    socket.on("admin-stop-typing", () => setIsTyping(false));

    socket.on("messages-read", ({ chatId: readChatId }) => {
      // Clear unread badge for this chat
      console.log("Messages read in chat:", readChatId);
    });

    socket.on("error", ({ message }) => {
      console.error("Socket error:", message);
    });

    return () => {
      socket.emit("leave-chat", { chatId });
      socket.disconnect();
    };
  }, [chatId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socketRef.current?.emit("send-message", { chatId, content: input.trim() });
    setInput("");
  };

  const handleTyping = () => {
    socketRef.current?.emit("typing", { chatId });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socketRef.current?.emit("stop-typing", { chatId });
    }, 1500);
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.senderType === "ADMIN" ? "admin" : "user"}>
            <strong>{msg.senderName}</strong>: {msg.content}
          </div>
        ))}
        {isTyping && <p>Admin is typing...</p>}
      </div>
      <input
        value={input}
        onChange={(e) => { setInput(e.target.value); handleTyping(); }}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
```

---

### Admin Chat Dashboard (React / Next.js)

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UnreadMap { [chatId: string]: number }

export default function AdminChatDashboard() {
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<UnreadMap>({});
  const [typingUsers, setTypingUsers] = useState<{ [chatId: string]: string }>({});
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token },
      withCredentials: true,
    });

    socketRef.current = socket;

    // Admin automatically joins admin_room on the server side

    // New message from any user — update sidebar
    socket.on("new-message-admin", ({ chatId, message }) => {
      setUnreadCounts((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] || 0) + 1,
      }));
    });

    // Message in the currently open chat
    socket.on("message-received", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // User typing in any chat — show badge in sidebar
    socket.on("user-typing", ({ chatId, senderName }) => {
      setTypingUsers((prev) => ({ ...prev, [chatId]: senderName }));
    });

    socket.on("user-stop-typing", ({ chatId }) => {
      setTypingUsers((prev) => { const n = { ...prev }; delete n[chatId]; return n; });
    });

    // A closed chat was reopened by the user
    socket.on("chat-reopened", ({ chatId }) => {
      console.log("Chat reopened:", chatId);
      // Refresh chat list
    });

    // Messages were read — clear badge
    socket.on("messages-read", ({ chatId }) => {
      setUnreadCounts((prev) => { const n = { ...prev }; delete n[chatId]; return n; });
    });

    return () => socket.disconnect();
  }, []);

  const openChat = (chatId: string, existingMessages: any[]) => {
    // Leave previous room
    if (activeChat) socketRef.current?.emit("leave-chat", { chatId: activeChat });

    setActiveChat(chatId);
    setMessages(existingMessages);

    // Join new chat room and mark as read
    socketRef.current?.emit("join-chat", { chatId });
    socketRef.current?.emit("mark-read", { chatId });

    // Clear unread badge
    setUnreadCounts((prev) => { const n = { ...prev }; delete n[chatId]; return n; });
  };

  const sendReply = (adminName: string) => {
    if (!input.trim() || !activeChat) return;
    socketRef.current?.emit("admin-reply", {
      chatId: activeChat,
      content: input.trim(),
      adminName,
    });
    setInput("");
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: 280 }}>
        {chats.map((chat) => (
          <div key={chat.id} onClick={() => openChat(chat.id, [])}>
            <span>{chat.senderInfo?.name || "Guest"}</span>
            {unreadCounts[chat.id] > 0 && (
              <span className="badge">{unreadCounts[chat.id]}</span>
            )}
            {typingUsers[chat.id] && (
              <small>{typingUsers[chat.id]} is typing...</small>
            )}
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div style={{ flex: 1 }}>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.senderName}</strong>: {msg.content}
          </div>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendReply("Admin")}
          placeholder="Type a reply..."
        />
        <button onClick={() => sendReply("Admin")}>Reply</button>
      </div>
    </div>
  );
}
```

---

## Notes

> [!IMPORTANT]
> - **Guest users** must call `POST /api/chats/start-guest` first to get a `chatId`, then connect the socket with the `guestId` from `localStorage`.
> - **Registered users** must call `POST /api/chats/start-user` first to get their `chatId`, then emit `join-chat`.
> - Always store `guestId` in `localStorage` — losing it means the guest loses access to their chat history.

> [!TIP]
> Call `GET /api/chats/admin/unread-counts` on the Admin Dashboard load to show initial unread badges before any socket events arrive. After that, the `new-message-admin` socket event keeps the badges updated in real-time.

> [!WARNING]
> Do NOT emit `admin-reply` from the User/Guest side. The server will silently block it (`if (!isAdmin) return`). Similarly, admins cannot use `send-message` — they must use `admin-reply`.
