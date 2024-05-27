const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
// const reArrangeTheOldAndNewData = require("./util_functions");

puppeteer.use(pluginStealth());

const url = 'https://www.brisbane.qld.gov.au/business-in-brisbane/business-opportunities/selling-to-council/tender-opportunities/current-tenders';

async function QLD_Brisbane(){
    
    const browser = await puppeteer.launch({
        headless: false,
        // args: ["--no-sandbox"]

    });
try{    

    const page1 = await browser.newPage();
    await page1.setDefaultNavigationTimeout(2*60000); 


    await page1.goto(url);
        //extracting tender components
        const links = await page1.evaluate(()=>Array.from(document.querySelectorAll('table[class="js-table--responsive processed"]'),(e)=>{return {}}));
        //dataItems contains current tenders,upcoming tenders,closed tenders etc.
        const dataItems= await page1.evaluate((url)=>Array.from(document.querySelectorAll('table > tbody > tr'), (e)=>{

        // title
        let titleELement ='';

try {
               titleELement = e.querySelector('td:nth-child(2)>a');
              if(titleELement == null){
                titleELement = e.querySelector('td:nth-child(2)>p:nth-child(1)').innerText;
              }else{
               titleELement = titleELement.innerText; 
              }
} catch (error) {
  console.log('title:',error);
}

        //agency ""
            let agencyElement = "";

        //atmID ""
        let atmIdELement = '';

try {
               atmIdELement  = e.querySelector('td:nth-child(1)');
              atmIdELement = atmIdELement?atmIdELement.innerText : '';
} catch (error) {
  console.log('atmId:',atmIdELement);
}

        //category
        let categoryELement = ''; 

try {
               categoryELement = e.querySelector('td:nth-child(3)');
               if(categoryELement){
                categoryELement = categoryELement.innerText
               }else{
                categoryELement = null;
               }
              if(categoryELement == 'N/A' || categoryELement == null){
                 categoryELement = "not specified";
                }
} catch (error) {
  console.log('category:',error);
}

        //location
          const locationELement = ["QLD"];
        //region
          const regionElement = ["Brisbane City Council"];
        //id
          let idNumberElement = '';
          idNumberElement = atmIdELement; 
        

              //format date funciton
                function formatCustomDate4(inputDate) {
                  if (inputDate === "no date found") {
                      return inputDate;
                  } else {
                      // Define the mapping from full month names to short month names
                      const monthNames = {
                          "January": "Jan", "February": "Feb", "March": "Mar", "April": "Apr", "May": "May",
                          "June": "Jun", "July": "Jul", "August": "Aug", "September": "Sep", "October": "Oct",
                          "November": "Nov", "December": "Dec"
                      };
              
                      // Extract the relevant parts of the input date string
                      let datePart;
                      if (inputDate.includes(',')) {
                          // Input format: "Friday 31 May 2024, 4pm AEST"
                          datePart = inputDate.split(',')[0].trim().split(' ').slice(1);
                      } else {
                          // Input format: "12 June 2024 12 noon"
                          datePart = inputDate.split(' ').slice(0, 3);
                      }
              
                      // Extract day, month name, and year
                      const [day, monthName, year] = datePart;
              
                      // Convert full month name to short month name
                      const month = monthNames[monthName];
              
                      // Combine the formatted parts
                      const formattedDate = `${parseInt(day, 10)} ${month} ${year}`;
              
                      return formattedDate;
                  }
                }
          
           //publishedDate
            let publishedDateElement = "no date found";
            //closing Date
            let closingDateElement = '';

try {
                closingDateElement = e.querySelector('td:nth-child(5)');
                if(closingDateElement){
                  closingDateElement = closingDateElement.innerText;
                }else{
                  closingDateElement = closingDateElement.innerText;
                }
                if(closingDateElement){
                  if(closingDateElement == 'N/A' || closingDateElement == null){
                    closingDateElement = "no date found";
                   }
                    closingDateElement = formatCustomDate4(closingDateElement);
                }
} catch (error) {
  console.log('closingDate',error);
}


          //description
          let descriptionELement = '';

try {
                 descriptionELement = e.querySelector('td:nth-child(2)');
                 if(descriptionELement){
                  descriptionELement = descriptionELement.innerText.replace(/\n+/g," ");
                 }else{
                   descriptionELement = '';
                 }
} catch (error) {
  console.log('description:',error);
}


          // link

          //updateDateTime
          let updatedDateTimeElement = "no date found";
              //     updatedDateTimeElement formattter
                  function formatDate(inputDate) {
                      const dateObj = new Date(inputDate);
                      
                      // Create a new Intl.DateTimeFormat instance for the desired format
                      const formatter = new Intl.DateTimeFormat('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                      });
                      
                      return formatter.format(dateObj);
                      }
  
              updatedDateTimeElement = new Date().toLocaleDateString();
              updatedDateTimeElement = formatDate(updatedDateTimeElement);

              return {
                    title : titleELement,
                    agency : agencyElement,
                    atmId : atmIdELement,
                    category: categoryELement,
                    location : locationELement,
                    region : regionElement,
                    idNumber : idNumberElement,
                    publishedDate : publishedDateElement,
                    closingDate : closingDateElement,
                    description : descriptionELement,
                    link : url,
                    updatedDateTime: updatedDateTimeElement,
                }

        }));




        //array for scraped data
        let scrapedData = [];


        //only pushing the current tenders inside the scrped data array from dataItems
       for(let i =0;i<links.length-3;i++ ){ //last 3 components are not current tenders

            scrapedData.push(dataItems[i]);
                // reArrangeTheOldAndNewData(scrapedData, "qld-bbn-");
                
            }
            console.log(scrapedData);
            await browser.close();
            
}catch(error){
        console.log(error);
        await browser.close();
    }

}

QLD_Brisbane();
