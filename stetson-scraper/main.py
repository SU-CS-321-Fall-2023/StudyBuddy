import requests
from bs4 import BeautifulSoup
import re
from pymongo import MongoClient

# MongoDB connection setup
uri = "mongodb+srv://root:SbkEiPRaVoJsyX1M@cluster0.rqigw14.mongodb.net/scrapeTest?retryWrites=true&w=majority"
client = MongoClient(uri)
db = client['scrapeTest']
courses = db['classes']

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

main_page_url = "https://catalog.stetson.edu/courses-instruction/"
main_page_response = requests.get(main_page_url)
main_page_content = main_page_response.content
main_page_soup = BeautifulSoup(main_page_content, "html.parser")
failures = []

department_links = main_page_soup.select("div.sitemap a.sitemaplink")
for link in department_links:
    department_url = "https://catalog.stetson.edu" + link["href"]
    department_response = requests.get(department_url)
    department_content = department_response.content
    department_soup = BeautifulSoup(department_content, "html.parser")
    class_blocks = department_soup.select("div.courseblock")
    department = department_soup.title.get_text().split("(")[0].strip()
    print(department)
    
    for class_block in class_blocks:
        try:
            class_title = class_block.select_one("p.courseblocktitle strong").text.strip()
            class_description = class_block.select_one("p.courseblockdesc").text.strip()
            class_info = parse_class_info(class_title)

            if class_info:
                print("Department Code:", class_info[0])
                print("Class Code:", class_info[1])
                print("Class Letter:", class_info[2])
                print("Class Name:", class_info[3])
            else:
                failures.append(class_title)

            print("Failures:", failures)
            print("=" * 50)

            # Check if the class already exists in the database
            existing_class = courses.find_one({
                'department_name': department,
                'department_code': class_info[0],
                'class_title': class_info[3],
                'class_code': class_info[1]
                        })

            if not existing_class:
                # Insert class information into the database
                data = {
                    'department_name': department,
                    'department_code': class_info[0],
                    'class_title': class_info[3],
                    'class_code': class_info[1]
                    }
                courses.insert_one(data)
                print("Class added to the database.")
            else:
                print("Class already exists in the database.")
            print("=" * 50)

        except Exception as e:
            print(f"Error processing class: {e}")
            failures.append(class_title)
            continue