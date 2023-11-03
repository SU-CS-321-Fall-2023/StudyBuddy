import requests
from bs4 import BeautifulSoup
import re

## The code is still unfinished, it contains debugging code like "failures" and "print" statements
## The code is also not very robust
## it will not return correct output for "LAW" department classes. Everything else works.

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
