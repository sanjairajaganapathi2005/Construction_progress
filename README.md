# Construction Monitoring System using AI

This project is a full-stack web application for tracking the progress of construction projects. It features:

- **Frontend:** React (Vite) for a modern, responsive user interface
- **Backend:** Node.js/Express for REST APIs
- **ML Service:** Python Flask for image-based stage prediction


## About the Project

Construction Progress Tracker is designed to help construction companies, project managers, and stakeholders monitor the real-time progress of building projects. By leveraging AI-powered image recognition, the platform can automatically detect the current stage of construction from uploaded site photos, reducing manual tracking and improving accuracy.

### Key Technologies
- **React (Vite):** Fast, modern frontend with responsive design for all devices.
- **Node.js/Express:** RESTful API backend for user, project, and task management.
- **MongoDB:** Database for storing users, projects, tasks, and roles.
- **Python Flask:** Microservice for running a trained CNN model to predict construction stages from images.

### Main Modules
- **Authentication:** Secure login/register for users and admins, with role-based access.
- **Stage Prediction:** Upload images to get instant AI-based predictions of construction stage.
- **Progress Visualization:** See project progress by stage, with history and statistics.
- **Task Management:** Add/view tasks and history for each project stage.
- **Admin Panel:** Manage users, roles, and oversee all projects.

### Example Use Cases
- A site engineer uploads a photo from the construction site; the system predicts the current stage and updates the project timeline.
- An admin reviews all ongoing projects, checks progress rates, and manages user roles.
- Stakeholders can view a visual dashboard of project status and completed stages.


## Features

- User authentication and roles (admin, user)
- Upload construction images and predict current stage using AI
- Visualize project stages and progression
- View and manage task history
- Responsive navigation bar for mobile and desktop
- Admin dashboard for user and project management
- Image similarity check for duplicate or progress validation
- Real-time progress rate calculation
- Mobile-friendly UI and touch support
- Secure session management and protected routes
- Error handling and user feedback for uploads and predictions
- Easy project and stage switching
- Logout and session timeout support

## Project Structure

```
Construction_progress/
├── backend/         # Node.js/Express API
│   ├── models/      # Mongoose models
│   ├── controller/  # Route controllers
│   ├── routes/      # API routes
│   ├── services/    # Business logic
│   └── config/      # DB config
├── client/          # React frontend (Vite)
│   ├── src/
│   └── public/
├── flask/           # Python Flask ML service
│   ├── app.py
│   ├── similarity.py
│   └── lightweight_cnn_hybrid.h5
├── img/             # Example construction images by stage
└── README.md
```

## Getting Started

### Prerequisites
- Node.js & npm
- Python 3.x

### Backend Setup
```
cd backend
npm install
npm start
```

### Frontend Setup
```
cd client
npm install
npm run dev
```

### ML Flask Service Setup
```
cd flask
pip install -r requirements.txt
python app.py
```



## Usage

### Step-by-Step
1. **Start all services:**
   - Run the backend server (`npm start` in `backend/`)
   - Run the frontend (`npm run dev` in `client/`)
   - Start the Flask ML service (`python app.py` in `flask/`)
2. **Register or log in:**
   - Create a new account or log in as an existing user/admin.
3. **Create or select a project:**
   - Admins can create new projects; users can join or select assigned projects.
4. **Upload construction images:**
   - Go to the prediction page, upload a site photo, and get instant stage prediction.
5. **Review predictions and history:**
   - See the predicted stage, compare with previous uploads, and view task history.
6. **Manage tasks and stages:**
   - Add, edit, or complete tasks for each stage. Admins can update project details.
7. **Monitor progress:**
   - Use the dashboard to track overall progress, stage completion, and user activity.
8. **Log out securely:**
   - End your session from the navigation bar.

### More Use Cases
- Project managers can monitor multiple projects and compare progress rates.
- Admins can add or remove users, assign roles, and reset passwords.
- Users can review historical images and predictions for audit or reporting.
- Teams can validate progress with image similarity checks to avoid duplicate uploads.
- Stakeholders can access a dashboard to see which stages are delayed or ahead of schedule.
- The system can be used for training new engineers on construction stage identification.
- Useful for remote monitoring of construction sites where physical visits are limited.
- Generate reports of project progress for meetings or compliance.
- Use as a digital logbook for construction documentation.

## License
This project is for educational/demo purposes.
