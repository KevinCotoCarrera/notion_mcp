# 🚀 Quick Setup Guide - Connect Your Notion Account

This guide will help you connect your real Notion account to the app in **5 minutes**.

## 📋 What You'll Need

- A Notion account (free or paid)
- 5 minutes of your time

## Step-by-Step Setup

### 1. Create a Notion Integration (2 minutes)

**a) Go to Notion Integrations:**

- Visit: [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
- Click **"+ New integration"**

**b) Fill in the form:**

- **Name**: `Notion MCP` (or any name you want)
- **Logo**: (optional)
- **Associated workspace**: Choose your workspace
- **Type**: Select **"Public integration"**

**c) Set capabilities:**

- ✅ Read content
- ✅ Update content
- ✅ Insert content

**d) Click "Submit"**

### 2. Configure OAuth (1 minute)

**a) In your integration page, go to "Distribution" tab**

**b) Add redirect URI:**

```
http://localhost:3000/api/notion/callback
```

**c) Copy these two values:**

- **OAuth client ID** (looks like: `abc123...`)
- **OAuth client secret** (looks like: `secret_xyz...`)

⚠️ **Important**: Keep the OAuth client secret private!

### 3. Configure Your App (1 minute)

**a) Open the `.env.local` file in your project root**

**b) Add your credentials:**

```bash
NOTION_CLIENT_ID=your_oauth_client_id_here
NOTION_CLIENT_SECRET=your_oauth_client_secret_here
NOTION_REDIRECT_URI=http://localhost:3000/api/notion/callback
```

**c) Save the file**

**d) Restart your development server:**

```bash
# Stop the current server (Ctrl+C)
# Then restart it:
npm run dev
```

### 4. Connect to Notion (1 minute)

**a) Open your browser:**

```
http://localhost:3000/notion/sprint-dashboard
```

**b) Click "Connect to Notion"** (or similar button)

**c) Authorize the app:**

- Notion will show you a permission screen
- Select which pages you want to share
- Click **"Allow access"**

**d) You'll be redirected back to the app** ✅

### 5. Share Your Databases

After connecting, you need to give your integration access to specific databases:

**a) Open Notion in your browser**

**b) Go to a database you want to use** (e.g., your Tasks database)

**c) Click the "•••" menu** (top-right corner)

**d) Select "Add connections"**

**e) Find and select your integration** (e.g., "Notion MCP")

**f) Click "Confirm"**

**g) Repeat for each database** you want to access in the app

## 🎉 You're Done!

Refresh the app page and you should see your real Notion data!

## 📊 Recommended Database Setup

For the best experience, create a database with these properties:

| Property     | Type         | Options                                             |
| ------------ | ------------ | --------------------------------------------------- |
| Name         | Title        | -                                                   |
| Status       | Select       | `Backlog`, `To Do`, `In Progress`, `Review`, `Done` |
| Priority     | Select       | `Low`, `Medium`, `High`                             |
| Story Points | Number       | -                                                   |
| Due Date     | Date         | -                                                   |
| Tags         | Multi-select | Whatever tags you want                              |
| Description  | Text         | -                                                   |

The app will automatically detect and use these properties!

## ❓ Troubleshooting

### "Notion API key or access token is required"

- Check that you added the credentials to `.env.local`
- Make sure you restarted the dev server
- Verify there are no extra spaces in the values

### "No databases found"

- You need to share databases with your integration (see Step 5 above)
- Make sure you clicked "Add connections" in Notion

### OAuth redirect error

- Verify the redirect URI is exactly: `http://localhost:3000/api/notion/callback`
- Check both in `.env.local` and in Notion integration settings
- No trailing slash!

### Still seeing fake data?

- Clear your browser cookies
- Try connecting again
- Check the browser console (F12) for errors

## 🔐 Security Notes

- Never commit `.env.local` to git (it's already in `.gitignore`)
- The OAuth client secret should remain private
- Access tokens are stored securely in HTTP-only cookies
- In production, use HTTPS for the redirect URI

## 🎯 Next Steps

Once connected, try these features:

1. **Sprint Dashboard** - View your sprint metrics and progress
2. **Kanban Board** - Drag and drop tasks across columns
3. **Table Viewer** - Browse and filter your databases
4. **LLM Suggestions** - Get AI-powered task recommendations (requires DeepSeek API key)

Need help? Check the main [README.md](./README.md) for more details!
