# Chat System Architecture & Visual Guide

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      GLORY SHOPPING                          │
│                     Chat System v1.0                         │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┬─────────────────────┬──────────────────┐
│   USERS          │   SOCKET.IO SERVER  │   ADMIN PANEL    │
├──────────────────┼─────────────────────┼──────────────────┤
│ • Guest User     │ • Real-time Events  │ • Chat List      │
│ • Logged In User │ • Message Broadcast │ • Conversation   │
│ • Admin          │ • Typing Indicator  │ • Admin Replies  │
│                  │ • Presence          │ • Close Tickets  │
└──────────────────┴─────────────────────┴──────────────────┘

                    ↕ Socket.io Events ↕

┌──────────────────────────────────────────────────────────────┐
│              DATABASE (Prisma Models)                         │
├──────────────────────────────────────────────────────────────┤
│ • Chat {id, conversationId, subject, status, userId}         │
│ • Message {id, chatId, content, senderId, senderType}        │
│ • Notification {id, type, userId, chatId, isRead}           │
│ • User {id, email, role}                                     │
│ • GuestChat {id, email, name}                                │
└──────────────────────────────────────────────────────────────┘
```

## Component Flow

```
SecondaryNavbar (Chat Button)
    │
    ↓
/chat Page (Route)
    │
    ├─→ [Guest Mode] → FloatingChatWidget
    │                      │
    │                      ├─ Intro Form
    │                      └─ ChatWindow
    │
    └─→ [User Mode] → Chat Creation Form
                          │
                          ↓
                      ChatWindow (Socket.io)
                          │
                          ├─ Message Display
                          ├─ Real-time Input
                          ├─ Typing Indicators
                          └─ Connection Status
```

## Socket.io Event Flow

### Message Sending Flow

```
User Types Message
    ↓
ChatWindow Component
    ↓
handleSendMessage()
    ↓
[Socket Connected?]
    ├─ YES → emit('send-message')
    │          ↓
    │      Socket.io Server
    │          ↓
    │      broadcast to chat room
    │          ↓
    │      on('message-received')
    │          ↓
    │      Update all clients
    │
    └─ NO → sendMessageAsUser() [REST API]
             ↓
         API Endpoint
             ↓
         Database Save
             ↓
         Response with Message ID
```

### Typing Indicator Flow

```
User Starts Typing
    ↓
onInputChange() → startTyping()
    ↓
emit('typing', {chatId, userName})
    ↓
Socket Server broadcasts to room
    ↓
on('user-typing', (userName))
    ↓
Add to typingUsers array
    ↓
Render Typing UI (●●●)
    ↓
[1 second timeout] → stopTyping()
    ↓
emit('stop-typing')
    ↓
Remove from typingUsers array
```

## Real-Time Events Schema

### Client → Server Events

```
'join-chat'
├─ chatId: string
├─ userId?: string
└─ name: string

'send-message'
├─ chatId: string
├─ message: string
├─ senderType: 'USER' | 'ADMIN' | 'GUEST'
└─ senderName: string

'admin-reply'
├─ chatId: string
├─ message: string
└─ adminName: string

'typing'
├─ chatId: string
└─ userName: string

'stop-typing'
└─ chatId: string
```

### Server → Client Events

```
'message-received'
├─ id: string
├─ content: string
├─ senderId: string
├─ senderType: 'USER' | 'ADMIN' | 'GUEST'
├─ senderName: string
└─ createdAt: Date

'user-typing'
└─ userName: string

'user-stop-typing'
└─ userName: string

'new-message-admin'
├─ chatId: string
├─ message: IMessage
└─ senderName: string
```

## State Management

### ChatWindow State

```typescript
{
  messages: IMessage[]          // Combined Socket + REST
  input: string                 // Current input
  isLoading: boolean           // Sending state
  isTyping: boolean            // User is typing
  typingTimeoutRef: NodeJS.Timeout  // Timer
}
```

### useSocket Hook State

```typescript
{
  socket: Socket               // Socket.io instance
  isConnected: boolean         // Connection status
  messages: IMessage[]         // Received messages
  typingUsers: string[]        // Who's typing
}
```

### Chat Page State

```typescript
{
  activeChat: IChat | null; // Current conversation
  isCreatingChat: boolean; // Creation loading
  guestMode: boolean; // Guest vs user
  formData: {
    // Creation form
    name: string;
    email: string;
    subject: string;
    message: string;
  }
}
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                 CLIENT (Browser)                        │
│                                                         │
│  ┌────────────────────────────────────────────────────┐│
│  │           React Components                        ││
│  │  ┌────────────────────────────────────────────┐  ││
│  │  │ ChatWindow                                │  ││
│  │  │ ├─ Messages Display                       │  ││
│  │  │ ├─ Input Form                            │  ││
│  │  │ └─ Typing Indicators                     │  ││
│  │  └────────────────────────────────────────────┘  ││
│  │  ┌────────────────────────────────────────────┐  ││
│  │  │ Socket.io Hook (use-socket)               │  ││
│  │  │ ├─ Connect on mount                       │  ││
│  │  │ ├─ Join chat room                         │  ││
│  │  │ ├─ Listen for events                      │  ││
│  │  │ └─ Emit user actions                      │  ││
│  │  └────────────────────────────────────────────┘  ││
│  │  ┌────────────────────────────────────────────┐  ││
│  │  │ Server Actions (REST API)                 │  ││
│  │  │ ├─ startChatAsGuest/User                  │  ││
│  │  │ ├─ sendMessageAsUser                      │  ││
│  │  │ └─ getChatMessages                        │  ││
│  │  └────────────────────────────────────────────┘  ││
│  └────────────────────────────────────────────────────┘│
│         ↕                                  ↕           │
│    Socket.io                           Fetch/POST      │
│    (Real-time)                         (REST API)      │
│                                                         │
└─────────────────────────────────────────────────────────┘
         ↕                                    ↕
┌─────────────────────────────────────────────────────────┐
│             SERVER (Node.js/Backend)                    │
│                                                         │
│  ┌────────────────────────────────────────────────────┐│
│  │        Socket.io Server                           ││
│  │ ├─ Listen for client connections                 ││
│  │ ├─ Manage chat rooms                             ││
│  │ ├─ Broadcast messages                            ││
│  │ └─ Handle typing events                          ││
│  └────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────┐│
│  │        API Routes/Handlers                        ││
│  │ ├─ /api/chat/start                               ││
│  │ ├─ /api/chat/send-message                        ││
│  │ ├─ /api/chat/get-messages                        ││
│  │ └─ /api/notifications                            ││
│  └────────────────────────────────────────────────────┘│
│         ↕                                               │
│    Database Query                                      │
│    (Prisma ORM)                                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
         ↕
┌─────────────────────────────────────────────────────────┐
│            DATABASE (PostgreSQL/MySQL)                  │
│                                                         │
│  • Chat conversations                                  │
│  • Messages history                                    │
│  • User notifications                                  │
│  • Guest sessions                                      │
│  • Conversation metadata                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Authentication & Authorization

```
┌─────────────────────────────────────────────────────────┐
│              REQUEST FLOW                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Guest User] → No Auth Required                         │
│   ├─ Use name + email for identification               │
│   ├─ Store in GuestChat table                          │
│   └─ Send via FloatingChatWidget                       │
│                                                         │
│ [Logged In User] → NextAuth Session                     │
│   ├─ Verify session.user.id                            │
│   ├─ Store with userId in Chat table                   │
│   └─ Use ChatWindow component                          │
│                                                         │
│ [Admin User] → Admin Role Check                         │
│   ├─ Verify session.user.role === 'ADMIN'              │
│   ├─ Access all chats                                  │
│   └─ Send admin replies                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Fallback Mechanism

```
Socket.io Connection Attempt
    ↓
[Connected?]
    ├─ YES → Use Socket.io
    │         ├─ emit('send-message')
    │         ├─ on('message-received')
    │         └─ on('user-typing')
    │
    └─ NO → Use REST API Fallback
             ├─ sendMessageAsUser()
             ├─ getChatMessages()
             └─ Show warning to user
                 "Using standard connection"
```

## Performance Considerations

```
┌─────────────────────────────────────────────────────────┐
│ OPTIMIZATION STRATEGY                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Socket.io:                                              │
│ • Message batching (no debounce needed)                 │
│ • Auto-reconnect with exponential backoff               │
│ • Room-based broadcasting (only relevant users)         │
│ • Event compression                                     │
│                                                         │
│ React:                                                  │
│ • useCallback for event handlers                        │
│ • useState for component-level state                    │
│ • useRef for DOM references (scroll)                    │
│ • useEffect cleanup on unmount                          │
│                                                         │
│ UI/UX:                                                  │
│ • Virtualization for large message lists (future)       │
│ • Lazy loading of message history                       │
│ • CSS animations (GPU accelerated)                      │
│ • Image lazy loading in messages                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## File Organization

```
src/
│
├── app/(publicLayout)/
│   ├── chat/
│   │   └── page.tsx ..................... Main chat page
│   └── layout.tsx
│
├── components/
│   ├── modules/
│   │   ├── Chat/
│   │   │   ├── ChatWindow.tsx ........... Conversation UI
│   │   │   ├── ChatList.tsx ............ Admin list view
│   │   │   ├── FloatingChatWidget.tsx .. Guest entry point
│   │   │   └── NotificationCenter.tsx .. Notifications
│   │   │
│   │   └── Navbar/
│   │       └── SecondaryNavbar.tsx ..... Nav with chat button
│   │
│   └── ui/
│       ├── button.tsx .................. UI component
│       ├── input.tsx ................... UI component
│       ├── badge.tsx ................... UI component
│       └── ... other UI components
│
├── hooks/
│   └── use-socket.ts ................... Socket.io integration
│
├── action/
│   ├── chat/
│   │   └── chat.action.ts .............. Server actions
│   └── notification/
│       └── notification.action.ts ...... Notification actions
│
└── types/
    └── chat.interface.ts ............... TypeScript interfaces
```

## Key Statistics

| Metric                 | Value                             |
| ---------------------- | --------------------------------- |
| **Components**         | 4 main + 1 page                   |
| **Socket Events**      | 7 (3 emit, 4 listen)              |
| **Server Actions**     | 8 chat + 3 notification           |
| **Type Definitions**   | 4 interfaces                      |
| **Hooks**              | 2 (useSocket, useChatSocket)      |
| **Supported Users**    | Guests, Users, Admins             |
| **Real-time Features** | 5 (messages, typing, status, etc) |
| **Fallback Support**   | Yes (REST API)                    |
| **Dark Mode**          | Fully supported                   |
| **Mobile Responsive**  | Yes                               |
| **Performance**        | Optimized                         |

---

**Status**: ✅ Complete & Ready  
**Version**: 1.0.0  
**Architecture Type**: Real-time, Fallback-enabled, Multi-user
