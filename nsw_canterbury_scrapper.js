const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
// const reArrangeTheOldAndNewData = require("./util_functions");

puppeteer.use(pluginStealth());

const urlMain = 'https://www.tenders.nsw.gov.au';
const urlAlltenders = '/?location=&publishfrom=&closeto=&rfttype=published&keywordtypesearch=AllWord&keyword=&modifiedfrom=&event=public.advancedsearch.rftStep2&agencyStatus=-1&numagencystatus=-1&category=&publishto=&departmentuuid=&startRow=0&agencyuuid=9A052FE9-A690-D52D-BB75E352B32E03F1&tendertypeuuid=9A003C67-D5B8-62DC-4719F80813CCAAFC&multype=archived%2Cclosed%2Cpublished&closefrom=&type=rftEvent&resultsPerPage=90&orderBy=Close+Date+%26+Time+-+Descending';

async function NSW_Canterbury(){
    
    const browser = await puppeteer.launch({
        headless: false,
        // args: ["--no-sandbox"]

    });
try{    

    const page1 = await browser.newPage();
    await page1.setDefaultNavigationTimeout(2*60000); 


    await page1.goto(urlMain+urlAlltenders);
        //extracting tender components
        const links = await page1.evaluate(()=>Array.from(document.querySelectorAll('div[class="btns"] > a'),(e)=>{return e.href}));

        //container for scraped date
        let scrapedData = [];
        for(const elm of links ){

            const page2 = await browser.newPage();
            await page2.goto(elm);
            
            await page2.waitForSelector('.footer');
            //extracting data

                //title
                let title = '';

                title = await page2.evaluate(() => {
                    let titleElement = document.querySelector('body > div.wrapper > div.main > div.headline > div > h1');
                    
                    if (titleElement) {
                        titleElement = titleElement.innerText;
                        // Remove the ID number and the hyphen from the title
                        const match = titleElement.match(/\s*-\s*[A-Za-z]*\d+-\d+$/);
                    
                        if (match) {
                            const [matchedText] = match;
                            const index = titleElement.indexOf(matchedText);
                    
                            // Extract the part before the matched text (removing the ID part)
                            titleElement = titleElement.substring(0, index).trim();
                        }
                    } else {
                        titleElement = '';
                    }
                    
                    return titleElement;
                });

                //agency ""
                    let agency = "";
                    agency = await page2.evaluate(()=>{
                        let agencyELement = document.querySelector(`#RFT-SB-Agency > span.sidebarBlock-content`);

                        agencyELement = agencyELement?agencyELement.innerText : '';

                        return agencyELement;
                    })


                //atmID ""
                    let atmId = "";
                        atmId = await page2.evaluate(()=>{
                            let atmIdELement = document.querySelector(`#RFT-SB-ID > span.sidebarBlock-content`);

                            atmIdELement = atmIdELement? atmIdELement.innerText :"";

                            return atmIdELement;
                        })


                    

                //category 
                    let category = "not specified";
                    category = await page2.evaluate((val)=>{
                        let categoryELement = document.querySelector(`#RFT-SB-Category > span.sidebarBlock-content`);
                        categoryELement = categoryELement?categoryELement.innerText : "not specified";

                        return categoryELement;
                    })

                //location
                    let location = ["NSW"];

                    const tempLocations = await page2.evaluate(() => {
                        let locationElement = document.querySelector(`#RFT-Location > div`);
                        let locationsArray = [];
                    
                        if (locationElement) {
                            // Use the innerHTML of the element
                            let locationHTML = locationElement.innerHTML;
                    
                            // Remove HTML tags using a regular expression
                            locationHTML = locationHTML.replace(/<[^>]*>/g, '').replace('NSW Regions:', '');;
                    
                            // Split the cleaned string by commas to form an array
                            locationsArray = locationHTML.split(',').map(location => location.trim());
                        }
                        
                        return locationsArray;
                    });
                        location = location.concat(tempLocations);

         

                    

                //region

                    const region = ["Canterbury Bankstown Council"];



                    let idNumber = "";

                        idNumber = await page2.evaluate(()=>{
                            let idNumberELement = document.querySelector(`#RFT-SB-ID > span.sidebarBlock-content`);

                            idNumberELement = idNumberELement? idNumberELement.innerText : '';

                            return idNumberELement;
                        })





                        //format date function
                        function formatCustomDate(inputDate) {
                            if (inputDate === "no date found") {
                                return inputDate;
                            } else {
                                // Extract the date part from the input string
                                const datePart = inputDate.split(' ')[0];
                        
                                // Parse the date part into day, month, and year
                                const [day, monthStr, year] = datePart.split('-');
                        
                                // Create a Date object from the parsed parts
                                const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(monthStr);
                                const dateObj = new Date(year, monthIndex, day);
                        
                                // Get the day, month, and year
                                const formattedDay = dateObj.getDate().toString().padStart(2, '0');
                                const formattedMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj);
                                const formattedYear = dateObj.getFullYear();
                        
                                // Combine the formatted parts
                                const formattedDate = `${formattedDay} ${formattedMonth} ${formattedYear}`;
                        
                                return formattedDate;
                            }
                        }

                        //date verifier
                        function isDateValid(dateString) {
                            const date = new Date(dateString);
                            return !isNaN(date) && dateString.trim() !== '';
                          }
                        

                //publishedDate
                let publishedDate = "no date found";
                            publishedDate = await page2.evaluate(()=>{
                                let publishedDateElement  = document.querySelector(`#RFT-SB-Published > span.sidebarBlock-content`);
                                publishedDateElement = publishedDateElement? publishedDateElement.innerText :"no date found";
                                return publishedDateElement;
                            })
                            // formatting the date
                            publishedDate = formatCustomDate(publishedDate);
    
                            if (isDateValid(publishedDate)) {
                               publishedDate;
                              } else {
                               publishedDate = "no date found";
                              }


                    

                //closingDate
                let closingDate = "no date found";

                            closingDate = await page2.evaluate(()=>{
                                let closingDateElement  = document.querySelector(`#RFT-SB-Closes > span.sidebarBlock-content`);
                                closingDateElement = closingDateElement? closingDateElement.innerText :"no date found";
                                return closingDateElement;
                            })
                            //formatting the date
                            closingDate = formatCustomDate(closingDate);
    
                            //varifiying the  date is a valid date
                            if (isDateValid(closingDate)) {
                                closingDate;
                               } else {
                                closingDate = "no date found";
                               }


                //description
                    let description ='';
                        description = await page2.evaluate(()=>{
                            let descriptionElement = document.querySelector(`#RFT-Details > div`);
                            descriptionElement = descriptionElement? descriptionElement.innerText.replace(/\n+/g," ") : '';
                            return descriptionElement;
                        })


                //link
                    const link = await page2.url();

                //updateDateTime
                    let updatedDateTime = "no date found";
                            //updatedDateTime formattter
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
        
                        updatedDateTime = new Date().toLocaleDateString();
                        updatedDateTime = formatDate(updatedDateTime);

   

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
                // reArrangeTheOldAndNewData(scrapedData, "nsw-cnb-");
                await page2.close();
                
            }
            // console.log(scrapedData);
            await browser.close();
            
}catch(error){
        console.log(error);
        await browser.close();
    }

}

NSW_Canterbury();
