import json
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from typing import  Optional, List, Dict
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import fitz
import tempfile
from resume_parser import ParseResume
from jobsearch import JobExtractor
from typing import Optional 
from llm_response import get_completion_from_llm
from llm_response import chatbot
from geolocation import get_city_name


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

class Location(BaseModel):
    latitude: float
    longitude: float

class ChatbotRequest(BaseModel):
    job_description: str
    user_query: str
    user_resume : bytes
    chat_history: List[Dict[str, str]] = []

def read_single_pdf(upload_file):
    text = ""  
    try:
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            
            content = upload_file.read()  
            temp_file.write(content)
            temp_file_path = temp_file.name  
            doc = fitz.open(temp_file_path)
            for page_num in range(doc.page_count):
                page = doc[page_num]
                
                text += page.get_text()

    except Exception as e:
        print("Error reading file")

    return text  

# @app.get("/")
# def read_root():
#     return {"Hello": "World"}

@app.post("/query")
async def handle_query(
    message: str = Form(...),
    chatHistory: str = Form(...),
    jobDescription: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)):
    
    
    message_data = json.loads(message)
    chat_history_data = json.loads(chatHistory)

    
    resume_text = ""
    if file:
        file_content = await file.read()
        print(f"Received File: {file.filename}")
        
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(file_content)
            temp_file_path = temp_file.name

        doc = fitz.open(temp_file_path)
        for page_num in range(doc.page_count):
            page = doc[page_num]
            resume_text += page.get_text()

    
    user_query = message_data.get("content", "")

    
    response = chatbot(jobDescription, user_query, resume_text, chat_history_data)

    return {"response": response}

    
@app.post("/resume_process/")
async def resume_pdf_to_text(file: UploadFile = File(...)):
    data = read_single_pdf(file.file)
    json_txt = get_completion_from_llm(data)
    start_index = json_txt.find("{")
    json_txt = json_txt[start_index:]
    json_data = json.loads(json_txt)
    parser = ParseResume(json_data)
    formatted_resume = parser.get_formatted_resume()
    return {"parsed_keywords": formatted_resume,
            "keywords": json_data}

@app.post("/extract_jobs/")
async def extract_jobs(
        keywords: str = Form(...), 
        location: str = Form(...),
        datePosted: Optional[int] = Form(None),
        results: Optional[int] = Form(None),
        resume_file: Optional[UploadFile] = File(None)
    ):

    
    if not 0 < len(location) <= 100:  
        raise HTTPException(status_code=422, detail="Invalid 'location' length.")
        
    if datePosted not in [None, 24, 48, 168]:  
        raise HTTPException(status_code=422, detail="Invalid 'datePosted' value.")
        
    if results is not None and (results < 1 or results > 100): 
        raise HTTPException(status_code=422, detail="Invalid 'results' range.")
    
    try:  
        
        resume_data = read_single_pdf(resume_file.file)  
        job_extractor = JobExtractor(resume_data, location, datePosted, int(results))
        job_data = job_extractor.get_job()
        # print(job_data)
        return {"job_data": job_data}
    except Exception as e:  
        print(f"Error during job extraction: {e}") 
        raise HTTPException(status_code=500, detail="An error occurred while extracting jobs.")


@app.post("/get-city/")
async def get_city(location: Location):
    print(f"Latitude: {location.latitude}, Longitude: {location.longitude}")
    try:

        city_name = await get_city_name(location.latitude, location.longitude)
        if city_name in ["API key not found", "Could not retrieve the city name", "City name not found"]:
            raise HTTPException(status_code=404, detail=city_name)
        return {"city": city_name}
    except Exception as e:
        print(f"Error during city extraction: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while extracting city name.")
    

