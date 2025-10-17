# Aniekan Blog

My personal blog built with Astro and Strapi CMS.

> **Version 0.12.0** - Migrated from TinaCMS to Strapi v5 CMS  
> See [CHANGELOG.md](./CHANGELOG.md) for version history

## 🚀 Features

- ⚡️ Built with [Astro](https://astro.build) for blazing-fast performance
- 📝 Content management with [Strapi v5](https://strapi.io) headless CMS
- 🎨 Styled with [Tailwind CSS](https://tailwindcss.com)
- 📱 Fully responsive design
- 📰 **Blog Posts** with rich text content
- 💼 **Projects Portfolio** showcase
- ❤️ **Like System** for blog posts (session-based)
- 💬 **Comments System** with moderation
- 🏷️ Tag-based organization
- 📄 Pagination support
- 🔍 SEO optimized
- 📡 RSS feed

## 🎯 Content Types

### Blog Posts
- Rich text editing with Strapi
- Image uploads and galleries
- Tags and categories
- Draft/Publish workflow
- Interactive likes and comments
- Author information and publishing dates

### Projects
- Portfolio project showcase
- Technology stack tags
- Live demo and GitHub repository links
- Project status tracking (planning, in-progress, completed, maintenance)
- Featured projects highlighting
- Image galleries
- Project timelines

## 🛠️ Tech Stack

- **Frontend:** Astro, React, Tailwind CSS
- **CMS:** Strapi v5
- **Database:** SQLite (dev), PostgreSQL (production recommended)
- **Deployment:** GitHub Pages (frontend), Railway/Render (CMS)

## 📦 Prerequisites

- Node.js 20.x (managed with fnm or nvm)
- pnpm (or npm)

## 🏁 Quick Start

### Option 1: Quick Setup (Recommended)
See **[QUICKSTART.md](./QUICKSTART.md)** for a 5-minute setup guide.

### Option 2: Full Setup

1. **Install Dependencies**

```bash
pnpm install
```

2. **Set Up Strapi CMS**

Make sure you're using Node.js 20:

```bash
fnm use 20
```

Start the Strapi CMS in development mode:

```bash
pnpm dev:cms
```

This will:
- Start Strapi on `http://localhost:1337`
- Open the admin panel at `http://localhost:1337/admin`
- Prompt you to create an admin account (first time only)

See [STRAPI_SETUP.md](./docs/STRAPI_SETUP.md) for detailed CMS configuration instructions.

### 3. Configure Environment Variables

Update `.env` with your Strapi URL:

```env
PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token-here
```

### 4. Start the Astro Dev Server

In a separate terminal:

```bash
pnpm dev
```

The blog will be available at `http://localhost:4321/aniekan-blog`

### 5. Run Both Together

Or run both Strapi and Astro concurrently:

```bash
pnpm dev:all
```

## 📝 Content Management

All blog content is managed through the Strapi CMS:

1. Go to `http://localhost:1337/admin`
2. Navigate to **Content Manager**
3. Manage:
   - **Blog Posts** - Create articles with likes and comments
   - **Projects** - Showcase your portfolio work
   - **Comments** - Moderate user comments
   - **Likes** - View analytics on post engagement

**Important**: You must set proper permissions in Strapi for the frontend to access the API.
See [QUICKSTART.md](./QUICKSTART.md) step 2 for details.

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute setup guide ⚡
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup and deployment guide 📖
- [Strapi Setup Guide](./docs/STRAPI_SETUP.md) - Detailed CMS configuration
- [Migration Guide](./docs/MIGRATION.md) - TinaCMS to Strapi migration details
- [Quick Reference](./docs/QUICK_REFERENCE.md) - Quick reference card
- [Astro Documentation](https://docs.astro.build)
- [Strapi Documentation](https://docs.strapi.io)

## 🎨 Customization

### Styling
All components use Tailwind CSS. Main styling files:
- `src/styles/global.css` - Global styles
- Component files (`.astro`, `.tsx`) - Component-specific styles

### Features
- **Likes**: Session-based, no authentication required
- **Comments**: Moderated, requires approval in Strapi admin
- **Projects**: Full portfolio management with galleries

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for advanced customization options.

## 🚢 Deployment

### Deploy Strapi CMS

1. Deploy Strapi to Railway, Render, or Heroku
2. Configure PostgreSQL database
3. Update environment variables

### Deploy Astro Frontend

```bash
pnpm build
```

Deploy the `dist` folder to GitHub Pages or your preferred hosting provider.

Update `.env` with production Strapi URL:

```env
PUBLIC_STRAPI_URL=https://your-strapi-instance.com
STRAPI_API_TOKEN=your-production-api-token
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

## 📚 Documentation

- [Strapi Setup Guide](./docs/STRAPI_SETUP.md) - Detailed CMS configuration
- [Migration Guide](./docs/MIGRATION.md) - TinaCMS to Strapi migration details
- [Quick Reference](./docs/QUICK_REFERENCE.md) - Quick reference card
- [Astro Documentation](https://docs.astro.build)
- [Strapi Documentation](https://docs.strapi.io)

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

See [LICENSE](./LICENSE) file for details.
