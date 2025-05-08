# Architecture Documentation

## Overview

This application is a full-stack web application for the "필승해군캠프" (Victory Navy Camp) - a Korean Navy training program. The application provides information about the training program, schedules, instructors, and application procedures.

The system uses a modern JavaScript/TypeScript stack:
- React frontend with Vite for build tooling
- Express.js backend
- PostgreSQL database via NeonDB's serverless Postgres
- Drizzle ORM for database access
- Tailwind CSS for styling
- shadcn/ui component library (based on Radix UI primitives)

## System Architecture

The system follows a client-server architecture with clear separation between frontend and backend:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│                 │       │                 │       │                 │
│  React Client   │◄────► │  Express Server │◄────► │  PostgreSQL DB  │
│  (Vite)         │       │                 │       │  (Neon)         │
│                 │       │                 │       │                 │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

### Key Design Decisions

1. **Frontend-Backend Separation**: The code is organized into distinct client and server directories, enabling independent development and maintenance.

2. **API-First Approach**: The backend exposes RESTful APIs that the frontend consumes, allowing for clear interfaces between the two layers.

3. **Database Access Through ORM**: Drizzle ORM is used to interact with the PostgreSQL database, providing type safety and query building capabilities.

4. **Shared TypeScript Types**: The application uses TypeScript throughout, with shared type definitions in the `/shared` directory to ensure consistency between frontend and backend.

5. **Component-Based UI**: The frontend uses React with a component-based architecture, promoting reusability and maintainability.

## Key Components

### Frontend Architecture

The frontend is built with React and organized as follows:

- `/client/src/components/`: UI components (both application-specific and UI primitives)
- `/client/src/pages/`: Page components corresponding to different routes
- `/client/src/hooks/`: Custom React hooks
- `/client/src/lib/`: Utility functions and shared code
- `/client/src/assets/`: Static assets like images

Key technologies used:
- **React**: Core UI library
- **wouter**: Lightweight routing library
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library based on Radix UI primitives
- **Lucide**: Icon library
- **React Query**: Data fetching and state management

### Backend Architecture

The backend is built with Express.js and organized as follows:

- `/server/index.ts`: Main entry point that sets up the Express server
- `/server/routes.ts`: API route definitions
- `/server/vite.ts`: Integration with Vite for development

Key technologies used:
- **Express.js**: Web server framework
- **Drizzle ORM**: Database ORM
- **NeonDB**: Serverless PostgreSQL provider

### Database Layer

The database layer is built with Drizzle ORM and uses PostgreSQL:

- `/shared/schema.ts`: Database schema definitions
- `/db/index.ts`: Database connection setup
- `/db/seed.ts`: Database seeding script

The database schema is simple and includes:
- `users` table: For user authentication

## Data Flow

### API Request Flow

1. Client makes a request to an API endpoint
2. Express server receives the request
3. The appropriate route handler processes the request
4. If database access is needed, Drizzle ORM is used to query the database
5. The response is sent back to the client
6. React Query on the client side caches the response data

### Page Rendering Flow

1. User navigates to a route
2. The router renders the corresponding page component
3. Page component renders nested UI components
4. Components may fetch data using React Query hooks
5. Data is displayed to the user

## External Dependencies

### Frontend Dependencies

- **UI Libraries**: shadcn/ui, Radix UI, Tailwind CSS
- **Data Fetching**: React Query
- **Routing**: wouter
- **Forms**: React Hook Form, Zod

### Backend Dependencies

- **Web Server**: Express.js
- **Database**: Drizzle ORM, NeonDB PostgreSQL
- **Email**: SendGrid

### Development Tools

- **Build Tools**: Vite, esbuild
- **TypeScript**: For type safety throughout the codebase
- **ESLint & Prettier**: For code linting and formatting

## Deployment Strategy

The application is configured for deployment on Replit's hosting platform:

1. **Build Process**:
   - Frontend: Vite builds the React application
   - Backend: esbuild bundles the Express server

2. **Environment Variables**:
   - Database connection strings and other secrets are stored as environment variables

3. **Database Migrations**:
   - Drizzle Kit is used for managing database schema migrations

4. **Deployment Commands**:
   - `npm run build`: Builds both frontend and backend
   - `npm run start`: Starts the production server

5. **Development Workflow**:
   - `npm run dev`: Starts the development server with hot reloading
   - `npm run db:push`: Applies database schema changes
   - `npm run db:seed`: Seeds the database with initial data

## Security Considerations

1. **Authentication**: 
   - The application includes a user authentication system (though details are minimal in the current codebase)

2. **Database Security**:
   - Uses parameterized queries via Drizzle ORM to prevent SQL injection

3. **API Security**:
   - Server logs API requests for monitoring purposes

## Future Considerations

The architecture allows for several potential future enhancements:

1. **Expanded User Authentication**: Adding role-based access control
2. **API Versioning**: As the application grows, API versioning could be implemented
3. **Internationalization**: The application has Korean content, but could be expanded with full i18n support
4. **Performance Optimization**: Implementing server-side rendering or static generation for improved performance