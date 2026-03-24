# ProjectMate

A dynamic web application designed to help university students discover, match, and collaborate on projects with full transparency.

## Tech Stack & Key Packages

All dependencies are automatically installed via the `npm install` command natively, but here are the core packages empowering ProjectMate:

**Frontend Ecosystem**
- **React (via Vite)**: Lightning-fast rendering.
- **react-router-dom**: For seamless single-page navigation.
- **lucide-react**: Clean, modern iconography perfectly optimized for UI.

**Backend Ecosystem**
- **Express.js**: Minimalist node server routing framework.
- **Mongoose**: Elegant MongoDB object modeling strictly wrapping the `Student` schemas.
- **Multer**: Handing `multipart/form-data` to physically write user avatar image uploads directly into the local `/uploads` folder seamlessly.
- **jsonwebtoken (JWT) & bcryptjs**: Required for rigorous endpoint authentication and securely encrypted passwords.
- **cors**: Enabling the frontend and backend servers to asynchronously intercommunicate without restrictions.

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or newer recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or a MongoDB Atlas URI)

### 1. Database Configuration
In the `backend` directory, create a `.env` file and insert your MongoDB URI and a random secret key for JWT:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 2. Backend Setup
The backend runs an Express.js API on port 3000. It seamlessly handles profiles, matching logic, and file uploads.
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup
The frontend is a completely responsive React interface powered by Vite. It should automatically operate on port `5182` or an available port.
```bash
cd frontend
npm install
npm run dev
```

### 4. Application Usage
- Open [http://localhost:5182](http://localhost:5182) in your browser.
- Register an account using your university email (e.g., `it12345678@my.sliit.lk`).
- Fully augment your profile with avatar uploads and social links.
- Look up project teams to seamlessly integrate!
