import requests
from bs4 import BeautifulSoup
import re

#add law classes that failed to database
    #change url path to just law
    #change regex?
    #other law classes won't be added since they are already included

#take out class letter--decided we dont wan't this anymore
#need to adjust regex or just omit law classes (try the regex though)
#convert all class names to lowercase before adding to database--DONE
#convert deparment names to lowercase before adding to database--DONE
    #means:
    #convert all search queries for class names to lowercase
    #convert search queries for department names to lowercase
    #convert all department codes in search queries to uppercase

#work on node.js and mongo connection, searching for valid classes
#study group creation--how to match people
#stat collection
#email reminders


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
courses = db.stetson_courses


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
        return [department_code, class_code, class_letter, class_name.lower()]
    else:
        return None


main_page_url = "https://catalog.stetson.edu/courses-instruction/"
main_page_response = requests.get(main_page_url)
main_page_content = main_page_response.content # get main page content
main_page_soup = BeautifulSoup(main_page_content, "html.parser") # parse main page content
department_links = main_page_soup.select("div.sitemap a.sitemaplink") # get department links from main page in a list (selects all under this search)
failures = [] # keep track of issues

# loop through list of departments
for link in department_links:
    # same getting/ parsing process as with main page, applied to each department link
    department_url = "https://catalog.stetson.edu" + link["href"]
    department_response = requests.get(department_url)
    department_content = department_response.content
    department_soup = BeautifulSoup(department_content, "html.parser")
    
    # Get department name
    class_blocks = department_soup.select("div.courseblock") # get all courses, somewhat similar to getting departments
    department = department_soup.title.get_text()
    department = department.split("<")[0]
    department_name = department.split(" (")[0]
    print(department_name)

    # Loop through classes in each department
    for class_block in class_blocks:
        class_title = class_block.select_one("p.courseblocktitle strong").text.strip() #.strip gets rid of whitespace
        class_description = class_block.select_one("p.courseblockdesc").text.strip()
        class_info = parse_class_info(class_title) # get relevant info to be stored in database

        if class_info:
            # Insert department_name, class_title, and class_description into database
            data = {'department_name': department_name.lower(),
                    'department_code': class_info[0],
                    'class_title': class_info[3],
                    'class_code': class_info[1],
                    'class_description': class_description}

            # Check if course already exists in database (cross-check three fields in case duplicate names & codes)
            # ex. independent study 385 occurs in multiple departments
            # useful for when this code runs periodically to update database with new classes
            if courses.count_documents({'department_code': class_info[0], 'class_title': class_info[3], 'class_code': class_info[1]}):
                print(class_info[3], class_info[1], 'in', department_name, 'already exists in database.')
            else:
                courses.insert_one(data)

            print("Department Code:", class_info[0])
            print("Class Code:", class_info[1])
            # print("Class Letter:", class_info[2])
            print("Class Name:", class_info[3])
            print("=" * 50)

        # if problem occurs parsing class info
        else:
            failures.append(class_title)
            print("Failures:", failures)
            print("=" * 50)

# fails on law--get around this
# keep description for fall/spring
# we want to know if a class doesn't exist anymore, and archive it somehow--how to find classes that don't exist

#to do after:
# connect user database to classes database (users to classes)
    #a class list field
# work study group creation