import requests
from bs4 import BeautifulSoup

# URL of the main page with department links
main_page_url = "https://catalog.stetson.edu/courses-instruction/"

# Send a GET request to the main page
main_page_response = requests.get(main_page_url)
main_page_content = main_page_response.content

# Parse the main page content
main_page_soup = BeautifulSoup(main_page_content, "html.parser")

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
        
        # Print or store the class information as needed
        print("Class Title:", class_title)
        print("Class Description:", class_description)
        print("=" * 50)
