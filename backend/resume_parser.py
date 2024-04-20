from typing import Dict, Union, List



class ParseResume:

    def __init__(self, resume_json: Dict[str, Union[str, int, List[str], Dict[str, Union[str, int, List[str]]]]]):
        self.resume_json = resume_json

    
    def extract_name(self):
        return self.resume_json.get('name', 'No Name Found')
    
    def extract_email(self):
        return self.resume_json.get('email', 'No Email Found')
    
    def extract_phone_number(self):
        return self.resume_json.get('phone', 'No Phone Number Found')
    
    def extract_skills(self):
        return self.resume_json.get('skills', [])
    
    def extract_location(self):
        return self.resume_json.get('location', 'No Location Found')
    
    def extract_education(self):
        education_list = self.resume_json.get('education', [])
        formatted_education = []
        for edu in education_list:
            school = edu.get('school', 'No School Found')
            degree = edu.get('degree', 'No Degree Found')
            graduation_year = edu.get('graduation_year', 'No Graduation Year Found')
            formatted_education.append(f"{degree} from {school} {graduation_year}")
        return formatted_education
    
    def extract_experience(self):
        experience_list = self.resume_json.get('experience', [])
        formatted_experience = []
        for exp in experience_list:
            company = exp.get('company', 'No Company Found')
            designation = exp.get('designation', 'No Designation Found')
            years = exp.get('years', 'No Years Found')
            formatted_experience.append(f"{designation} at {company} ({years})")
        return formatted_experience
    
    def get_formatted_resume(self):
        name = self.extract_name()
        email = self.extract_email()
        phone_number = self.extract_phone_number()
        skills = self.extract_skills()
        location = self.extract_location()
        education = self.extract_education()
        experience = self.extract_experience()

        formatted_resume = """
Keys extracted from resume

    - Name: {}
    - Email: {}
    - Phone: {}
    - Location: {}

TECHNICAL SKILLS

    - {}

EDUCATION

    """.format(name, email, phone_number, location, ', '.join(skills))

        for edu in education:
            formatted_resume += "• {}\n".format(edu)

        formatted_resume += """
EXPERIENCE

    """

        for exp in experience:
            formatted_resume += "• {}\n".format(exp)

        return formatted_resume

