import requests
import json
from bs4 import BeautifulSoup
from datetime import datetime

def get_jobs_from_seek(job, location, pagenum):
    url = "https://www.seek.co.nz/{}-jobs-in-information-communication-technology/in-{}?page={}&sortmode=ListedDate".format(job, location, pagenum)
    page = requests.get(url)
    soup = BeautifulSoup(page.content, "html.parser")
    job_soup = soup.find(attrs={"data-automation" : "searchResults"})
    return job_soup

def find_title(job):
    title = job.find(attrs={"data-automation" : "jobTitle"})
    if title:
        return_title = title.text
    else:
        return_title = ""
    return return_title

def find_company(job):
    company = job.find(attrs={"data-automation" : "jobCompany"})
    if company:
        return_company = company.text
    else:
        return_company = ""
    return return_company

def find_description(job):
    description_list = [] 
    short_description = job.find(attrs={"data-automation" : "jobShortDescription"})
    description_list.append(short_description.text)

    job_description = job.find_all('li')
    if job_description:
        job_bullets = []
        for j in job_description:
            job_bullets.append(j.text)
        description_list.append(job_bullets)
    return description_list

def find_location(job):
    location_list = []
    location = job.find(attrs={"data-automation" : "jobLocation"})
    location_list.append(location.text)
    area = job.find(attrs={"data-automation" : "jobArea"})
    if area:
        location_list.append(area.text)
    return location_list

def find_link(job):
    link = job.find(attrs={"data-automation" : "jobTitle"})
    website_link = "https://www.seek.co.nz{}".format(link.get("href"))
    return website_link

def search_job_pages(job_name, job_location):
    page_number = 1
    job_pages_list = []
    job_page = get_jobs_from_seek(job_name, job_location, page_number)
    while job_page:
        print("page " + str(page_number))
        jobs_list = job_page.find_all(attrs={"data-automation" : "normalJob"})
        for job in jobs_list:
            job_dict = {
                "job_title": find_title(job),
                "job_company" : find_company(job),
                "job_location" : find_location(job),
                "job_link" : find_link(job),
                "job_description": []
            }
            job_desc = find_description(job)
            job_dict["job_description"].append(job_desc[0])
            if len(job_desc) > 1:
                job_dict["job_description"].append(job_desc[1])
            job_pages_list.append(job_dict)

        page_number += 1
        job_page = get_jobs_from_seek(job_name, job_location, page_number)
    
    jobs_list_dict = {"jobs":job_pages_list, "date":datetime.today().strftime('%Y-%m-%d')}

    with open('data.json', 'w') as f:
        json.dump(jobs_list_dict, f)

search_job_pages("software-developer", "all-new-zealand")

    


#seperate_jobs(get_jobs_from_seek("software-developer", "christchurch-canterbury", 1))