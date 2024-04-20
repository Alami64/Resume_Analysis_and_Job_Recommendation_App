# Job Recommendation and Resume Analysis System

This repository contains an application designed to help users analyze their resumes and find relevant job opportunities. It leverages the power of large language models (LLMs) and document similarity analysis to provide personalized recommendations.

## Features

* **Resume Keyword Extraction**: Upload your resume in PDF format and the application will automatically extract key information, such as skills, experience, and education, to generate relevant keywords for job search.
* **Job Recommendation Engine**: Based on the extracted keywords and user-defined filters (location, number of results), the application recommends suitable job listings by scraping data from Google Search and ranking them using Doc2Vec similarity analysis.
* **Conversational AI Assistant**: Engage in a conversation with an AI assistant powered by a large language model. Ask questions about your job search or career path, and get insightful responses based on your resume and provided job descriptions.
* **Resume Analysis and Improvement**: Get feedback on your resume and suggestions for improvement through the conversational AI assistant.

## Technologies Used

* **Python**: The application is built using Python, along with several libraries such as FastAPI, Selenium, BeautifulSoup, and Gensim.
* **Large Language Models (LLMs)**: Anthropic's Claude model is used for keyword extraction, job search assistance, and resume analysis.
* **Doc2Vec**: This algorithm is employed to measure the similarity between the user's resume and potential job descriptions, ensuring the most relevant recommendations.
* **OpenCage Geocoding API**: Used to determine the user's city based on their location data.

## Installation and Usage

### Clone the Repository

```bash
git clone https://github.com/Alami64/Resume_Analysis_and_Job_Recommendation_App.git
```

### Install Dependencies

```bash
pip install -r requirements.txt
```
```bash
npm install
```

### Set up API Keys

* Create an account with Anthropic and obtain an API key. Set the `ANTHROPIC_API_KEY` environment variable with your API key.
* Get an API key from OpenCage and set the `GEO_LOCATION_API` environment variable.

### Run the Application

```bash
uvicorn main:app --reload
```
```bash
npm run dev
```

### Access the Application

Open your web browser and navigate to [http://localhost:8000/].

Upload your resume and start exploring the features!
