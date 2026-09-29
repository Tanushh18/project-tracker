# Project Tracker

One dashboard to track every project you've built — where it's hosted, which account it lives under, which database it uses, and every other small detail that's easy to forget across 4-5 different accounts (Render, Firebase, Vercel, AWS, etc).

## Overview

Project Tracker is a centralized project management dashboard designed for developers who maintain multiple projects across different platforms and services. Instead of juggling spreadsheets and scattered notes, keep everything in one place: project details, hosting info, database configurations, account credentials (references), deployment status, and custom fields.

## Features

### Project Management
- **Comprehensive Project Tracking**: Track name, description, category, tech stack, status, priority, and tags
- **Repository Management**: Store repository URLs and account details
- **Live URLs & Custom Domains**: Track both live URLs and custom domain configurations
- **Hosting Details**: Provider, account email, service name, plan, region, and auto-deploy branch
- **Multiple Databases**: Track multiple database entries per project with provider, type, account email, and connection notes
- **Firebase & Google Cloud**: Dedicated fields for Firebase project IDs and Google Cloud configurations
- **Play Store Integration**: Track Android Play Store package names and deployment status
- **DNS Management**: Store DNS provider and account information
- **Environment Variables**: Reference where environment variables are stored and list variable names (never store actual secrets)
- **Monitoring Setup**: Track monitoring provider and account details
- **Deployment History**: Last deployed timestamp and custom notes
- **Custom Fields**: Add any project-specific metadata on the fly
- **Status Tracking**: Six project statuses - Planning, In Progress, Deployed, Broken, Paused, Archived
- **Priority Levels**: Low, Medium, High priority indicators

### Account Registry
- **Service Registry**: Maintain a central list of all third-party services you use
- **Account Tracking**: Email, label (personal/college/client), plan, and notes for each service
- **Quick Lookup**: Easily find which account is associated with each service
- **Multi-Account Support**: Track multiple accounts for the same service

### User Interface
- **Real-Time Search**: Search projects by name, tags, hosting provider, database provider, account email, tech stack, and more
- **Status Filtering**: Filter projects by deployment status
- **Modal Editing**: Intuitive modal forms for creating and editing projects and accounts
- **Detail View**: Comprehensive project detail modal showing all tracked information
- **Responsive Design**: Works on desktop and tablet screens
- **Dynamic Forms**: Add/remove database entries and custom fields as needed

## Tech Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js** (v4.19.2): Web framework and API server
- **MongoDB** (via Mongoose v8.6.0): NoSQL database for data persistence
- **CORS** (v2.8.5): Cross-Origin Resource Sharing middleware
- **dotenv** (v16.4.5): Environment variable management

### Frontend
- **HTML5**: Markup structure
- **CSS3**: Styling and layout (custom, no frameworks)
- **Vanilla JavaScript**: Client-side interactivity and API communication
- **No Build Step**: Direct browser execution, no transpilation needed

### Deployment
- **Render**: Recommended hosting platform
- **MongoDB Atlas**: Cloud MongoDB service (recommended)

## Project Structure

```
project-tracker/
├── server.js              # Express backend, API routes, MongoDB setup
├── models.js              # Mongoose schemas (Project, Account, Database, ExtraField)
├── package.json           # Node.js dependencies and scripts
├── render.yaml            # Render deployment configuration
├── .env.example           # Environment variable template
├── .gitignore             # Git ignore rules
├── public/
│   ├── index.html         # HTML markup and modal templates
│   ├── app.js             # Frontend logic, API calls, UI interactions
│   └── style.css          # Styling and layout
└── README.md              # This file
```

### Directory Details

#### `server.js`
The main Express application that:
- Connects to MongoDB using Mongoose
- Defines REST API endpoints for projects and accounts
- Serves static files from the `public` directory
- Handles CORS for cross-origin requests
- Implements error handling and validation

#### `models.js`
Mongoose schema definitions:
- **ProjectSchema**: Comprehensive project document with 40+ fields
- **AccountSchema**: Service account registry
- **DatabaseEntrySchema**: Nested database configuration per project
- **ExtraFieldSchema**: Dynamic custom field support per project

#### `public/`
Frontend assets:
- **index.html**: Single-page application markup
- **app.js**: ~380 lines of vanilla JavaScript for UI and API communication
- **style.css**: ~200 lines of CSS with CSS variables for theming

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (free tier available) or local MongoDB instance
- Git (for cloning the repository)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tanushh18/project-tracker.git
   cd project-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your MongoDB connection string:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/project-tracker
   PORT=3000
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   
   The application will be available at `http://localhost:3000`

5. **Open in browser**
   - Navigate to `http://localhost:3000`
   - Start adding projects and accounts

## Usage

### Adding a Project

1. Click the **"+ Add Project"** button
2. Fill in the project details:
   - **Name** (required): Project name
   - **Description**: What the project does
   - **Category**: Project category
   - **Tech Stack**: Technologies used (e.g., "Node.js, React, MongoDB")
   - **Status**: Select from Planning, In Progress, Deployed, Broken, Paused, Archived
   - **Priority**: Low, Medium, or High
   - **Tags**: Comma-separated labels
3. Add repository information
4. Configure hosting details
5. Add database entries (click "Add database" for multiple)
6. Fill in Firebase/Google Cloud, Play Store, DNS, and monitoring details as needed
7. Add custom fields if needed (click "Add custom field")
8. Click **"Save"** to create the project

### Searching and Filtering Projects

- **Search bar**: Type to search across project names, tags, hosting provider, database provider, account emails, tech stack, and more
- **Status filter**: Use the dropdown to filter by project status
- **Cards**: Click any project card to view full details

### Editing a Project

1. Click a project card to view details
2. Click the **"Edit"** button to modify
3. Make changes
4. Click **"Save"**

### Deleting a Project

1. Open the project edit modal
2. Click **"Delete Project"** button
3. Confirm deletion

### Managing Accounts

1. Click the **"Accounts"** tab
2. Click **"+ Add Account"** to add a new service account
3. Fill in:
   - **Service** (required): Name of the service (e.g., Render, Firebase, MongoDB Atlas)
   - **Email**: Login email
   - **Label**: Personal identifier (e.g., "personal", "college", "client-X")
   - **Plan**: Service plan (e.g., "free", "pro", "enterprise")
   - **Notes**: Additional notes
4. Click **"Save"**

### Searching Accounts

Use the search field to filter accounts by service name or email.

## Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Required
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/project-tracker

# Optional (defaults to 3000)
PORT=3000
```

### Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URI` | Yes | - | MongoDB connection string |
| `PORT` | No | 3000 | Server port number |

### MongoDB URI Format

For MongoDB Atlas:
```
mongodb+srv://username:password@cluster-name.mongodb.net/project-tracker
```

For local MongoDB:
```
mongodb://localhost:27017/project-tracker
```

## API Documentation

The application provides a RESTful API for projects and accounts.

### Base URL
```
http://localhost:3000/api
```

### Projects Endpoints

#### GET /api/projects
Retrieve all projects, sorted by most recently updated.

**Response**: Array of project objects

**Example**:
```bash
curl http://localhost:3000/api/projects
```

#### GET /api/projects/:id
Retrieve a specific project by ID.

**Parameters**:
- `id` (string): MongoDB ObjectID

**Response**: Project object

**Example**:
```bash
curl http://localhost:3000/api/projects/507f1f77bcf86cd799439011
```

#### POST /api/projects
Create a new project.

**Request Body**:
```json
{
  "name": "My App",
  "description": "A web application",
  "category": "Web",
  "tech_stack": "Node.js, React, MongoDB",
  "status": "in_progress",
  "priority": "high",
  "hosting_provider": "Render",
  "databases": [
    {
      "label": "main",
      "provider": "MongoDB Atlas",
      "type": "Mongo",
      "account_email": "user@example.com"
    }
  ]
}
```

**Response**: Created project object with `_id`

#### PUT /api/projects/:id
Update an existing project.

**Parameters**:
- `id` (string): MongoDB ObjectID

**Request Body**: Same as POST (partial updates allowed)

**Response**: Updated project object

#### DELETE /api/projects/:id
Delete a project.

**Parameters**:
- `id` (string): MongoDB ObjectID

**Response**: 204 No Content

### Accounts Endpoints

#### GET /api/accounts
Retrieve all accounts, sorted by service name.

**Response**: Array of account objects

**Example**:
```bash
curl http://localhost:3000/api/accounts
```

#### POST /api/accounts
Create a new account entry.

**Request Body**:
```json
{
  "service": "Render",
  "email": "user@example.com",
  "label": "personal",
  "plan": "free",
  "notes": "Main hosting account"
}
```

**Response**: Created account object with `_id`

#### PUT /api/accounts/:id
Update an account.

**Parameters**:
- `id` (string): MongoDB ObjectID

**Request Body**: Same as POST (partial updates allowed)

**Response**: Updated account object

#### DELETE /api/accounts/:id
Delete an account entry.

**Parameters**:
- `id` (string): MongoDB ObjectID

**Response**: 204 No Content

## Database Schema

### Project Document

```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  category: String,
  tech_stack: String,
  status: String (planning | in_progress | deployed | broken | paused | archived),
  priority: String (low | medium | high),
  tags: String,
  
  // Repository
  repo_url: String,
  repo_account: String,
  
  // Live deployment
  live_url: String,
  custom_domain: String,
  
  // Hosting
  hosting_provider: String,
  hosting_account_email: String,
  hosting_account_label: String,
  hosting_service_name: String,
  hosting_plan: String,
  hosting_region: String,
  auto_deploy_branch: String,
  
  // Databases
  databases: [
    {
      label: String,
      provider: String,
      type: String,
      account_email: String,
      notes: String
    }
  ],
  
  // Firebase
  firebase_project_id: String,
  firebase_account_email: String,
  
  // Google Cloud
  google_cloud_project_id: String,
  google_cloud_account_email: String,
  
  // Play Store (Android)
  play_store_package_name: String,
  play_store_account_email: String,
  play_store_url: String,
  play_store_status: String,
  
  // DNS
  dns_provider: String,
  dns_account_email: String,
  
  // Environment
  env_vars_location: String,
  env_var_names: String,
  
  // Monitoring
  monitoring_provider: String,
  monitoring_account_email: String,
  
  // Metadata
  last_deployed_at: String,
  notes: String,
  created_at: Date,
  updated_at: Date,
  
  // Custom fields
  extra_fields: [
    {
      label: String,
      value: String
    }
  ]
}
```

### Account Document

```javascript
{
  _id: ObjectId,
  service: String (required),
  email: String,
  label: String,
  plan: String,
  notes: String,
  created_at: Date
}
```

## Deployment

### Deploying to Render

Render is the recommended hosting platform for Project Tracker.

#### Prerequisites
- GitHub account with the project repository
- MongoDB Atlas account (free tier works)
- Render account (create at https://render.com)

#### Deployment Steps

1. **Prepare MongoDB Atlas**
   - Create a free cluster at https://www.mongodb.com/cloud/atlas
   - Go to Database Access → Add a user with a strong password
   - Go to Network Access → Allow access from 0.0.0.0/0 (for Render)
   - Go to Connect → Drivers → Copy the connection string
   - Replace `<password>` with your user password

2. **Push to GitHub**
   ```bash
   git push origin main
   ```

3. **Create Render Web Service**
   - Log in to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Name the service: `project-tracker`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free (or paid for persistence)

4. **Configure Environment Variables**
   - In Render dashboard → Environment tab
   - Add environment variable:
     - Key: `MONGO_URI`
     - Value: Your MongoDB Atlas connection string
   - Add environment variable:
     - Key: `PORT`
     - Value: `10000` (Render default, optional)

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically detect `render.yaml` and build/start the app
   - Get your live URL from the Render dashboard

6. **Test the Deployment**
   - Visit your Render URL
   - Create a test project
   - Verify data persists after refreshing

#### Alternative: Render with Auto-Deploy
To enable automatic deployment on every push:
- In Render dashboard → Settings → Auto-Deploy
- Select branch to auto-deploy (e.g., `main`)

### Other Hosting Options

The application can be deployed to any Node.js hosting platform:

- **Heroku**: Use Procfile and add `MONGO_URI` config vars
- **Railway**: Connect GitHub repo, add `MONGO_URI` env var
- **Fly.io**: Create `fly.toml` configuration
- **AWS Elastic Beanstalk**: Deploy Node.js application
- **DigitalOcean App Platform**: Create app from GitHub
- **Self-hosted VPS**: Run `npm start` on any Node.js server

All platforms require:
- Node.js v14+
- MongoDB Atlas or self-hosted MongoDB
- Environment variables configured

## Troubleshooting

### Connection Issues

**Error**: `MONGO_URI is not set. Add it to your environment`

**Solution**:
1. Ensure `.env` file exists in the project root
2. Verify `MONGO_URI` is correctly set
3. For Render deployments, check Environment variables in dashboard
4. Restart the application

**Error**: `MongoDB connection error: connect ECONNREFUSED`

**Solution**:
1. Verify your MongoDB URI is correct
2. Check that MongoDB Atlas cluster is running
3. Verify network access is allowed (0.0.0.0/0)
4. Test connection string directly

### Port Issues

**Error**: `listen EADDRINUSE: address already in use :::3000`

**Solution**:
1. Change PORT in `.env`: `PORT=3001`
2. Or kill the existing process on port 3000
3. Restart the server

### Frontend Issues

**Problem**: Blank page or no projects load

**Solution**:
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed API calls
4. Verify server is running and responsive
5. Hard refresh the page (Ctrl+Shift+R)

**Problem**: Can't edit or delete projects

**Solution**:
1. Verify MongoDB connection is active
2. Check browser console for errors
3. Try in an incognito/private window
4. Clear browser cache and cookies

### Database Issues

**Problem**: Data not persisting after restart

**Solution**:
1. Verify `MONGO_URI` points to MongoDB Atlas or persistent database
2. Check that data is actually being written to the database
3. Verify MongoDB user credentials are correct
4. Check MongoDB Atlas cluster is running (not paused)

**Problem**: Slow queries or timeouts

**Solution**:
1. Check MongoDB Atlas monitoring dashboard
2. Optimize database indexes
3. Verify network latency to MongoDB
4. Consider upgrading to paid tier for better performance

## Security

### Important Security Notes

1. **Never Store Secrets**: This application intentionally does NOT store actual passwords, API keys, or secrets. Only store references to where credentials are kept.

2. **Example**: Instead of storing a database password:
   ```
   DON'T: password: "mongodb+srv://user:myP@ssw0rd@..."
   DO: notes: "See .env file" or "Render Environment tab"
   ```

3. **Environment Variables**: Keep `.env` file in `.gitignore` and never commit it.

4. **MongoDB Atlas Security**:
   - Use strong user passwords
   - Restrict network access to your IP when possible
   - Enable IP allowlisting instead of 0.0.0.0/0 in production
   - Use database access controls and roles

5. **Production Hardening** (if storing actual secrets in the future):
   - Add authentication/authorization to the app
   - Use HTTPS only
   - Implement rate limiting
   - Add encryption for sensitive fields
   - Enable audit logging
   - Implement backup and recovery procedures

6. **Data Privacy**:
   - This app stores project metadata only
   - No user authentication currently
   - Deploy only where you trust network access
   - Consider adding authentication before sharing/exposing publicly

## Contributing

### Getting Started with Development

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and test locally
4. Commit with clear messages: `git commit -m "feat: add new feature"`
5. Push to your fork: `git push origin feature/your-feature`
6. Create a Pull Request

### Development Guidelines

- Test changes locally before pushing
- Maintain code style consistency
- Add comments for complex logic
- Keep commits focused and atomic
- Write clear commit messages

### Testing

Currently, there are no automated tests. Before deploying:
1. Test CRUD operations for projects
2. Test CRUD operations for accounts
3. Test search and filtering
4. Test on multiple browsers
5. Test on mobile devices

### Future Improvements

Potential enhancements:
- User authentication and multi-user support
- Project templates
- Team collaboration features
- Export/import functionality (CSV, JSON)
- Automated backups
- Project analytics
- Integration with GitHub API
- Dark mode toggle
- Mobile app
- Notifications for deployment reminders

## Deployment Checklist

Before deploying to production:

- [ ] Test all CRUD operations locally
- [ ] Set strong MongoDB passwords
- [ ] Configure MongoDB network access
- [ ] Set `.env` variables in hosting platform
- [ ] Test live URL works
- [ ] Create test project in production
- [ ] Verify search functionality works
- [ ] Test on multiple devices/browsers
- [ ] Set up monitoring
- [ ] Create backup strategy
- [ ] Document account credentials (not in app)

## License

This project is open source and available under the MIT License.

## Support

For issues, feature requests, or questions:
- GitHub Issues: https://github.com/Tanushh18/project-tracker/issues
- GitHub Discussions: https://github.com/Tanushh18/project-tracker/discussions

## Author

Created by Tanushh18

## Changelog

### v1.0.0 (Current)
- Initial release
- Project tracking with 40+ configurable fields
- Account registry
- Search and filtering
- Custom fields support
- Render deployment ready
- MongoDB persistence
