Cosmic Insights
Cosmic Insights is a web application that provides personalized astrology, numerology, tarot, and dream interpretation readings using AI-powered insights. It leverages the Groq API for AI responses and MongoDB for storing past readings, with Express.js as the backend framework.
Features

Astrology Readings: Generate birth chart analyses based on user-provided birth details.
Numerology Insights: Calculate life path numbers and other numerological profiles.
Tarot Guidance: Perform AI-powered tarot readings with various spread options.
Dream Interpretation: Analyze dreams based on themes, descriptions, and emotions.
Past Readings: Store and retrieve previous readings for review.
Health Checks: Monitor the status of the server, MongoDB, and Groq API with a dedicated health endpoint.

Tech Stack

Frontend: HTML, Tailwind CSS, JavaScript
Backend: Node.js, Express.js
Database: MongoDB Atlas
AI Service: Groq API
Deployment: Vercel

Prerequisites

Node.js (v16 or higher)
Git
MongoDB Atlas account
Groq API key
Vercel account

Setup Instructions
Local Development

Clone the Repository
git clone https://huggingface.co/spaces/Snakeeu/cosmicinsights
cd cosmicinsights


Install Dependencies
npm install


Set Up Environment VariablesCreate a .env file in the root directory with the following content:
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
PORT=8000


Replace your_mongodb_connection_string with your MongoDB Atlas connection string.
Replace your_groq_api_key with your Groq API key.


Run the Application Locally
npm start

The app will be available at http://localhost:8000.

Test the Health Check EndpointOpen your browser or use a tool like Postman to access:
http://localhost:8000/api/health

Expected response (if all services are operational):
{
  "server": "Operational",
  "mongodb": "Operational",
  "groqApi": "Operational",
  "rateLimiter": "Operational"
}



Deployment on Vercel

Push the Code to a Git RepositoryIf you haven't already set up a Git repository:
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/cosmicinsights.git
git push -u origin main

Replace https://github.com/yourusername/cosmicinsights.git with your repository URL.

Set Up Vercel

Log in to Vercel (vercel login if using the CLI).

Import the repository into Vercel:
vercel

Follow the prompts to link your project.



Configure Environment Variables in Vercel

Go to your Vercel dashboard.
Navigate to your project (cosmicinsights).
Go to Settings > Environment Variables.
Add the following:
MONGODB_URI: Your MongoDB connection string.
GROQ_API_KEY: Your Groq API key.
PORT: 8000 (optional, Vercel sets this automatically).


Save the variables.


Deploy the ApplicationVercel automatically deploys after pushing changes to the repository. To trigger a redeployment:
git add README.md
git commit -m "Updated README with setup instructions"
git push origin main

Vercel will redeploy the app. Check the deployment logs in the Vercel dashboard.

Verify the Deployment

Access the deployed app (e.g., https://cosmicinsights.vercel.app).

Test the health check endpoint:
https://cosmicinsights.vercel.app/api/health


Ensure all services report as "Operational".




Usage

Access the AppOpen the app in your browser (local or deployed URL).

Navigate Sections

Use the navigation bar to access Astrology, Numerology, Tarot, Dream Interpretation, and Past Readings sections.
Each section provides a form to input relevant details (e.g., birth date for astrology, dream description for interpretation).


Submit a Reading

Fill out the form in the desired section.
Submit to receive an AI-generated reading.
Readings are automatically saved and can be viewed in the "Past Readings" section.


View Past Readings

Go to the "Past Readings" section to review previous submissions and their responses.



API Endpoints

/api/health: Check the status of the server, MongoDB, Groq API, and rate limiter.
Method: GET
Response: JSON object with service statuses.


/api/groq: Submit a prompt to the Groq API and store the response in MongoDB.
Method: POST
Body: { "prompt": "Your prompt here" }
Response: { "text": "AI response" }


/api/readings: Retrieve the 10 most recent readings from MongoDB.
Method: GET
Response: Array of reading objects.



Troubleshooting

Health Check Fails

MongoDB Failure: Verify your MONGODB_URI is correct and that your IP is whitelisted in MongoDB Atlas.
Groq API Failure: Ensure your GROQ_API_KEY is valid and that you have sufficient quota.
Check server logs for detailed error messages.


Rate Limit Errors

The app limits each IP to 100 requests per 15 minutes. Wait if you hit the limit, or test from a different IP.


Deployment Issues

Ensure environment variables are correctly set in Vercel.
Check Vercel logs for build or runtime errors.



Contributing
Feel free to fork the repository, make improvements, and submit pull requests. For major changes, please open an issue to discuss your ideas.
License
This project is licensed under the ISC License. See the package.json for details.

Last updated: April 18, 2025
