import json
from llm_response import get_keyword_from_llm
from requests.exceptions import HTTPError
import time
import pandas as pd
from jobrecom import search_jobs, preprocess_text
from gensim.models.doc2vec import Doc2Vec
from numpy.linalg import norm
import numpy as np
import logging



class JobExtractor:
    
    def __init__(self, resume,location="California", dataPosted=24, results=5):
        self.resume = resume
        self.location = location
        self.dataPosted = dataPosted
        self.results = results
    
    

    def get_job(self):
        query = f"{self.resume}"
        keyword_search = get_keyword_from_llm(query)
        print(keyword_search)
        keyword_data = json.loads(keyword_search)
        first_keyword = keyword_data.get("first_keyword")
        second_keyword = keyword_data.get("second_keyword")

        # print(self.location)
        df = pd.DataFrame(columns=['Job Name', 'Job Link', 'Job Description', 'Company Name'])

        for i, skill in enumerate([first_keyword, second_keyword]):
            
            
            job_details = search_jobs(location=self.location, search_key=skill)

            if job_details:

                job_names = [job_name["job_title"] for job_name in job_details]
                job_links = [job_link["job_link"] for job_link in job_details]
                job_descriptions = [job_desc["job_desc"] for job_desc in job_details]
                company_names = [company["company_name"] for company in job_details]

                data = {
                    'Job Name': job_names,
                    'Job Link': job_links,
                    'Job Description': job_descriptions,
                    'Company Name': company_names,
                 }
                
                temp_df = pd.DataFrame(data)
                logging.info(f"Adding {i + 1} search results to dataframe")
                print(temp_df.head())

                if not temp_df.empty:
                    df = pd.concat([df, temp_df], ignore_index=True)
                else:
                    logging.warning(f"No job details found for search term: {skill}")


            else:
                logging.warning(f"No job details found for search term: {skill}")

            time.sleep(1)  
        

            
        copy_jobs_df = df.copy(deep=True)

        copy_jobs_df['data'] = df[['Job Name', 'Job Description']].apply(lambda x: ' '.join(x.dropna().astype(str)), axis=1)
        copy_jobs_df.drop(['Job Description', 'Job Name','Job Link','Company Name'], axis=1, inplace=True)

        # print(f"here is copy_jobs_df {copy_jobs_df}")

        data = list(copy_jobs_df['data'])

        # print(f"here is the data {data}")

        similarity_scores = []
        input_resume = preprocess_text(self.resume)
        model = Doc2Vec.load('job_matching.model')
        vector_resume = model.infer_vector(input_resume.split())
        for jd in data:
            input_jd = preprocess_text(jd)
            vector_jd = model.infer_vector(input_jd.split())
            similarity = 100*(np.dot(np.array(vector_resume), np.array(vector_jd))) / (norm(np.array(vector_resume)) * norm(np.array(vector_jd)))
            similarity_scores.append(round(similarity, 2))
            print(round(similarity, 2))

        df['Similarity Score'] = similarity_scores
        sorted_jobs_df = df.sort_values(by='Similarity Score', ascending=False)

        top_jobs_df = sorted_jobs_df.head(self.results)

        job_data = {
            'company': top_jobs_df['Company Name'].tolist(),
            'title': top_jobs_df['Job Name'].tolist(),
            'job_url': top_jobs_df['Job Link'].tolist(),
            'description': top_jobs_df['Job Description'].tolist(),
        
}
        # print(job_data)

        return job_data
        