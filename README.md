# Notion MCP - Sprint Dashboard & Task Management

A Next.js application that integrates with Notion to provide sprint dashboards, Kanban boards, table viewers, and AI-powered suggestions using DeepSeek LLM.

## Features

- 🔐 **Notion OAuth Integration** - Secure authentication with your Notion workspace
- 📊 **Sprint Dashboard** - Visualize sprint progress with charts and metrics
- 📋 **Kanban Board** - Drag-and-drop task management
- 📑 **Table Viewer** - View and manage Notion databases in table format
- 🤖 **AI Suggestions** - Get AI-powered task suggestions using DeepSeek LLM
- 🌍 **Multi-language Support** - English and Thai localization

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Notion account
- (Optional) DeepSeek API key for AI features

### Step 1: Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Fill in the details:
   - **Name**: `Notion MCP` (or any name you prefer)
   - **Associated workspace**: Select your workspace
   - **Type**: Select **"Public integration"** (for OAuth)
4. Under **Capabilities**, enable:
   - ✅ Read content
   - ✅ Update content
   - ✅ Insert content
5. Click **"Submit"**

### Step 2: Configure OAuth Settings

1. In your integration settings, go to the **"Distribution"** tab
2. Configure OAuth:
   - **Redirect URIs**: Add `http://localhost:3000/api/notion/callback`
   - For production, also add: `https://yourdomain.com/api/notion/callback`
3. Copy these values (you'll need them next):
   - **OAuth client ID**
   - **OAuth client secret**

### Step 3: Set Up Environment Variables

1. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Notion credentials:

   ```bash
   # Required for Notion integration
   NOTION_CLIENT_ID=your_client_id_here
   NOTION_CLIENT_SECRET=your_client_secret_here
   NOTION_REDIRECT_URI=http://localhost:3000/api/notion/callback

   # Optional: For AI-powered suggestions
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   ```

### Step 4: Install Dependencies and Run

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 5: Connect Your Notion Account

1. Navigate to any Notion feature page (e.g., `/notion/sprint-dashboard`)
2. Click the **"Connect to Notion"** button
3. You'll be redirected to Notion to authorize the app
4. Select the pages/databases you want to share with the app
5. Click **"Allow access"**
6. You'll be redirected back to the app with your real Notion data!

### Step 6: Share Databases with Your Integration

After connecting, you need to share specific Notion databases with your integration:

1. Open your Notion workspace
2. Navigate to the database you want to use
3. Click the **"•••"** menu in the top-right
4. Select **"Add connections"**
5. Search for and select your integration (e.g., "Notion MCP")
6. Click **"Confirm"**

Repeat this for each database you want to access in the app.

## Database Schema Requirements

For the app to work properly, your Notion databases should have these properties:

### Task/Sprint Database

- **Title** (title) - Task name
- **Status** (select) - Values: `Backlog`, `To Do`, `In Progress`, `Review`, `Done`
- **Priority** (select) - Values: `Low`, `Medium`, `High`
- **Story Points** (number) - Effort estimation
- **Due Date** (date) - Task deadline
- **Labels/Tags** (multi-select) - Task categories
- **Description** (rich text) - Optional task description

The app will automatically detect and use these properties.

## Project Structure

```
src/
├── app/                      # Next.js app directory
│   ├── api/notion/          # Notion API routes
│   │   ├── auth/            # OAuth initiation
│   │   ├── callback/        # OAuth callback handler
│   │   ├── databases/       # Database operations
│   │   └── pages/           # Page operations
│   └── notion/              # Notion feature pages
│       ├── sprint-dashboard/
│       ├── table-viewer/
│       └── llm-suggestions/
├── components/
│   ├── notion/              # Notion-specific components
│   ├── d3/                  # Data visualization
│   └── ui/                  # UI components
├── lib/
│   ├── services/notion/     # Notion service layer
│   │   ├── client.ts        # API client
│   │   ├── auth.ts          # OAuth implementation
│   │   └── transformers.ts  # Data transformers
│   └── config/
│       └── env.ts           # Environment configuration
└── app-types/               # TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues

## Features in Detail

### Sprint Dashboard

View sprint metrics, burndown charts, and task distribution. Includes:

- Sprint velocity and completion rate
- Story points breakdown
- Task status distribution
- Priority analysis
- Team member workload

### Kanban Board

Drag-and-drop interface for managing tasks across different stages:

- Backlog → To Do → In Progress → Review → Done
- Visual story points and priority indicators
- Quick filters and search

### Table Viewer

Browse and manage multiple Notion databases:

- Sortable columns
- Status and text filtering
- Quick task editing
- Bulk operations

### LLM Suggestions

AI-powered task analysis and suggestions using DeepSeek:

- Task prioritization recommendations
- Sprint planning assistance
- Workload balancing
- Risk identification

## Troubleshooting

### "Notion API key or access token is required" error

- Ensure you've set `NOTION_CLIENT_ID` and `NOTION_CLIENT_SECRET` in `.env.local`
- Restart your dev server after adding environment variables

### "No databases found"

- Make sure you've shared at least one database with your integration
- The integration needs to be connected to specific pages in Notion

### OAuth redirect not working

- Verify the redirect URI matches exactly in both:
  - Your `.env.local` file
  - Your Notion integration settings
- For local development, use: `http://localhost:3000/api/notion/callback`

### "Invalid state parameter" error

- This is a security check. Clear your cookies and try authenticating again
- Make sure your system clock is accurate

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Data Visualization**: D3.js
- **API Integration**: Notion API + DeepSeek LLM
- **Internationalization**: next-intl

## Contributing

This is a personal project, but feel free to fork and customize for your needs!

## License

MIT

## Support

For Notion API issues, check:

- [Notion API Documentation](https://developers.notion.com/)
- [Notion API Status](https://status.notion.so/)

For DeepSeek issues:

- [DeepSeek Documentation](https://platform.deepseek.com/docs)
