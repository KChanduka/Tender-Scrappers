const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");

puppeteer.use(pluginStealth());

async function Ballina() {
  const browser = await puppeteer.launch({ headless: false });
  try {
    const page1 = await browser.newPage();
    await page1.goto(
      "https://ballina.etenderbox.com.au/ListCurrentTenders.aspx"
    );
    await page1.waitForSelector("body");

    //array for scraped data
    let scrapedData = [];

    //finding the number of tenders needed to scrape
    const tempItems = await page1.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "#ctl00_cphMain_rprTenders_pgvTenders > tbody:nth-child(1) > .data-grid-row"
        )
      )
    );
    console.log("links",tempItems.length);
    for(let i = 0;i<tempItems.length-3;i++){

        var count = 3;
        await Promise.all([
            // page1.click( `#ctl00_cphMain_rprTenders_pgvTenders > tbody:nth-child(1) > .data-grid-row:nth-child(${count})> td:nth-child(1)`),
            page1.click( `#ctl00_cphMain_rprTenders_pgvTenders > tbody:nth-child(1) > tr:nth-child(${count})> td:nth-child(1)`),
            page1.waitForNavigation({waitUntil: 'load'})
        ])
        // await page1.click(
        //   `#ctl00_cphMain_rprTenders_pgvTenders > tbody:nth-child(1) > .data-grid-row:nth-child(7)> td:nth-child(1)`
        // );
        // await page1.waitForNavigation()
        // await page1.waitForTimeout(8000);
    
        //extracting title
        let title = "";
        try {
          title = await page1.evaluate(() => {
            let titleELement = document.querySelector(
              "#ctl00_cphMain_tabStrip_tabDetails_tenderView_pnlTender > table > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)");
    
            titleELement = titleELement.innerText;
    
            return titleELement;
          });
        } catch (error) {
          console.log("extracting title ", error);
        }
    
        //extracting agency
        let agency = "";
    
        //extracting atmId
            let atmId = "";
            try{
                atmId = await page1.evaluate(()=>{
                    let atmIdELement = document.querySelector('#ctl00_cphMain_tabStrip_tabDetails_tenderView_pnlTender > table > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)');
    
                    atmIdELement? atmIdELement = atmIdELement.innerText : atmIdELement;
    
                    return atmIdELement;
                })
    
            }catch(error){
                console.log('atmId extraction',error);
    
            }
    
    
        //extracting category
            let category = "";
            try{
                category = await page1.evaluate(()=>{
                    let categoryElement = document.querySelector('#ctl00_cphMain_tabStrip_tabDetails_tenderView_pnlTender > table > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2)');
    
                    categoryElement? categoryElement = categoryElement.innerText : categoryElement ;
    
                    return categoryElement;
                })
            }catch(error){
                console.log("category extraction ", error);
            }
    
        //extracting location
            let location = ["NSW"];
    
            try{
                const tempLocations = await page1.evaluate(()=>{
                    let locationElement = document.querySelector('#ctl00_cphMain_tabStrip_tabDetails_tenderView_pnlTender > table > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(2) ');
    
                    if(locationElement){
    
                        locationElement = locationElement.innerText;
                    }
                    return locationElement
                });
                location = location.concat(tempLocations);
    
            }catch(error){
                console.log("location extraction ", error);
            }
    
        //extracting region
            const region = ["Ballina Shire Council"];
    
        //extracting idNumber
        let idNumber = "";
    
            try{
                idNumber = await page1.evaluate(()=>{
                    let idNumberELement = document.querySelector('#ctl00_cphMain_tabStrip_tabDetails_tenderView_pnlTender > table > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)');
    
                    idNumberELement? idNumberELement = idNumberELement.innerText : idNumberELement=''
    
                    return idNumberELement;
                })
    
            }catch(error){
                console.log('idNumber extraction',error);
            }
    
              //format date function
              function formatCustomDate(inputDate) {
                if (inputDate == "not specified") {
                    return inputDate;
                } else {
                    // Split the input date string to separate date and time parts
                    const [datePart] = inputDate.split(' ');
            
                    // Extract day, month, and year from the date part
                    const [day, monthNum, year] = datePart.split('/').map(part => parseInt(part, 10));
                    
                    // Convert month number to short month name
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const month = monthNames[monthNum - 1]; // months are zero-based in JavaScript Date objects
                    
                    // Combine the formatted parts
                    const formattedDate = `${day} ${month} ${year}`;
            
                    return formattedDate;
                }
            }
    
            //date verifier
            function isDateValid(dateString) {
                const date = new Date(dateString);
                return !isNaN(date) && dateString.trim() !== '';
                }
    
        //extracting publishedDate
            let publishedDate = "not specified";

                publishedDate = await page1.evaluate(()=>{
                    let publishedDateElement  = document.querySelector('#ctl00_cphMain_tabStrip_tabDetails_tenderView_pnlTender > table > tbody:nth-child(1) > tr:nth-child(7) > td:nth-child(2)');
    
                    publishedDateElement? publishedDateElement = publishedDateElement.innerText : publishedDateElement = "not specified";
    
                    return publishedDateElement;
                })
                // formatting the date
                publishedDate = formatCustomDate(publishedDate);
    
                if (isDateValid(publishedDate)) {
                    publishedDate;
                    } else {
                    publishedDate = "not specified";
                    }
    

    
        //extracting closingDate
            let closingDate = "not specified";

                closingDate = await page1.evaluate(()=>{
                    let closingDateElement  = document.querySelector('#ctl00_cphMain_tabStrip_tabDetails_tenderView_pnlTender > table > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(2)');
    
                    closingDateElement? closingDateElement = closingDateElement.innerText : closingDateElement = "not specified";
    
                    return closingDateElement;
                })
                //formatting the date
                closingDate = formatCustomDate(closingDate);
    
                //varifiying the  date is a valid date
                if (isDateValid(closingDate)) {
                    closingDate;
                } else {
                    closingDate = "not date found";
                }
    
    
        //extracting description
            let description =''

                description = await page1.evaluate(()=>{
                    let descriptionElement = document.querySelector('#ctl00_cphMain_tabStrip_tabDetails_tenderView_pnlTender > table > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2)');
    
                    descriptionElement? descriptionElement = descriptionElement.innerText.replace(/\n+/g," ") : descriptionElement='';
                    return descriptionElement;
                })

    
        //extracting link
        var link;
        try {
           link = await page1.url();
        } catch (error) {
          console.log("extracting link", error);
        }
    
        //updated Date Time
        let updatedDateTime = "no date found";
        try {
          //updatedDateTime formattter
          function formatDate(inputDate) {
            const dateObj = new Date(inputDate);
    
            // Create a new Intl.DateTimeFormat instance for the desired format
            const formatter = new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
    
            return formatter.format(dateObj);
          }
    
          updatedDateTime = new Date().toLocaleDateString();
          updatedDateTime = formatDate(updatedDateTime);
        } catch (error) {
          console.log("updatedDateTime", error);
        }

         //pushing the scraped data
         scrapedData.push({
            title,
            agency,
            atmId,
            category,
            location,
            region,
            idNumber,
            publishedDate,
            closingDate,
            description,
            link,
            updatedDateTime,
        });
        
        //counter for scraped links logged to the console
        console.log("scraped links: ", i+1);
        
        count++;
        await page1.waitForTimeout(2000);
        await page1.goBack();

    }

    console.log(scrapedData);
   
    // for(const item of tempItems){
    //     await page1.click(`#ctl00_cphMain_rprTenders_pgvTenders > tbody:nth-child(1) > tr:nth-child(${count})`);
    //     await page1.waitForTimeout(1000);

    //     await page1.goBack();
    //     await page1.waitForTimeout(1000);
    //     count++
    // }
    // tempItems.forEach(element => {

    // });

    // console.log(title,"\n",agency,"\n",atmId,"\n", category, "\n",location,"\n",region,"\n",idNumber,"\n",publishedDate,"\n",closingDate,"\n",description,"\n",link,"\n",updatedDateTime);

    browser.close();
  } catch (error) {
    console.log(error);
    browser.close();
  }
}

Ballina();
