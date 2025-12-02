
// src/services/firestore.ts
import type { Timestamp } from 'firebase/firestore';
import type { User as FirebaseAuthUser } from 'firebase/auth';
import type { ChatItemProps } from '@/components/chat/chat-item';
import type { UserProfile as AuthUserProfileType } from '@/context/auth-context'; // Renamed to avoid conflict

export const BOT_UID = 'blue-bird-bot';
export const DEV_UID = 'vip-dev'; 

// Use the interface from auth-context directly to ensure consistency
export type UserProfile = AuthUserProfileType;


let mockLocalUsers: UserProfile[] = [
  { uid: BOT_UID, name: 'Blue Bird', email: 'bot@example.com', isBot: true, isVerified: true, avatarUrl: 'blue-bird-icon-placeholder', createdAt: { seconds: Date.now()/1000, nanoseconds: 0} as unknown as Timestamp, lastSeen: { seconds: Math.floor(Date.now()/1000) - 60*60*24, nanoseconds: 0} as unknown as Timestamp}, // Bot seen a day ago
  { uid: DEV_UID, name: 'Dev Team', email: 'devteam@example.com', isDevTeam: true, isVerified: true, avatarUrl: 'dev-team-svg-placeholder', createdAt: { seconds: Date.now()/1000, nanoseconds: 0} as unknown as Timestamp, lastSeen: { seconds: Math.floor(Date.now()/1000) - 2 * 60, nanoseconds: 0} as unknown as Timestamp }, // Dev team active
  { uid: 'verified-contact-1', name: 'Twaha', email: 'twaha@example.com', isVerified: true, isVIP: true, vipPack: 'Gold VIP', vipExpiryTimestamp: Date.now() + 30 * 24 * 60 * 60 * 1000, avatarUrl: 'https://picsum.photos/seed/twaha/200', createdAt: { seconds: Date.now()/1000, nanoseconds: 0} as unknown as Timestamp, lastSeen: { seconds: Math.floor(Date.now()/1000) - 1 * 60, nanoseconds: 0} as unknown as Timestamp }, // Twaha active
  { uid: 'verified-contact-2', name: 'Rakib', email: 'rakib@example.com', isVerified: true, isVIP: false, avatarUrl: 'https://picsum.photos/seed/rakib/200', createdAt: { seconds: Date.now()/1000, nanoseconds: 0} as unknown as Timestamp, lastSeen: { seconds: Math.floor(Date.now()/1000) - 10 * 60, nanoseconds: 0} as unknown as Timestamp }, // Rakib 10 mins ago
  { uid: 'regular-user-1', name: 'Ashadul', email: 'ashadul@example.com', avatarUrl: 'https://picsum.photos/seed/ashadul/200', createdAt: { seconds: Date.now()/1000, nanoseconds: 0} as unknown as Timestamp, lastSeen: { seconds: Math.floor(Date.now()/1000) - 30 * 60, nanoseconds: 0} as unknown as Timestamp },
  { uid: 'test-user', name: 'Test User', email: 'test@example.com', isVIP: false, isVerified: true, avatarUrl: 'https://picsum.photos/seed/test/200', createdAt: { seconds: Date.now()/1000, nanoseconds: 0} as unknown as Timestamp, lastSeen: { seconds: Math.floor(Date.now()/1000), nanoseconds: 0} as unknown as Timestamp }, // Test user currently active and verified
  { uid: 'monk-user-1', name: 'Peaceful Monk', email: 'monk1@example.com', avatarUrl: 'https://picsum.photos/seed/monk1/200', createdAt: { seconds: Date.now()/1000, nanoseconds: 0} as unknown as Timestamp, lastSeen: { seconds: Math.floor(Date.now()/1000) - 60*60*2, nanoseconds: 0} as unknown as Timestamp },
  { uid: 'monk-user-2', name: 'Zen Master', email: 'monk2@example.com', avatarUrl: 'https://picsum.photos/seed/monk2/200', createdAt: { seconds: Date.now()/1000, nanoseconds: 0} as unknown as Timestamp, lastSeen: { seconds: Math.floor(Date.now()/1000) - 60*60*3, nanoseconds: 0} as unknown as Timestamp },
  { uid: 'monk-user-3', name: 'Silent Thinker', email: 'monk3@example.com', avatarUrl: 'https://picsum.photos/seed/monk3/200', createdAt: { seconds: Date.now()/1000, nanoseconds: 0} as unknown as Timestamp, lastSeen: { seconds: Math.floor(Date.now()/1000) - 60*60*4, nanoseconds: 0} as unknown as Timestamp },
  { uid: 'monk-user-4', name: 'Meditative Soul', email: 'monk4@example.com', avatarUrl: 'https://picsum.photos/seed/monk4/200', createdAt: { seconds: Date.now()/1000, nanoseconds: 0} as unknown as Timestamp, lastSeen: { seconds: Math.floor(Date.now()/1000) - 60*60*5, nanoseconds: 0} as unknown as Timestamp },
  { uid: 'verified-contact-3', name: 'Asad', email: 'asad@example.com', isVerified: true, avatarUrl: 'https://picsum.photos/seed/asad/200', createdAt: { seconds: Date.now()/1000, nanoseconds: 0} as unknown as Timestamp, lastSeen: { seconds: Math.floor(Date.now()/1000) - 4 * 60, nanoseconds: 0} as unknown as Timestamp }, // Asad active
  { uid: 'verified-contact-4', name: 'Saidul', email: 'saidul@example.com', isVerified: true, avatarUrl: 'https://picsum.photos/seed/saidul/200', createdAt: { seconds: Date.now()/1000, nanoseconds: 0} as unknown as Timestamp, lastSeen: { seconds: Math.floor(Date.now()/1000) - 15 * 60, nanoseconds: 0} as unknown as Timestamp },
  { uid: 'vip-user-2', name: 'Maria Oishee', email: 'maria@example.com', isVIP: true, vipPack: 'Silver VIP', isVerified: true, avatarUrl: 'https://picsum.photos/seed/maria/200', createdAt: { seconds: Date.now()/1000, nanoseconds: 0} as unknown as Timestamp, vipExpiryTimestamp: Date.now() + 20 * 24 * 60 * 60 * 1000, lastSeen: { seconds: Math.floor(Date.now()/1000) - 1 * 60, nanoseconds: 0} as unknown as Timestamp }, // Maria active
  { uid: 'vip-user-3', name: 'Rafi', email: 'rafi@example.com', isVIP: true, vipPack: 'Gold VIP', isVerified: true, avatarUrl: 'https://picsum.photos/seed/rafi/200', createdAt: { seconds: Date.now()/1000, nanoseconds: 0} as unknown as Timestamp, vipExpiryTimestamp: Date.now() + 40 * 24 * 60 * 60 * 1000, lastSeen: { seconds: Math.floor(Date.now()/1000) - 25 * 60, nanoseconds: 0} as unknown as Timestamp },
  { uid: 'vip-only-user', name: 'Valerie IP.', email: 'valerie@example.com', isVIP: true, vipPack: 'Bronze VIP', isVerified: false, avatarUrl: 'https://picsum.photos/seed/valerie/200', createdAt: { seconds: Date.now()/1000, nanoseconds: 0} as unknown as Timestamp, vipExpiryTimestamp: Date.now() + 5 * 24 * 60 * 60 * 1000, lastSeen: { seconds: Math.floor(Date.now()/1000) - 5 * 60, nanoseconds: 0} as unknown as Timestamp }, // Valerie active
  { uid: 'nayem-vip', name: 'Nayem', email: 'nayem@example.com', isVIP: true, vipPack: 'Basic VIP', isVerified: true, avatarUrl: 'https://picsum.photos/seed/nayem/200', createdAt: { seconds: Date.now()/1000 - 100, nanoseconds: 0} as unknown as Timestamp, vipExpiryTimestamp: Date.now() + 7 * 24 * 60 * 60 * 1000, lastSeen: { seconds: Math.floor(Date.now()/1000) - 2 * 60, nanoseconds: 0} as unknown as Timestamp }, // Nayem active
  { uid: 'abdul-kaium-verified', name: 'Abdul-Kaium', email: 'kaium@example.com', isVerified: true, isVIP: false, avatarUrl: 'https://picsum.photos/seed/kaium/200', createdAt: { seconds: Date.now()/1000 - 200, nanoseconds: 0} as unknown as Timestamp, lastSeen: { seconds: Math.floor(Date.now()/1000) - 8 * 60, nanoseconds: 0} as unknown as Timestamp },
];

export const updateUserProfile = async (user: FirebaseAuthUser, additionalData?: Partial<UserProfile>): Promise<void> => {
  console.log(`[updateUserProfile] Updating profile for UID: ${user.uid}`, additionalData);
  const userIndex = mockLocalUsers.findIndex(u => u.uid === user.uid);
  if (userIndex !== -1) {
    mockLocalUsers[userIndex] = { ...mockLocalUsers[userIndex], ...additionalData, name: additionalData?.name || mockLocalUsers[userIndex].name, email: additionalData?.email || mockLocalUsers[userIndex].email };
  } else {
    const newUserProfile: UserProfile = {
        uid: user.uid,
        name: additionalData?.name || user.displayName || 'User',
        email: additionalData?.email || user.email,
        avatarUrl: additionalData?.avatarUrl || `https://placehold.co/200x200.png?text=${user.displayName?.[0] || 'U'}`,
        isVIP: additionalData?.isVIP || false,
        vipPack: additionalData?.vipPack,
        vipExpiryTimestamp: additionalData?.vipExpiryTimestamp,
        isBot: user.uid === BOT_UID,
        isDevTeam: user.uid === DEV_UID || additionalData?.isDevTeam || false, 
        isVerified: additionalData?.isVerified || user.uid === BOT_UID || user.uid === DEV_UID || (additionalData?.isDevTeam || false), // Verification not tied to VIP by default
        createdAt: (additionalData?.createdAt || { seconds: Date.now()/1000, nanoseconds: 0}) as unknown as Timestamp,
        lastSeen: (additionalData?.lastSeen || { seconds: Date.now()/1000, nanoseconds: 0}) as unknown as Timestamp,
        ...additionalData,
    };
    mockLocalUsers.push(newUserProfile);
    console.log(`[updateUserProfile] Added new user profile to local store:`, newUserProfile);
  }
  return Promise.resolve();
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  console.log(`[getUserProfile] Fetching profile for UID: ${userId}`);
  const profile = mockLocalUsers.find(u => u.uid === userId);
  if (profile) return Promise.resolve(profile);
  
  console.warn(`[getUserProfile] User ${userId} not found in local user store.`);
  return Promise.resolve(null);
};

export const findUserByEmail = async (email: string): Promise<UserProfile | null> => {
  console.log(`[findUserByEmail] Searching for user with email: ${email}`);
  const normalizedEmail = email.trim().toLowerCase();
  const profile = mockLocalUsers.find(u => u.email?.toLowerCase() === normalizedEmail);
  return Promise.resolve(profile || null);
};

export interface Chat {
  id?: string;
  participants: string[];
  participantDetails?: { [uid: string]: Partial<UserProfile> };
  lastMessage: string;
  lastMessageSenderId?: string; 
  lastMessageTimestamp: Timestamp;
  createdAt?: Timestamp;
}

export interface Message {
    id?: string;
    chatId: string;
    senderId: string;
    text: string;
    imageUrl?: string; // Added for image messages
    timestamp: Timestamp;
    isSentByCurrentUser?: boolean;
}

let CURRENT_DEMO_USER_ID = 'test-user'; 

export const setDemoUserId = (userId: string) => {
    CURRENT_DEMO_USER_ID = userId;
    mockChats = mockChats.map(chat => ({
        ...chat,
        participants: chat.participants.map(p => p === 'test-user-placeholder' ? userId : p).sort()
    }));
    for (const chatId in mockMessages) {
        mockMessages[chatId] = mockMessages[chatId].map(msg => ({
            ...msg,
            senderId: msg.senderId === 'test-user-placeholder' ? userId : msg.senderId
        }));
    }
    console.log(`[firestore] Demo User ID set to: ${userId}. Mock data updated.`);
};


let mockChats: Chat[] = [
    { id: 'chat-dev-team', participants: ['test-user-placeholder', DEV_UID].sort(), lastMessage: 'Hello Dev Team!', lastMessageSenderId: 'test-user-placeholder', lastMessageTimestamp: { seconds: Date.now()/1000 - 3600, nanoseconds: 0} as unknown as Timestamp, createdAt: { seconds: Date.now()/1000 - 7200, nanoseconds: 0} as unknown as Timestamp },
    { id: 'chat-blue-bird', participants: ['test-user-placeholder', BOT_UID].sort(), lastMessage: 'Hi, how can I help?', lastMessageSenderId: BOT_UID, lastMessageTimestamp: { seconds: Date.now()/1000 - 1800, nanoseconds: 0} as unknown as Timestamp, createdAt: { seconds: Date.now()/1000 - 3600, nanoseconds: 0} as unknown as Timestamp },
    { id: 'chat-twaha', participants: ['test-user-placeholder', 'verified-contact-1'].sort(), lastMessage: 'Excellent!', lastMessageSenderId: 'test-user-placeholder', lastMessageTimestamp: { seconds: Date.now()/1000 - 200, nanoseconds: 0} as unknown as Timestamp, createdAt: { seconds: Date.now()/1000 - 1200, nanoseconds: 0} as unknown as Timestamp },
    { id: 'chat-rakib', participants: ['test-user-placeholder', 'verified-contact-2'].sort(), lastMessage: 'Will do. They look good so far.', lastMessageSenderId: 'verified-contact-2', lastMessageTimestamp: { seconds: Date.now()/1000 - 350, nanoseconds: 0} as unknown as Timestamp, createdAt: { seconds: Date.now()/1000 - 1300, nanoseconds: 0} as unknown as Timestamp },
    { id: 'chat-ashadul', participants: ['test-user-placeholder', 'regular-user-1'].sort(), lastMessage: 'Almost, just a few more sections to wrap up.', lastMessageSenderId: 'test-user-placeholder', lastMessageTimestamp: { seconds: Date.now()/1000 - 100, nanoseconds: 0} as unknown as Timestamp, createdAt: { seconds: Date.now()/1000 - 1400, nanoseconds: 0} as unknown as Timestamp },
    { id: 'chat-monk-1', participants: ['test-user-placeholder', 'monk-user-1'].sort(), lastMessage: 'Peace be with you.', lastMessageSenderId: 'monk-user-1', lastMessageTimestamp: { seconds: Date.now()/1000 - 4900, nanoseconds: 0} as unknown as Timestamp, createdAt: { seconds: Date.now()/1000 - 10000, nanoseconds: 0} as unknown as Timestamp },
    { id: 'chat-monk-2', participants: ['test-user-placeholder', 'monk-user-2'].sort(), lastMessage: 'The path is clear.', lastMessageSenderId: 'monk-user-2', lastMessageTimestamp: { seconds: Date.now()/1000 - 4400, nanoseconds: 0} as unknown as Timestamp, createdAt: { seconds: Date.now()/1000 - 9000, nanoseconds: 0} as unknown as Timestamp },
    { id: 'chat-monk-3', participants: ['test-user-placeholder', 'monk-user-3'].sort(), lastMessage: '...', lastMessageSenderId: 'monk-user-3', lastMessageTimestamp: { seconds: Date.now()/1000 - 3900, nanoseconds: 0} as unknown as Timestamp, createdAt: { seconds: Date.now()/1000 - 8000, nanoseconds: 0} as unknown as Timestamp },
    { id: 'chat-monk-4', participants: ['test-user-placeholder', 'monk-user-4'].sort(), lastMessage: 'Meditation guides all.', lastMessageSenderId: 'monk-user-4', lastMessageTimestamp: { seconds: Date.now()/1000 - 3400, nanoseconds: 0} as unknown as Timestamp, createdAt: { seconds: Date.now()/1000 - 7000, nanoseconds: 0} as unknown as Timestamp },
    { id: 'chat-asad', participants: ['test-user-placeholder', 'verified-contact-3'].sort(), lastMessage: 'That would be fantastic, thanks!', lastMessageSenderId: 'test-user-placeholder', lastMessageTimestamp: { seconds: Date.now()/1000 - 2600, nanoseconds: 0} as unknown as Timestamp, createdAt: { seconds: Date.now()/1000 - 6000, nanoseconds: 0} as unknown as Timestamp },
    { id: 'chat-saidul', participants: ['test-user-placeholder', 'verified-contact-4'].sort(), lastMessage: 'Definitely! We have a few open issues on GitHub. Feel free to pick one up.', lastMessageSenderId: 'verified-contact-4', lastMessageTimestamp: { seconds: Date.now()/1000 - 2200, nanoseconds: 0} as unknown as Timestamp, createdAt: { seconds: Date.now()/1000 - 5000, nanoseconds: 0} as unknown as Timestamp },
    { id: 'chat-maria', participants: ['test-user-placeholder', 'vip-user-2'].sort(), lastMessage: 'It\'s for a client, so still under wraps, but it\'s a fun challenge!', lastMessageSenderId: 'vip-user-2', lastMessageTimestamp: { seconds: Date.now()/1000 - 550, nanoseconds: 0} as unknown as Timestamp, createdAt: { seconds: Date.now()/1000 - 1400, nanoseconds: 0} as unknown as Timestamp },
    { id: 'chat-rafi', participants: ['test-user-placeholder', 'vip-user-3'].sort(), lastMessage: 'Sounds good.', lastMessageSenderId: 'test-user-placeholder', lastMessageTimestamp: { seconds: Date.now()/1000 - 600, nanoseconds: 0} as unknown as Timestamp, createdAt: { seconds: Date.now()/1000 - 1600, nanoseconds: 0} as unknown as Timestamp },
    { id: 'chat-valerie', participants: ['test-user-placeholder', 'vip-only-user'].sort(), lastMessage: 'Hope you like them!', lastMessageSenderId: 'vip-only-user', lastMessageTimestamp: { seconds: Date.now()/1000 - 350, nanoseconds: 0} as unknown as Timestamp, createdAt: { seconds: Date.now()/1000 - 800, nanoseconds: 0} as unknown as Timestamp },
    { id: 'chat-nayem', participants: ['test-user-placeholder', 'nayem-vip'].sort(), lastMessage: 'Thanks! It has some nice perks.', lastMessageSenderId: 'nayem-vip', lastMessageTimestamp: { seconds: Date.now()/1000 - 140, nanoseconds: 0} as unknown as Timestamp, createdAt: { seconds: Date.now()/1000 - 300, nanoseconds: 0} as unknown as Timestamp },
    { id: 'chat-kaium', participants: ['test-user-placeholder', 'abdul-kaium-verified'].sort(), lastMessage: 'Will do! Catch you later.', lastMessageSenderId: 'abdul-kaium-verified', lastMessageTimestamp: { seconds: Date.now()/1000 - 120, nanoseconds: 0} as unknown as Timestamp, createdAt: { seconds: Date.now()/1000 - 500, nanoseconds: 0} as unknown as Timestamp },
];

let mockMessages: { [chatId: string]: Message[] } = {
    'chat-dev-team': [
        { id: 'm1', chatId: 'chat-dev-team', senderId: 'test-user-placeholder', text: 'Hello Dev Team!', timestamp: { seconds: Date.now()/1000 - 3600, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm2', chatId: 'chat-dev-team', senderId: DEV_UID, text: 'Hi Test User, how can we help?', timestamp: { seconds: Date.now()/1000 - 3500, nanoseconds: 0} as unknown as Timestamp },
    ],
    'chat-blue-bird': [
        { id: 'm3', chatId: 'chat-blue-bird', senderId: 'test-user-placeholder', text: 'Hi Blue Bird!', timestamp: { seconds: Date.now()/1000 - 1800, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm4', chatId: 'chat-blue-bird', senderId: BOT_UID, text: 'Hi, how can I help?', timestamp: { seconds: Date.now()/1000 - 1700, nanoseconds: 0} as unknown as Timestamp },
    ],
     'chat-twaha': [
        { id: 'm5-twaha', chatId: 'chat-twaha', senderId: 'test-user-placeholder', text: 'Hey Twaha, are we still on for tomorrow?', timestamp: { seconds: Date.now()/1000 - 600, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm6-twaha', chatId: 'chat-twaha', senderId: 'verified-contact-1', text: 'Yes, absolutely! 10 AM, right?', timestamp: { seconds: Date.now()/1000 - 500, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm7-twaha', chatId: 'chat-twaha', senderId: 'test-user-placeholder', text: 'Perfect. Looking forward to it.', timestamp: { seconds: Date.now()/1000 - 400, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm8-twaha', chatId: 'chat-twaha', senderId: 'verified-contact-1', text: 'Me too! I have some great ideas to discuss.', timestamp: { seconds: Date.now()/1000 - 300, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm9-twaha', chatId: 'chat-twaha', senderId: 'test-user-placeholder', text: 'Excellent!', timestamp: { seconds: Date.now()/1000 - 200, nanoseconds: 0} as unknown as Timestamp },
    ],
    'chat-rakib': [
        { id: 'm5-rakib', chatId: 'chat-rakib', senderId: 'test-user-placeholder', text: 'Rakib, did you get the files I sent over?', timestamp: { seconds: Date.now()/1000 - 650, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm6-rakib', chatId: 'chat-rakib', senderId: 'verified-contact-2', text: 'Yep, got them. Thanks! Will review them tonight.', timestamp: { seconds: Date.now()/1000 - 550, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm7-rakib', chatId: 'chat-rakib', senderId: 'test-user-placeholder', text: 'Great, let me know if you have any questions.', timestamp: { seconds: Date.now()/1000 - 450, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm8-rakib', chatId: 'chat-rakib', senderId: 'verified-contact-2', text: 'Will do. They look good so far.', timestamp: { seconds: Date.now()/1000 - 350, nanoseconds: 0} as unknown as Timestamp },
    ],
    'chat-ashadul': [
        { id: 'm5-ashadul', chatId: 'chat-ashadul', senderId: 'test-user-placeholder', text: 'Ashadul, are you free for lunch today?', timestamp: { seconds: Date.now()/1000 - 700, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm6-ashadul', chatId: 'chat-ashadul', senderId: 'regular-user-1', text: 'Yeah, I think so. What time were you thinking?', timestamp: { seconds: Date.now()/1000 - 600, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm7-ashadul', chatId: 'chat-ashadul', senderId: 'test-user-placeholder', text: 'Around 1 PM? There\'s a new cafe I wanted to try.', timestamp: { seconds: Date.now()/1000 - 500, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm8-ashadul', chatId: 'chat-ashadul', senderId: 'regular-user-1', text: 'Sounds good to me! See you then.', timestamp: { seconds: Date.now()/1000 - 400, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm9-ashadul', chatId: 'chat-ashadul', senderId: 'test-user-placeholder', text: 'Awesome!', timestamp: { seconds: Date.now()/1000 - 300, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm10-ashadul', chatId: 'chat-ashadul', senderId: 'regular-user-1', text: 'Btw, did you finish that report?', timestamp: { seconds: Date.now()/1000 - 200, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm11-ashadul', chatId: 'chat-ashadul', senderId: 'test-user-placeholder', text: 'Almost, just a few more sections to wrap up.', timestamp: { seconds: Date.now()/1000 - 100, nanoseconds: 0} as unknown as Timestamp },
    ],
    'chat-monk-1': [
        { id: 'm7', chatId: 'chat-monk-1', senderId: 'test-user-placeholder', text: 'Greetings, Peaceful Monk.', timestamp: { seconds: Date.now()/1000 - 5000, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm8', chatId: 'chat-monk-1', senderId: 'monk-user-1', text: 'Peace be with you.', timestamp: { seconds: Date.now()/1000 - 4900, nanoseconds: 0} as unknown as Timestamp },
    ],
    'chat-monk-2': [
        { id: 'm9', chatId: 'chat-monk-2', senderId: 'test-user-placeholder', text: 'Namaste, Zen Master.', timestamp: { seconds: Date.now()/1000 - 4500, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm10', chatId: 'chat-monk-2', senderId: 'monk-user-2', text: 'The path is clear.', timestamp: { seconds: Date.now()/1000 - 4400, nanoseconds: 0} as unknown as Timestamp },
    ],
    'chat-monk-3': [
        { id: 'm11', chatId: 'chat-monk-3', senderId: 'test-user-placeholder', text: 'Your thoughts?', timestamp: { seconds: Date.now()/1000 - 4000, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm12', chatId: 'chat-monk-3', senderId: 'monk-user-3', text: '...', timestamp: { seconds: Date.now()/1000 - 3900, nanoseconds: 0} as unknown as Timestamp },
    ],
    'chat-monk-4': [
        { id: 'm13', chatId: 'chat-monk-4', senderId: 'test-user-placeholder', text: 'Finding my inner peace.', timestamp: { seconds: Date.now()/1000 - 3500, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm14', chatId: 'chat-monk-4', senderId: 'monk-user-4', text: 'Meditation guides all.', timestamp: { seconds: Date.now()/1000 - 3400, nanoseconds: 0} as unknown as Timestamp },
    ],
    'chat-asad': [
        { id: 'm15-asad', chatId: 'chat-asad', senderId: 'test-user-placeholder', text: 'Asad, I really enjoyed your latest article on AI ethics!', timestamp: { seconds: Date.now()/1000 - 3000, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm16-asad', chatId: 'chat-asad', senderId: 'verified-contact-3', text: 'Thank you! Glad you found it insightful.', timestamp: { seconds: Date.now()/1000 - 2900, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm17-asad', chatId: 'chat-asad', senderId: 'test-user-placeholder', text: 'It really made me think. Do you have any other recommended reads on the topic?', timestamp: { seconds: Date.now()/1000 - 2800, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm18-asad', chatId: 'chat-asad', senderId: 'verified-contact-3', text: 'Sure, I can send you a list. There are some great books out there.', timestamp: { seconds: Date.now()/1000 - 2700, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm19-asad', chatId: 'chat-asad', senderId: 'test-user-placeholder', text: 'That would be fantastic, thanks!', timestamp: { seconds: Date.now()/1000 - 2600, nanoseconds: 0} as unknown as Timestamp },
    ],
    'chat-saidul': [
        { id: 'm17-saidul', chatId: 'chat-saidul', senderId: 'test-user-placeholder', text: 'Saidul, your new open-source project is really inspiring!', timestamp: { seconds: Date.now()/1000 - 2500, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm18-saidul', chatId: 'chat-saidul', senderId: 'verified-contact-4', text: 'Thanks for checking it out! I appreciate the feedback.', timestamp: { seconds: Date.now()/1000 - 2400, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm19-saidul', chatId: 'chat-saidul', senderId: 'test-user-placeholder', text: 'I\'m thinking of contributing. Is there anything specific you need help with?', timestamp: { seconds: Date.now()/1000 - 2300, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm20-saidul', chatId: 'chat-saidul', senderId: 'verified-contact-4', text: 'Definitely! We have a few open issues on GitHub. Feel free to pick one up.', timestamp: { seconds: Date.now()/1000 - 2200, nanoseconds: 0} as unknown as Timestamp },
    ],
    'chat-maria': [
        { id: 'm19-maria', chatId: 'chat-maria', senderId: 'test-user-placeholder', text: 'Hello Maria! How are you doing today?', timestamp: { seconds: Date.now()/1000 - 700, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm20-maria', chatId: 'chat-maria', senderId: 'vip-user-2', text: 'Hi! Doing well, thanks. Just working on a new design.', timestamp: { seconds: Date.now()/1000 - 650, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm21-maria', chatId: 'chat-maria', senderId: 'test-user-placeholder', text: 'Oh, exciting! Anything you can share?', timestamp: { seconds: Date.now()/1000 - 600, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm22-maria', chatId: 'chat-maria', senderId: 'vip-user-2', text: 'It\'s for a client, so still under wraps, but it\'s a fun challenge!', timestamp: { seconds: Date.now()/1000 - 550, nanoseconds: 0} as unknown as Timestamp },
    ],
    'chat-rafi': [
        { id: 'm21-rafi', chatId: 'chat-rafi', senderId: 'test-user-placeholder', text: 'Hi Rafi! Saw your update on the project, looks great.', timestamp: { seconds: Date.now()/1000 - 800, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm22-rafi', chatId: 'chat-rafi', senderId: 'vip-user-3', text: 'Thanks! It\'s been a lot of work, but it\'s coming together.', timestamp: { seconds: Date.now()/1000 - 750, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm23-rafi', chatId: 'chat-rafi', senderId: 'test-user-placeholder', text: 'Let me know if you need another pair of eyes on it.', timestamp: { seconds: Date.now()/1000 - 700, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm24-rafi', chatId: 'chat-rafi', senderId: 'vip-user-3', text: 'Appreciate that! I might take you up on it next week.', timestamp: { seconds: Date.now()/1000 - 650, nanoseconds: 0} as unknown as Timestamp },
        { id: 'm25-rafi', chatId: 'chat-rafi', senderId: 'test-user-placeholder', text: 'Sounds good.', timestamp: { seconds: Date.now()/1000 - 600, nanoseconds: 0} as unknown as Timestamp },
    ],
    'chat-valerie': [
        { id: 'm23', chatId: 'chat-valerie', senderId: 'test-user-placeholder', text: 'Checking out the VIP features!', timestamp: { seconds: Date.now()/1000 - 400, nanoseconds: 0 } as unknown as Timestamp },
        { id: 'm24', chatId: 'chat-valerie', senderId: 'vip-only-user', text: 'Hope you like them!', timestamp: { seconds: Date.now()/1000 - 350, nanoseconds: 0 } as unknown as Timestamp },
    ],
    'chat-nayem': [
        { id: 'nm1', chatId: 'chat-nayem', senderId: 'test-user-placeholder', text: 'Hey Nayem! Cool VIP status.', timestamp: { seconds: Date.now()/1000 - 150, nanoseconds: 0 } as unknown as Timestamp },
        { id: 'nm2', chatId: 'chat-nayem', senderId: 'nayem-vip', text: 'Thanks! It has some nice perks.', timestamp: { seconds: Date.now()/1000 - 140, nanoseconds: 0 } as unknown as Timestamp },
    ],
    'chat-kaium': [
        { id: 'km1', chatId: 'chat-kaium', senderId: 'test-user-placeholder', text: 'Any new Clash of Clans strats, Abdul-Kaium?', timestamp: { seconds: Date.now()/1000 - 250, nanoseconds: 0 } as unknown as Timestamp },
        { id: 'km2', chatId: 'chat-kaium', senderId: 'abdul-kaium-verified', text: 'Yeah, trying out a new Queen Charge hybrid. It\'s pretty strong against TH15s.', timestamp: { seconds: Date.now()/1000 - 240, nanoseconds: 0 } as unknown as Timestamp },
        { id: 'km3', chatId: 'chat-kaium', senderId: 'test-user-placeholder', text: 'Oh nice! What troops are you using with it?', timestamp: { seconds: Date.now()/1000 - 230, nanoseconds: 0 } as unknown as Timestamp },
        { id: 'km4', chatId: 'chat-kaium', senderId: 'abdul-kaium-verified', text: 'LavaLoon mainly. The Queen walks one side to take out key defenses, then the loons sweep through.', timestamp: { seconds: Date.now()/1000 - 220, nanoseconds: 0 } as unknown as Timestamp },
        { id: 'km5', chatId: 'chat-kaium', senderId: 'test-user-placeholder', text: 'Sounds complex but effective. I struggle with Queen Charges sometimes.', timestamp: { seconds: Date.now()/1000 - 210, nanoseconds: 0 } as unknown as Timestamp },
        { id: 'km6', chatId: 'chat-kaium', senderId: 'abdul-kaium-verified', text: 'It takes practice! Funneling is key. Make sure to use baby dragons or yetis for a good funnel.', timestamp: { seconds: Date.now()/1000 - 200, nanoseconds: 0 } as unknown as Timestamp },
        { id: 'km7', chatId: 'chat-kaium', senderId: 'test-user-placeholder', text: 'I\'ll try that. What about spells?', timestamp: { seconds: Date.now()/1000 - 190, nanoseconds: 0 } as unknown as Timestamp },
        { id: 'km8', chatId: 'chat-kaium', senderId: 'abdul-kaium-verified', text: 'Usually 3 rage, 2 freeze, and a poison. Sometimes an invis for the Queen if she gets into trouble.', timestamp: { seconds: Date.now()/1000 - 180, nanoseconds: 0 } as unknown as Timestamp },
        { id: 'km9', chatId: 'chat-kaium', senderId: 'test-user-placeholder', text: 'Got it. Thanks for the tips! I need to upgrade my heroes first though, they are a bit low.', timestamp: { seconds: Date.now()/1000 - 170, nanoseconds: 0 } as unknown as Timestamp },
        { id: 'km10', chatId: 'chat-kaium', senderId: 'abdul-kaium-verified', text: 'No problem! Hero levels make a huge difference. Keep grinding!', timestamp: { seconds: Date.now()/1000 - 160, nanoseconds: 0 } as unknown as Timestamp },
        { id: 'km11', chatId: 'chat-kaium', senderId: 'test-user-placeholder', text: 'Definitely. Are you in a clan war soon?', timestamp: { seconds: Date.now()/1000 - 150, nanoseconds: 0 } as unknown as Timestamp },
        { id: 'km12', chatId: 'chat-kaium', senderId: 'abdul-kaium-verified', text: 'Yeah, war starts tomorrow. Hoping to get some 3-star attacks with this new strategy.', timestamp: { seconds: Date.now()/1000 - 140, nanoseconds: 0 } as unknown as Timestamp },
        { id: 'km13', chatId: 'chat-kaium', senderId: 'test-user-placeholder', text: 'Good luck! Let me know how it goes.', timestamp: { seconds: Date.now()/1000 - 130, nanoseconds: 0 } as unknown as Timestamp },
        { id: 'km14', chatId: 'chat-kaium', senderId: 'abdul-kaium-verified', text: 'Will do! Catch you later.', timestamp: { seconds: Date.now()/1000 - 120, nanoseconds: 0 } as unknown as Timestamp },
    ]
};


export const getUserChats = (
    userId: string,
    callback: (chats: Chat[]) => void,
    onError: (error: Error) => void
): (() => void) => {
  console.log(`[getUserChats] Getting chats for user: ${userId}`);
  try {
    const activeUserId = userId || CURRENT_DEMO_USER_ID;

    const userChats = mockChats.filter(chat => chat.participants.includes(activeUserId));
    
    const enrichedChats = userChats.map(chat => {
        const participantDetails: Chat['participantDetails'] = {};
        chat.participants.forEach(pId => {
            const profile = mockLocalUsers.find(u => u.uid === pId);
            if (profile) {
                participantDetails[pId] = {
                    uid: pId, name: profile.name, avatarUrl: profile.avatarUrl,
                    isVIP: profile.isVIP, isVerified: profile.isVerified, isDevTeam: profile.isDevTeam, isBot: profile.isBot,
                    lastSeen: profile.lastSeen 
                };
            } else {
                 participantDetails[pId] = { uid: pId, name: "Unknown User"};
            }
        });
        const updatedParticipants = chat.participants.map(p => p === CURRENT_DEMO_USER_ID ? activeUserId : p).sort();
        return { ...chat, participants: updatedParticipants, participantDetails };
    });
    setTimeout(() => callback(enrichedChats), 50);
  } catch (e: any) {
    onError(e);
  }
  return () => { console.log("[getUserChats] Unsubscribe called for mock listener.") };
};

export const findChatBetweenUsers = async (userId1: string, userId2: string): Promise<string | null> => {
  console.log(`[findChatBetweenUsers] Searching for chat between ${userId1} and ${userId2}`);
  if (userId1 === userId2) return null;
  const sortedParticipants = [userId1, userId2].sort();
  const chat = mockChats.find(c => {
      const currentSorted = [...c.participants].sort();
      return currentSorted.join(',') === sortedParticipants.join(',');
  });
  return Promise.resolve(chat?.id || null);
};

export const createChat = async (userId1: string, userId2: string): Promise<string> => {
  console.log(`[createChat] Creating chat between ${userId1} and ${userId2}`);
  if (userId1 === userId2) throw new Error("Cannot create chat with self.");

  const existingChatId = await findChatBetweenUsers(userId1, userId2);
  if (existingChatId) return existingChatId;

  const newChatId = `chat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const sortedParticipants = [userId1, userId2].sort();
  const newChat: Chat = {
    id: newChatId,
    participants: sortedParticipants,
    lastMessage: 'Chat created.',
    lastMessageSenderId: userId1, 
    lastMessageTimestamp: { seconds: Date.now()/1000, nanoseconds: 0} as unknown as Timestamp,
    createdAt: { seconds: Date.now()/1000, nanoseconds: 0} as unknown as Timestamp,
  };
  mockChats.push(newChat);
  if (!mockMessages[newChatId]) {
    mockMessages[newChatId] = [];
  }
  console.log(`[createChat] New chat created with ID: ${newChatId}`);
  return Promise.resolve(newChatId);
};

export const sendWelcomeMessage = async (newUserId: string): Promise<void> => {
  console.log(`[sendWelcomeMessage] Sending welcome to ${newUserId}`);
  if (newUserId === BOT_UID) {
      console.log("[sendWelcomeMessage] Target user is the bot itself. Skipping welcome message.");
      return Promise.resolve();
  }
  try {
    const chatId = await createChat(newUserId, BOT_UID); 
    const welcomeText = "Welcome to Echo Message! 🎉 I'm Blue Bird. How can I assist you today?";
    await sendMessage(chatId, BOT_UID, welcomeText); 
    console.log(`[sendWelcomeMessage] Welcome message sent to ${newUserId} in chat ${chatId}`);
  } catch (error) {
    console.error(`[sendWelcomeMessage] Error:`, error);
  }
};

let chatListeners: { [chatId: string]: Array<(messages: Message[]) => void> } = {};

export const getChatMessages = (
    chatId: string,
    callback: (messages: Message[]) => void,
    onError: (error: Error) => void
): (() => void) => {
  console.log(`[getChatMessages] Registering listener for chat ID: ${chatId}`);

  if (!chatListeners[chatId]) {
    chatListeners[chatId] = [];
  }
  chatListeners[chatId].push(callback);

  try {
    const messagesForChat = mockMessages[chatId] || [];
    Promise.resolve().then(() => callback(messagesForChat));
  } catch (e: any) {
    onError(e);
  }

  return () => {
    console.log(`[getChatMessages] Unregistering listener for chat ${chatId}.`);
    if (chatListeners[chatId]) {
      chatListeners[chatId] = chatListeners[chatId].filter(cb => cb !== callback);
      if (chatListeners[chatId].length === 0) {
        delete chatListeners[chatId]; 
      }
    }
  };
};


export const sendMessage = async (chatId: string, senderId: string, text: string, imageUrl?: string): Promise<void> => {
  console.log(`[sendMessage] Sending message from ${senderId} to chat ${chatId}. Image: ${!!imageUrl}`);
  const trimmedText = text.trim();
  if (!chatId || !senderId || (!trimmedText && !imageUrl)) {
    console.warn("[sendMessage] Invalid input. Chat ID, Sender ID, or (Text and ImageUrl) is empty.", { chatId, senderId, text: trimmedText, imageUrl });
    throw new Error("Invalid input for sending message.");
  }

  const newMessage: Message = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    chatId,
    senderId,
    text: trimmedText,
    imageUrl: imageUrl,
    timestamp: { seconds: Math.floor(Date.now()/1000), nanoseconds: 0} as unknown as Timestamp,
  };

  if (!mockMessages[chatId]) {
    mockMessages[chatId] = [];
  }
  mockMessages[chatId].push(newMessage);

  const chatIndex = mockChats.findIndex(c => c.id === chatId);
  if (chatIndex !== -1) {
    mockChats[chatIndex].lastMessage = imageUrl ? "[Photo]" : trimmedText; 
    mockChats[chatIndex].lastMessageTimestamp = newMessage.timestamp;
    mockChats[chatIndex].lastMessageSenderId = senderId; 
  } else {
      console.warn(`[sendMessage] Chat with ID ${chatId} not found in mockChats to update last message.`);
  }
  console.log(`[sendMessage] Message added to chat ${chatId}:`, newMessage);

  if (chatListeners[chatId]) {
    const updatedMessagesForChat = [...(mockMessages[chatId] || [])]; 
    chatListeners[chatId].forEach(listener => {
        try {
            listener(updatedMessagesForChat);
        } catch (e) {
            console.error("[sendMessage] Error in listener callback:", e);
        }
    });
  }

  return Promise.resolve();
};


export const updateVIPStatus = async (userId: string, isVIP: boolean, vipPack?: string, durationDays?: number): Promise<void> => {
  console.log(`[updateVIPStatus] Updating VIP for ${userId} to ${isVIP}`);
  const userIndex = mockLocalUsers.findIndex(u => u.uid === userId);
  if (userIndex !== -1) {
    mockLocalUsers[userIndex].isVIP = isVIP;
    mockLocalUsers[userIndex].vipPack = isVIP ? vipPack : undefined;
    mockLocalUsers[userIndex].vipExpiryTimestamp = isVIP && durationDays ? Date.now() + durationDays * 24 * 60 * 60 * 1000 : undefined;
    
    // Do NOT automatically verify user on VIP purchase
    // mockLocalUsers[userIndex].isVerified = true; // Removed

    if (!isVIP) { 
        const user = mockLocalUsers[userIndex];
        if (!user.isDevTeam && !user.isBot) { 
            // mockLocalUsers[userIndex].isVerified = false; // Re-evaluating: verification is separate
        }
    }
  } else {
      console.warn(`[updateVIPStatus] User ${userId} not found to update VIP status.`);
  }
  return Promise.resolve();
};

export const formatTimestamp = (timestamp: Timestamp | null | undefined): string => {
  if (!timestamp || typeof timestamp.seconds !== 'number') {
    return '';
  }
  try {
    const date = new Date(timestamp.seconds * 1000);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } else {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      if (date > oneWeekAgo) {
         return date.toLocaleDateString([], { weekday: 'short' }); 
      }
      if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' });
      }
    }
  } catch (e) {
    console.error("Error formatting timestamp:", e, "Original timestamp:", timestamp);
    return 'Invalid Date';
  }
};

export const mapChatToChatItem = (chat: Chat, currentUserId: string): ChatItemProps => {
  const otherParticipantId = chat.participants.find(p => p !== currentUserId);
  const otherDetails = otherParticipantId ? chat.participantDetails?.[otherParticipantId] : undefined;

  const name = otherDetails?.name ?? (otherParticipantId === BOT_UID ? 'Blue Bird' : (otherParticipantId === DEV_UID ? 'Dev Team' : 'Chat User'));
  const avatarUrl = otherDetails?.avatarUrl;

  const isContactDevTeam = !!otherDetails?.isDevTeam;
  const isContactBot = !!otherDetails?.isBot;
  const isContactGenerallyVerified = !!otherDetails?.isVerified; 
  const isContactActuallyVIP = !!otherDetails?.isVIP && !isContactDevTeam && !isContactBot;

  let iconIdentifier: string | undefined = undefined;
  if (isContactBot && avatarUrl === 'blue-bird-icon-placeholder') {
    iconIdentifier = 'blue-bird-icon';
  } else if (isContactDevTeam && avatarUrl === 'dev-team-svg-placeholder') {
    iconIdentifier = 'dev-team-svg';
  }
  
  let isVerifiedForSectioning = false;
  if (isContactDevTeam) { 
      isVerifiedForSectioning = true;
  } else if (isContactGenerallyVerified && !isContactBot && !isContactDevTeam) { 
      isVerifiedForSectioning = true;
  }
  

  const isLastMessageSentByCurrentUser = chat.lastMessageSenderId === currentUserId;

  let isOnline = false;
  if (otherDetails?.lastSeen) {
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000); 
      
      const lastSeenMillis = typeof (otherDetails.lastSeen as any).toMillis === 'function'
          ? (otherDetails.lastSeen as any).toMillis() 
          : (otherDetails.lastSeen.seconds * 1000) + ((otherDetails.lastSeen.nanoseconds || 0) / 1000000); 
          
      if (lastSeenMillis > fiveMinutesAgo) {
          isOnline = true;
      }
  }

  return {
    id: chat.id!,
    name: name,
    contactUserId: otherParticipantId || '',
    avatarUrl: avatarUrl,
    lastMessage: chat.lastMessage,
    timestamp: formatTimestamp(chat.lastMessageTimestamp),
    lastMessageTimestampValue: chat.lastMessageTimestamp.seconds, 
    isVerified: isVerifiedForSectioning, 
    isContactVIP: isContactActuallyVIP, 
    isDevTeam: isContactDevTeam, 
    isBot: isContactBot, 
    href: `/chat/${chat.id}`,
    iconIdentifier: iconIdentifier,
    isLastMessageSentByCurrentUser: isLastMessageSentByCurrentUser,
    isOnline: isOnline, 
  };
};

export { mockLocalUsers, mockChats }; 
