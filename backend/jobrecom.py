
from selenium import webdriver
from bs4 import BeautifulSoup
import time
from selenium.webdriver.common.by import By
import logging
import re
from selenium.webdriver.chrome.options import Options

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def extract_job_details(soup):
    
    job_details = []

    job_listings = soup.find_all("li", class_="iFjolb gws-plugins-horizon-jobs__li-ed")

    for listing in job_listings:
        try:
            company_name_element = listing.find("div", class_="nJlQNd sMzDkb")
            job_title_element = listing.find("div", class_="BjJfJf PUpOsf")
            job_link_element = listing.find("div", attrs={"data-share-url": True})

            company_name = company_name_element.text.strip() if company_name_element else None
            job_title = job_title_element.text.strip() if job_title_element else None
            job_link = job_link_element["data-share-url"] if job_link_element else None

            job_description_spans = listing.find_all("span", class_="HBvzbc")
            full_job_description = ""
            for span in job_description_spans:
                beginning_text = span.text.strip()
                rest_of_text_span = span.find("span", class_="WbZuDe")
                if rest_of_text_span:
                    rest_of_text = rest_of_text_span.text.strip()
                else:
                    rest_of_text = ""
                full_job_description += beginning_text + " " + rest_of_text

            if company_name and job_title and full_job_description and job_link:
                job_details.append({
                    "company_name": company_name,
                    "job_title": job_title,
                    "job_desc": full_job_description,
                    "job_link": job_link
                })
        except AttributeError:
            print("error parsing html data")

    return job_details

def search_jobs(location, search_key, max_retries=3, retry_delay=2):
    
    logging.info('Starting Job Search Using')

    url = f"https://www.google.com/search?q={search_key}+in+{location}&ibp=htl;jobs&hl=en&gl=us"

    print(url)

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--start-maximized")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36")


    retry_count = 0

    while retry_count < max_retries:
        try:
            driver = webdriver.Chrome(options=chrome_options)
            driver.get(url)
            time.sleep(9)

            html = driver.page_source
            driver.quit()

            if html:
                soup = BeautifulSoup(html, 'html.parser')
                job_details = extract_job_details(soup)
                if job_details:
                    return job_details
                else:
                    logging.warning(f"No job details found for search term: {search_key} in {location}")
                    retry_count += 1
                    time.sleep(retry_delay)
            else:
                logging.warning(f"No HTML content retrieved for search: {search_key} in {location}")
                retry_count += 1
                time.sleep(retry_delay)

        except Exception as e:
            logging.error(f"An error occurred while searching for jobs: {search_key} in {location}")
            logging.error(str(e))
            retry_count += 1
            time.sleep(retry_delay)

    logging.warning(f"Max retries exceeded for search term: {search_key} in {location}")
    return []

def preprocess_text(text):
    
    text = text.lower()
    text = re.sub('[^a-z]', ' ', text)
    text = re.sub(r'\d+', '', text)
    text = ' '.join(text.split())
    
    return text






# if __name__ == "__main__":
#     for skill in ["junior project manager", "janitor"]:
#         job_details = search_jobs("california", skill)
#         print(job_details)
#         break



