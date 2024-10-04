# Math Quiz Web Application

This is a web-based maths quiz application built with **React** using **Next.js** for the frontend, **Supabase** for the backend, and **Google Gemini API** for generating and validating dynamic math questions. The application allows users to participate in quizzes, track their scores, and view a leaderboard of the highest scorers.

## Features

- **Dynamic Question Generation**: The app generates new math questions using the Google Gemini API, ensuring a unique experience every time.
- **Answer Validation**: After submitting answers, the app checks the correctness via Gemini AI and provides feedback.
- **Leaderboard**: Displays a ranked list of top users based on their highest scores, fetched from Supabase.
- **Score Tracking**: Keeps track of users' scores and compares them with the highest score saved in the database.
- **Real-Time Question Check**: Every 10 seconds, the app checks if the current question has been solved by another user and provides feedback if necessary.

## Tech Stack

- **Frontend**: React with Next.js
- **Backend**: Supabase (PostgreSQL-based real-time backend)
- **AI Integration**: Google Gemini API for generating and checking math questions
- **State Management**: React Hooks

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v14 or above)
- **npm** or **yarn**
- **Supabase** account and project set up
- **Google Gemini API** access with an API key

## Environment Setup

Create a `.env.local` file at the project root and include the following:

```sh
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
GEMINI_API_KEY=<your_gemini_api_key>
```

##  Project Setup
	1. **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/math-quiz.git
    cd math-quiz
    ```
	2.	**Install dependencies:**
        - Using npm: npm install
        - Using yarn: yarn install

    3.	**Set up Supabase:**
	    - Create a users table with columns: id (UUID), name (Text), highest_score (Integer).
	    - Create a questions table with columns: id (UUID), question (Text), correct_answer (Text), active (Boolean), solved_by (Text).
	4.	Start the development server:
        ```sh
                npm run dev
        ```
The app will be running at http://localhost:3000.