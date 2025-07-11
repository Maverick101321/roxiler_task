# FullStack Intern Coding Challenge

A web application for users to rate stores, with role-based functionalities for System Administrators, Normal Users, and Store Owners.

## Tech Stack
- **Backend**: ExpressJs
- **Database**: MySQL
- **Frontend**: ReactJs (to be implemented)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `backend/.env`:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=task
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Create the MySQL database by running `schema.sql`:
   ```bash
   mysql -u root -p < ../schema.sql
   ```
5. Start the server:
   ```bash
   npm run dev
   ```
6. Access the API at `http://localhost:5000/`.

## Project Structure
- `backend/`: ExpressJs backend code
  - `config/`: Configuration files
  - `routes/`: API routes
  - `middleware/`: Authentication and validation middleware
  - `controllers/`: Request handlers
  - `models/`: Database queries
- `schema.sql`: MySQL database schema
- `frontend/`: React frontend 