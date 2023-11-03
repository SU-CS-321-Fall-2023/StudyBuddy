import requests
from bs4 import BeautifulSoup
import re

## The code is still unfinished, it contains debugging code like "failures" and "print" statements
## The code is also not very robust
## it will not return correct output for "LAW" department classes. Everything else works.

###MONGO CONNECTION###
import pymongo.server_api
from pymongo import MongoClient

# need the uri
# need to check the class isn't already in the database before adding?
uri = "mongodb+srv://root:SbkEiPRaVoJsyX1M@cluster0.rqigw14.mongodb.net/scrapeTest?retryWrites=true&w=majority"
client = MongoClient(uri, server_api=pymongo.server_api.ServerApi('1'))
# print message indicating attempt to connect to the database
print(f"Attempting to connect to database {uri}...")
if client:
    print("Successfully connected to database! {db.name}")
db = client.db
courses = db.courses


###SCRAPING###
def parse_class_info(class_string):
    # Use regular expression to extract department code, class code, class letter, and class name
    pattern = r"([A-Z]+)\s*(\d+[A-Z]?\d*)([A-Z]?)[\s\.]+(.+?)\.\s+\d"
    match = re.match(pattern, class_string)
    
    if match:
        department_code = match.group(1)
        class_code = match.group(2)
        class_letter = match.group(3)
        class_name = match.group(4)
        return [department_code, class_code, class_letter, class_name]
    else:
        return None

# URL of the main page with department links
main_page_url = "https://catalog.stetson.edu/courses-instruction/"

# Send a GET request to the main page
main_page_response = requests.get(main_page_url)
main_page_content = main_page_response.content

# Parse the main page content
main_page_soup = BeautifulSoup(main_page_content, "html.parser")
failures = []
# Extract department links from the main page
department_links = main_page_soup.select("div.sitemap a.sitemaplink")
for link in department_links:
    department_url = "https://catalog.stetson.edu" + link["href"]
    
    # Send a GET request to the department page
    department_response = requests.get(department_url)
    department_content = department_response.content
    
    # Parse the department page content
    department_soup = BeautifulSoup(department_content, "html.parser")
    
    # Extract class information from the department page
    class_blocks = department_soup.select("div.courseblock")
    department = department_soup.title.get_text()
    department = department.split("<")[0] # can change this to ( so abbreviation isn't included if we want
    department_name = department.split("(")[0]
    print(department_name)
    for class_block in class_blocks:
        
        class_title = class_block.select_one("p.courseblocktitle strong").text.strip()
        class_description = class_block.select_one("p.courseblockdesc").text.strip()
        class_info = parse_class_info(class_title)
        

        # Print or store the class information as needed
        if class_info:
            print("Department Code:", class_info[0])
            print("Class Code:", class_info[1])
            print("Class Letter:", class_info[2])
            print("Class Name:", class_info[3])
        else:
            failures.append(class_title)

        print("Failures:", failures)
        print("=" * 50)

        # Insert department_name, class_title, and class_description into database
        data = {'department_name': department_name,
                'department_code': class_info[0],
                'class_title': class_info[3],
                'class_code': class_info[1],
                'class_description': class_description}
        courses.insert_one(data)

        # Print or store the class information as needed
        print("Class Title:", class_info[3])
        print("Class Description:", class_description)
        print("=" * 50)
# fix the space after department name
# fails on law
# get into mongo database
# keep description for fall/spring
# we want to know if a class doesnt exist anymore, and archive it somehow--how to find classes that don't exist