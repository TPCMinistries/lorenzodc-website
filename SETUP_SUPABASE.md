# Supabase Setup for Conversation Storage

This guide walks you through setting up Supabase for storing chat conversations.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note down your project URL and anon key

## 2. Set Up Environment Variables

Add these to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Create the Database Schema

1. Open your Supabase dashboard
2. Go to "SQL Editor"
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the query

This will create:
- `conversations` table with proper structure
- Indexes for performance
- Row Level Security (RLS) policies
- Automatic timestamp updates
- Optional cleanup function for old conversations

## 4. Test the Implementation

1. Restart your development server: `npm run dev`
2. Go to `/chat` in your browser
3. Start a conversation
4. Check your Supabase dashboard > Table Editor > conversations

You should see your conversation saved with:
- Unique ID
- Generated title (first few words of your message)
- Messages stored as JSON
- Timestamps

## 5. Features Included

### ✅ Conversation Management
- **Auto-save**: Every message exchange is automatically saved
- **History**: View all past conversations in the sidebar
- **Resume**: Click any conversation to continue where you left off
- **Context**: AI remembers the full conversation history
- **Delete**: Remove conversations you no longer need

### ✅ UI Features
- **Sidebar**: Click "History" to see all conversations
- **Message count**: Shows how many messages in each conversation
- **Timestamps**: See when conversations were last updated
- **Visual indicators**: Current conversation is highlighted
- **Chat bubbles**: Full conversation view with proper message layout

### ✅ Technical Features
- **Conversation context**: AI gets the last 10 messages for context
- **Anonymous support**: Works without user authentication
- **Performance**: Indexed queries for fast loading
- **Security**: RLS policies prevent data leaks
- **Scalability**: Automatic cleanup of old anonymous conversations

## 6. Optional: User Authentication

To associate conversations with specific users:

1. Set up Supabase Auth in your project
2. The `user_id` field is already included in the schema
3. Modify the conversation functions to include the authenticated user ID

## 7. Troubleshooting

### Common Issues:

**"Error: relation 'conversations' does not exist"**
- Make sure you ran the SQL schema in Supabase

**"Invalid API key"**
- Check your environment variables
- Restart the dev server after adding env vars

**"RLS policy violation"**
- The schema includes RLS policies that allow anonymous access
- If you add user auth, update the policies accordingly

### Development vs Production

**Development:**
- Uses anonymous conversations (no user_id)
- 30-day auto-cleanup for anonymous conversations

**Production recommendations:**
- Add user authentication
- Set up proper RLS policies for user isolation
- Consider conversation limits per user
- Add backup/export functionality

## 8. Next Steps

Consider adding:
- Export conversations to PDF/markdown
- Search functionality across conversations
- Conversation sharing
- Tags/categories for conversations
- Usage analytics and insights