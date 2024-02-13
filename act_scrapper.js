const puppeteer = require("puppeteer");
const reArrangeTheOldAndNewData = require("./util_functions");

async function act_ScraperData() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();

    // Define the base URL
    const baseUrl =
      "https://www.tenders.act.gov.au/tender/search?preset=open&page=";

    // Define the total number of pages to scrape
    const totalPages = 2;

    const allData = [];

    //format date function
        function formatCustomDate(inputDate) {

            if(inputDate == "no date found"){
                return inputDate;
            }else{
                const dateObj = new Date(inputDate);
        
                // Get the day, month, and year
                const day = dateObj.getDate().toString().padStart(2, '0');
                const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj);
                const year = dateObj.getFullYear();
            
                // Combine the formatted parts
                const formattedDate = `${day} ${month} ${year}`;
            
                return formattedDate;
            }
        }


    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const pageUrl = `${baseUrl}${currentPage}`;

      await page.goto(pageUrl);

      // Wait for the main data body to load
      await page.waitForSelector("tbody");

      // Extract links with href starting with "https://www.tenders.act.gov.au/tender/"
      const links = await page.evaluate(() => {
        const linkElements = Array.from(
          document.querySelectorAll("span.tablesaw-cell-content a")
        );
        const filteredLinks = linkElements
          .map((linkElement) => linkElement.href)
          .filter((href) =>
            href.startsWith("https://www.tenders.act.gov.au/tender/")
          );

        //   const closingDate = page.$eval(
        //     "td.tender-date > span > span.closing_date", // Update this selector based on your HTML structure
        //     (dateElement) => dateElement.textContent.trim()
        //   );
        // console.log(closingDate);

        return filteredLinks;
      });

      //extracting all closed dates and creating an array
        const closingDateArr = await page.evaluate(()=>Array.from(document.querySelectorAll('td.tender-date > span > span.closing_date'),(e)=>{
            const closingDateElment = e.textContent.trim();
            return closingDateElment;

        }));

        let counter = 0;



      for (const link of links) {
        // Visit each link individually
        await page.goto(link);

        // Set the opening date to the current date
        const publishedDate = new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        const closingDate = formatCustomDate(closingDateArr[counter]);
        counter++;

        // Extract the closing date from the same place as other data

        // Format closing date to "30 June 2025" format if necessary
        // const formattedClosingDate = closingDate
        //   .split(" ")
        //   .slice(0, 3)
        //   .join(" ");

        // Extract other data (title, category, idNumber, description)

        // Push the title, link, opening date, category, and formatted closing date to the data array
        allData.push({
          // Add other data here
          link,
          publishedDate,
          closingDate,
          // Add other data here
        });
      }
    }

    //store the tenders in array
    const TenderData = allData;
    // console.log(TenderData);
    // await reArrangeTheOldAndNewData(TenderData, "act-");

    await browser.close();
  } catch (err) {
    console.log(err);
  }
}

act_ScraperData();
module.exports = act_ScraperData;