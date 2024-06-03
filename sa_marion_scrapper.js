
const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const reArrangeTheOldAndNewData = require("./util_functions");

puppeteer.use(pluginStealth());

async function SA_Marion() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();

    const pageUrls = [
      "https://www.tenders.sa.gov.au/tender/search?keywords=&tenderCode=&tenderState=OPEN&tenderType=&issuingBusinessId=80217&awardedSupplier.id=&awardedSupplier.name=&openThisWeek=false&openingDateFrom=&openingDateTo=&closeThisWeek=false&closingDateFrom=&closingDateTo=&groupBy=NONE&page=&searchTitle=",
    ];

    const allData = [];

    for (const pageUrl of pageUrls) {
      await page.goto(pageUrl);

      // Wait for the table to load
      await page.waitForSelector("#content > div.tender-table > p");

      // Get the links and text from the second <td> in each row
      const data = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll("tbody tr"));
        const rowData = rows.map((row) => {
          const secondTd = row.querySelector("td:nth-child(2)");
          const link = secondTd.querySelector("a");
          const linkText = link ? link.textContent.trim() : "";
          const linkHref = link ? link.href : "";

          const thirdTd = row.querySelector("td:nth-child(3)");
          let closingDateText ='';
          if(thirdTd){
            closingDateText = thirdTd.innerText.trim().split('\n');
            closingDateText = closingDateText[1].replace(',','');
            
          }else{
            const closingDateText = 'Not specified';
          }
          // const closingDateText = thirdTd? thirdTd.innerText:'Not specified';
          // Check if both linkText and linkHref are not empty before including in the result
          if (linkText && linkHref && closingDateText) {
            return { title: linkText, link: linkHref,closingDate: closingDateText};
          }

          // If both linkText and linkHref are empty, skip this row
          return null;
        });

        // Filter out rows with empty results
        return rowData.filter((item) => item !== null);
      });

      // Add the data from the current page to the overall list
      allData.push(...data);
    }

    

    // Iterate through the links and get the title from each page
    for (const dataItem of allData) {
      const  link  = dataItem.link;
      // console.log(dataItem.link);
      await page.goto(link);

        //this is part is to avoid the mixing of category tag with Contact Number tag
              //checking how many child elements are there with #opportunityGeneralDetails > div
              const children = await page.evaluate(()=>Array.from(document.querySelectorAll('#opportunityGeneralDetails > div'),(e)=>{return {}}));
              let extra = 0;
              if(children.length == 6){
                 extra =1;
              }

      // Wait for the title to load
      await page.waitForSelector("#tenderTitle");

      // Extract the title
      const title = await page.$eval("#tenderTitle", (element) =>
        element.textContent.trim()
      );

      // console.log('title: ',title);

      let idNumber = await page.$eval(
        "#opportunityGeneralDetails > div:nth-child(4) > div.col-sm-9.col-md-10",
        (element) => element.textContent.trim()
      );

      // console.log('idNumber: ',idNumber);

      const category = await page.$eval(
        `#opportunityGeneralDetails > div:nth-child(${5+extra}) > div.col-sm-9.col-md-10`,
        (element) => element.textContent.trim().replace(/[\n\t]+/g, " ")
      );
      // console.log('category: ',category);

      let description = (
        await page.$$eval("#tenderDescription p", (paragraphs) => {
          return paragraphs.map((p) => p.textContent.trim());
        })
      ).join("\n");

      description = description.replace(/\n/g, "").replace(/\+/g, " ");
      // console.log('description :',description);

      const publishedDate = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      // const closingDate = await page.$eval("#tenderClosingTime", (element) => {
      //   const text = element.textContent.trim();
      //   const dateMatch = text.match(/(\d{1,2}\s\w+\s\d{4})/);

      //   if (dateMatch) {
      //     return dateMatch[0];
      //   } else {
      //     return "Not specified";
      //   }
      // });

      const location = ["SA"];
      const region = ["City of Marion"];
      const updatedDateTime = new Date().toLocaleString("en-AU", {
        timeZone: "Australia/Adelaide",
      });

      // Update dataItems
      dataItem.idNumber = idNumber;
      dataItem.title = title;
      dataItem.category = category;
      dataItem.description = description;
      dataItem.publishedDate = publishedDate;
      // dataItem.closingDate = closingDate;
      dataItem.location = location;
      dataItem.region = region;
      dataItem.updatedDateTime = updatedDateTime;
    }

    // Print the scraped data with titles
    await browser.close();

    const tenderData = allData;
    await reArrangeTheOldAndNewData(tenderData, "sa-bns-");
    console.log(tenderData);
  } catch (error) {
    console.log(error);
  }
}

SA_Marion();
module.exports = SA_Marion;
