<div align="center">
  <img src="./public/logo.png" alt="Trellone Logo" />
</div>

<div align="center">
  <h1>✨ Welcome to Trellone!<br/>React + TypeScript + Material-UI + Real-time Collaboration ✨</h1>
</div>

<p align="center">
  <span>A modern, feature-rich Trello clone built with React 18, TypeScript, and Material-UI. Experience seamless real-time collaboration, beautiful drag-and-drop interfaces, and comprehensive project management capabilities.</span></br>
  <sub>Made by <a href="https://github.com/Congglee">Conggglee</a> 🤗</sub>
</p>

<div align="center">

[![React](https://img.shields.io/badge/react-18.3.1-blue?logo=react&logoColor=white)](https://reactjs.org/ 'Go to React')
[![TypeScript](https://img.shields.io/badge/typescript-5.7.2-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/ 'Go to TypeScript')
[![Vite](https://img.shields.io/badge/vite-6.1.0-purple?logo=vite&logoColor=white)](https://vitejs.dev/ 'Go to Vite')
[![Material-UI](https://img.shields.io/badge/mui-5.16.14-blue?logo=mui&logoColor=white)](https://mui.com/ 'Go to Material-UI')
[![Redux Toolkit](https://img.shields.io/badge/redux--toolkit-2.6.0-purple?logo=redux&logoColor=white)](https://redux-toolkit.js.org/ 'Go to Redux Toolkit')
[![Socket.io](https://img.shields.io/badge/socket.io-4.8.1-green?logo=socket.io&logoColor=white)](https://socket.io/ 'Go to Socket.io')

</div>

![divider](https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif)

## :blue_heart: About the Project

**Trellone** is a modern, production-ready Trello clone that brings project management into the modern era. Built with React 18 and TypeScript, it offers a beautiful, responsive interface powered by Material-UI with comprehensive real-time collaboration features.

This project represents a complete reimplementation of Trello's core functionality using the latest web technologies. It's designed for development teams, project managers, and remote teams who need powerful project management tools without the complexity of enterprise solutions.

**Key highlights:**

- **Real-time Collaboration**: Multiple users can work simultaneously with instant updates via Socket.io
- **Modern Stack**: Built with React 18, TypeScript 5.7, and Material-UI v5 for optimal performance
- **Beautiful UI/UX**: Clean, responsive design with dark/light theme support and smooth animations
- **Comprehensive Features**: Complete board, column, and card management with drag-and-drop
- **Rich Content**: File attachments, markdown descriptions, due dates, and cover photos
- **Secure Authentication**: JWT-based auth with Google OAuth and email verification
- **Production Ready**: Optimized builds, comprehensive error handling, and deployment configuration

The application follows modern React patterns with Redux Toolkit for state management, RTK Query for API integration, and Socket.io for real-time features. It's fully typed with TypeScript and includes comprehensive form validation, responsive design, and accessibility features.

<br/>

## :rocket: Technologies

[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)](https://mui.com/)
[![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)](https://react-hook-form.com/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)](https://prettier.io/)

<br/>

## :zap: Getting Started - Project Setup

To run this project locally, follow the steps below.

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (version 18.0 or higher)
- [npm](http://npmjs.com) (comes with Node.js)
- [Git](https://git-scm.com/downloads)

### Step 1 - Clone the Repository

```bash
$ git clone https://github.com/Congglee/trellone.git
$ cd trellone
```

### Step 2 - Install Dependencies

Install all necessary dependencies to run the project:

```bash
$ npm install
```

### Step 3 - Configure Environment Variables

Create your environment configuration file:

```bash
$ cp .env.example .env
```

Open the `.env` file and configure your variables:

```env
# API URL Configuration
VITE_APP_DEV_API_URL="http://localhost:8000"
VITE_APP_PROD_API_URL="your-production-api-url"

# Google OAuth Configuration
# Get these from https://console.cloud.google.com/apis/credentials
VITE_GOOGLE_CLIENT_ID="your-google-client-id"
VITE_GOOGLE_REDIRECT_URI="http://localhost:8000/auth/oauth/google"
```

### Step 4 - Run the Project

**Development Mode** (with hot reload):

```bash
$ npm run dev
```

The application will be available at `http://localhost:5173`

**Production Build**:

```bash
# Build the project
$ npm run build

# Preview the production build
$ npm run preview
```

## :gear: Environment Variables Configuration

| Variable                   | Description                 | Example                          |
| -------------------------- | --------------------------- | -------------------------------- |
| `VITE_APP_DEV_API_URL`     | Development API backend URL | `http://localhost:8000`          |
| `VITE_APP_PROD_API_URL`    | Production API backend URL  | `https://api.trellone.com`       |
| `VITE_GOOGLE_CLIENT_ID`    | Google OAuth client ID      | Get from Google Cloud Console    |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth redirect URI          | Must match backend configuration |

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials for Web Application
5. Add authorized redirect URIs:
   - Development: `http://localhost:8000/auth/oauth/google`
   - Production: `https://your-api-domain.com/auth/oauth/google`

## :hammer_and_wrench: Available Scripts

### Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally

### Code Quality

- `npm run lint` - Run ESLint to check for code issues
- `npm run lint:fix` - Fix automatically fixable ESLint issues
- `npm run type-check` - Run TypeScript type checking

## :file_folder: Project Structure

```txt
📦trellone
 ┣ 📂public                          # Static assets
 ┃ ┣ 📜logo.png                      # Application logo
 ┃ ┗ 📜vite.svg                      # Vite logo
 ┣ 📂src                             # Source code
 ┃ ┣ 📂components                    # Reusable UI components
 ┃ ┃ ┣ 📂AppBar                      # Application header bar
 ┃ ┃ ┣ 📂Dialog                      # Modal dialogs
 ┃ ┃ ┣ 📂Form                        # Form components and inputs
 ┃ ┃ ┣ 📂Loading                     # Loading indicators
 ┃ ┃ ┣ 📂Modal                       # Complex modals (ActiveCard)
 ┃ ┃ ┣ 📂NavBar                      # Navigation bar with search
 ┃ ┃ ┗ 📂Workspace                   # Workspace-related components
 ┃ ┣ 📂pages                         # Route-specific page components
 ┃ ┃ ┣ 📂Auth                        # Authentication pages
 ┃ ┃ ┣ 📂Boards                      # Board management pages
 ┃ ┃ ┣ 📂Settings                    # User settings pages
 ┃ ┃ ┗ 📂Workspaces                  # Workspace pages
 ┃ ┣ 📂store                         # Redux store and slices
 ┃ ┃ ┣ 📂slices                      # Redux Toolkit slices
 ┃ ┃ ┗ 📜root.reducer.ts             # Root reducer
 ┃ ┣ 📂queries                       # RTK Query API definitions
 ┃ ┣ 📂schemas                       # Zod validation schemas
 ┃ ┣ 📂types                         # TypeScript type definitions
 ┃ ┣ 📂utils                         # Utility functions
 ┃ ┣ 📂constants                     # Application constants
 ┃ ┣ 📂hooks                         # Custom React hooks
 ┃ ┣ 📂lib                           # Core libraries (HTTP, Redux, Socket)
 ┃ ┗ 📂assets                        # Static assets (images, icons)
 ┣ 📜package.json                    # Dependencies and scripts
 ┣ 📜tsconfig.json                   # TypeScript configuration
 ┣ 📜vite.config.ts                  # Vite build configuration
 ┣ 📜eslint.config.js                # ESLint configuration
 ┗ 📜vercel.json                     # Vercel deployment config
```

## :star2: Key Features

### :zap: Real-time Collaboration

- **Live Updates**: See changes from other users instantly
- **Optimistic UI**: Immediate feedback with server reconciliation
- **Connection Resilience**: Automatic reconnection and offline handling
- **User Presence**: See who's online and active on boards

### :art: Beautiful User Interface

- **Material Design**: Clean, modern interface following Material Design principles
- **Dark/Light Themes**: Toggle between themes with smooth transitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: 60fps transitions and micro-interactions

### :clipboard: Complete Project Management

- **Board Management**: Create, customize, and organize project boards
- **Drag & Drop**: Intuitive card and column reordering
- **Rich Content**: Markdown descriptions, file attachments, due dates
- **Team Collaboration**: Invite members, assign tasks, track progress

### :shield: Security & Authentication

- **JWT Authentication**: Secure token-based authentication
- **Google OAuth**: One-click sign-in with Google
- **Email Verification**: Secure account verification process
- **Protected Routes**: Access control based on authentication status

### :rocket: Performance & Developer Experience

- **Fast Development**: Vite with hot module replacement
- **Type Safety**: 100% TypeScript coverage with strict mode
- **Code Quality**: ESLint and Prettier integration
- **Production Ready**: Optimized builds with code splitting

## :computer: Core Functionality

### Board Management

- Create and customize project boards
- Set custom backgrounds with Unsplash integration
- Manage board settings and permissions
- Real-time collaboration with team members

### Task Organization

- Create columns to organize workflow stages
- Add cards with rich content and attachments
- Drag and drop cards between columns
- Set due dates and assign team members

### Team Collaboration

- Invite team members via email
- Real-time updates across all connected users
- Comment system with emoji reactions
- Activity tracking and notifications

### Rich Content Support

- Markdown editor for detailed descriptions
- File attachments (images, documents)
- Cover photos for visual organization
- Link attachments for external resources

## :building_construction: Architecture

### State Management

- **Redux Toolkit**: Modern Redux with simplified boilerplate
- **RTK Query**: Automated API state management and caching
- **Redux Persist**: Selective state persistence across sessions

### Real-time Features

- **Socket.io**: WebSocket connections with fallback support
- **Room-based Updates**: Board-specific real-time events
- **Optimistic Updates**: Immediate UI feedback

### Form Management

- **React Hook Form**: Performant form handling
- **Zod Validation**: Type-safe schema validation
- **MUI Integration**: Seamless Material-UI component integration

### Routing & Navigation

- **React Router v6**: Modern declarative routing
- **Protected Routes**: Authentication-based access control
- **Lazy Loading**: Code splitting for optimal performance

## :construction: Development Progress

### 🚧 Currently Working On

The following features are actively being developed and will be available in upcoming releases:

- **SEO Optimization** - Implementing comprehensive SEO features for better search engine visibility
- **Workspace Management** - Enhanced workspace functionality with advanced organization tools
- **User Permissions System** - Role-based access control for Boards and Workspaces
- **Board & Workspace Visibility** - Public/private visibility settings with granular access control
- **System Optimization** - Performance improvements and code optimization across the application
- **Docker Support** - Complete containerization of the project for easy deployment and development

### 🔮 Future Roadmap (if possible 🤔)

These features are planned for future development and will significantly enhance the platform's capabilities:

- **Premium Subscription System** - Monthly Stripe-powered subscriptions with advanced features including:
  - Unlimited board creation
  - Advanced team management tools
  - Enhanced storage limits
  - Priority support
  - Advanced analytics and reporting
  - Custom integrations

---

## :rocket: Deployment

This project is configured for easy deployment on Vercel:

### Vercel Deployment

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy automatically** - Vercel will build and deploy your app

### Manual Deployment

```bash
# Build the project
$ npm run build

# The dist folder contains the production-ready files
# Upload the contents to your hosting provider
```

### Environment Configuration

Ensure all environment variables are properly configured in your deployment environment:

- `VITE_APP_PROD_API_URL` - Your production API URL
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `VITE_GOOGLE_REDIRECT_URI` - Production OAuth redirect URI

## :handshake: Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Follow the established TypeScript and ESLint configurations
2. Write comprehensive tests for new features
3. Follow the component and file organization patterns
4. Update documentation for significant changes

## :books: Documentation

- **Component Documentation**: Each component includes JSDoc comments
- **Type Definitions**: Comprehensive TypeScript interfaces
- **API Integration**: RTK Query definitions with proper typing
- **State Management**: Redux slices with clear action definitions

## :bug: Known Issues & Limitations

- Requires a backend API service (not included in this repository)
- WebSocket connection required for real-time features
- File uploads depend on backend storage configuration
- Google OAuth requires proper domain configuration

## :scroll: License

This project is open source and available under the [MIT License](LICENSE).

## :heart: Acknowledgments

This project was made possible thanks to the following resources and inspirations:

- **[Complete React + TypeScript Course](https://www.youtube.com/playlist?list=PLP6tw4Zpj-RJP2-YrhtkWqObMQ-AA4TDy)** - A comprehensive YouTube playlist/course that provided the foundation and guidance for building this project. This course was instrumental in establishing the core architecture and development patterns.

- **[Task Manager - Trello Clone](https://github.com/aashish47/task-manager)** - An excellent Trello clone project that served as a valuable reference for UI design and user experience patterns. This project provided inspiration for the visual design and interface interactions.

Special thanks to all the open-source contributors and maintainers of the technologies used in this project, including React, TypeScript, Material-UI, Redux Toolkit, and many others that make modern web development possible.

---

<div align="center">
  <p>Built with React, TypeScript, and Material-UI 🚀</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>
