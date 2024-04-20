import anthropic
import os
from dotenv import load_dotenv
from typing import List, Dict

load_dotenv()

api_key = os.getenv("ANTHROPIC_API_KEY")

system_message = """Given a resume, I'm specifically interested in extracting the following details in JSON format:
- Name
- Location
- Email address
- Phone number
- School name , degree and year of graduation (for all degrees in Resume)
- Skills
- Experience (company name , designation and years only)

# Sample response format
{
    "name": "John Doe",
    "location": "City, State",
    "email": "john.doe@example.com",
    "phone": "123-456-7890",
    "education": [
        {"school": "University A", "degree": "B.S. in Computer Science", "graduation_year": "2000-2002"},
        {"school": "University B", "degree": "M.S. in Engineering", "graduation_year": "2022-2024"}
    ],
    "skills": ["Python", "JavaScript", "Data Analysis"],
    "experience": [
        {"company": "Company X", "designation": "Software Engineer", "years": "2018-2020"},
        {"company": "Company Y", "designation": "Data Analyst", "years": "2021-present"}
    ]
}

Please focus only on these elements and avoid including information about certifications. Projects in resume wont be considered as working experience."""

_SYSTEM_PROMPT = """You are an expert at recommending job search keywords based on resume information. I will provide you with a resume data extracted from a resume. Your task is to analyze this information and output two relevant keywords that the resume holder could use to search for suitable job opportunities. Consider the candidate's experience level when selecting keywords. For instance, if the resume indicates limited experience, include terms like "entry level" or "junior" in the keywords. Conversely, if the resume showcases extensive experience, incorporate terms such as "senior" or "experienced" in the keywords. Please format your response as a JSON object with two keys: "first_keyword" and "second_keyword", and their corresponding keyword values as strings.

Here's an example of the expected response format:
{
"first_keyword": "keyword1",
"second_keyword": "keyword2"
}

Focus on selecting keywords that accurately reflect the candidate's qualifications and experience level based on the provided resume information."""



def get_keyword_from_llm(query: str):
    client = anthropic.Anthropic(
    api_key=api_key,
)
    message = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=90,
        temperature=0,
        system=_SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": query
                    }
                ]
            }
        ]
    )
    return message.content[0].text

def chatbot(job_description: str, user_query: str, user_resume: str, chat_history: List[Dict[str, str]] = None):
    if chat_history is None:
        chat_history = []
    


    print(chat_history)
    client = anthropic.Anthropic(
        api_key=api_key,
    )

    system_prompt = f"You are a conversational AI assistant.\n" \
                    f"Helping users with their job search based on the provided job description as well as their resume.\n" \
                    f"Engage in a conversation with the user, provide relevant information, and answer their questions accurately.\n" \
                    f"Strictly Use the job description and user resume as context for your responses.\n" \
                    f"Keep your responses concise and informative, limiting them to a maximum of 300 words.\n\n"\
                    f"Job Description:\n{job_description}\n\n\nUser_Resume:\n{user_resume}"

    messages = []
    last_role = None
    for message in chat_history:
        if "sender" in message and "content" in message:
            role = "assistant" if message["sender"] == "chatbot" else "user"

            if role != last_role:
                messages.append({"role": role, "content": message["content"]})
                last_role = role  
        else:
            print(f"Skipping message due to missing 'sender' or 'content' key: {message}")


    if last_role != "user" and user_query:
        messages.append({"role": "user", "content": user_query})
    
    print(messages)
        
    response = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=500,
        temperature=0.3,
        system=system_prompt,
        messages=messages
    )

    assistant_response = response.content[0].text
    
    return assistant_response


def get_completion_from_llm(query: str):
    client = anthropic.Anthropic(
    api_key=api_key,
)
    message = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=1000,
        temperature=0,
        system=system_message,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": query
                    }
                ]
            }
        ]
    )
    return message.content[0].text


