const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
// const reArrangeTheOldAndNewData = require("./util_functions");

puppeteer.use(pluginStealth());

const urlMain = 'https://www.tenders.nsw.gov.au';
const urlAlltenders = '/?event=public.advancedsearch.rftStep2&type=rftEvent&rftType=published&agencyUUID=9A04CEC2-F863-F11B-49AABA9B32740E74&agencyStatus=-1&departmentUUID=&keyword=&publishFrom=&publishTo=&closeFrom=&closeTo=&tenderTypeUUID=&category=99900004&category=99900002&category=99900005&category=99900003&category=99900006&category=99900023&category=99900008&category=99900030&category=99900020&category=99900019&category=99900018&category=99900010&category=99900027&category=99900007&category=99900025&category=99900011&category=99900029&category=99900015&category=99900012&category=99900014&category=99900157&category=99900022&category=99900026&category=99900021&category=99900017&category=99900028&category=99900024&category=99900013&category=99900009&category=99900016&category=99900031&category=99900032&category=99900033&category=99900034&category=99900035&category=99900046&category=99900042&category=99900040&category=99900037&category=99900038&category=99900039&category=99900041&category=99900036&category=99900045&category=99900044&category=99900047&category=99900043&category=99900048&category=99900051&category=99900055&category=99900049&category=99900056&category=99900054&category=99900058&category=99900050&category=99900052&category=99900053&category=99900057&category=99900158&category=99900059&category=99900063&category=99900062&category=99900060&category=99900061&category=99900064&category=99900066&category=99900065&category=99900149&category=99900154&category=99900151&category=99900152&category=99900150&category=99900153&category=99900156&category=99900067&category=99900069&category=99900068&category=99900070&category=99900071&category=99900074&category=99900073&category=99900072&category=99900075&category=99900078&category=99900076&category=99900077&category=99900079&category=99900080&category=99900085&category=99900087&category=99900091&category=99900090&category=99900081&category=99900082&category=99900089&category=99900084&category=99900083&category=99900086&category=99900092&category=99900088&category=99900093&category=99900094&category=99900096&category=99900095&category=99900097&category=99900100&category=99900098&category=99900099&category=99900101&category=99900109&category=99900102&category=99900108&category=99900105&category=99900106&category=99900107&category=99900103&category=99900104&category=99900122&category=99900126&category=99900125&category=99900124&category=99900123&category=99900129&category=99900138&category=99900139&category=99900134&category=99900132&category=99900133&category=99900135&category=99900137&category=99900136&category=99900131&category=99900130&category=99900140&category=99900143&category=99900141&category=99900142&category=99900127&category=99900159&category=99900128&category=99900144&category=99900145&category=99900146&category=99900147&category=99900110&category=99900116&category=99900113&category=99900114&category=99900111&category=99900118&category=99900117&category=99900119&category=99900115&category=99900121&category=99900112&category=99900120&location=D92785FD-99A6-F985-99A47C7CBD8D21E4&location=D92785FE-D765-4A51-CC618D694BA139D7&location=D92785FF-DC84-5151-E91D3B709096B2A1&location=D9278600-D56F-BE6F-46DE92B5D85E3D2C&location=D9278601-FE59-16FF-FAE405B6DC6A9D07&location=D9278602-AF9D-3C3B-AC1C08ACBB669781&location=D9278603-B0A8-0BC6-26AC10FE3046F27A&location=D9278604-905C-2700-F475A2F9EC938C73&location=D9278605-C7DA-107E-B9C85DD01EDA8937&location=D9278606-C268-4836-EBB1EF632D1EC245&location=D9278607-A7A6-B171-562BD0CAB17DA27D&location=D9278608-DDD7-263C-9299775C38AC6876&location=D9278609-E31B-00AE-8B7B4546D5B101DC&location=D927860A-E26D-6A54-EB4583EF9BC9CDB4&location=D927860B-0689-A45D-9630480B11949B0A&location=D927860C-F500-A903-DAF5246463D5DA2C&location=45A0C439-B658-D9A0-A44BD9585C06CF7B&location=45A0C43A-C7D1-BC6F-D0DA06380DF5165A&location=45A0C43C-9E9C-763D-77B2EAD54E7AE713&location=45A0C43E-EBBC-BCE5-BF798C9AF7DC2EDB&location=45A0C43F-9287-2706-1D411496B084E0BF&location=45A0C441-DAD8-32C5-3F2C377B1AF959FC&location=45A0C443-BC4D-81BC-144944365455DF60&location=45A0C444-083C-5909-A350121DC86A28D0&location=45A0C446-CD90-4F32-D59A777192513F23&location=45A0C448-D096-D799-9E131BF81585B22E&location=45A0C449-C468-1403-6160F64203FE6A0E&location=45A0C44B-0AD8-A3B2-663128BBB6A5397B';

async function NSW_Hawkesbury(){
    
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
                        // Adjust the regex to match the ID part correctly
                        const match = titleElement.match(/\s*-\s*T\d+$/);
                    
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

                    const region = ["Hakesbury City Council"];



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
                // reArrangeTheOldAndNewData(scrapedData, "nsw-bhill-");
                await page2.close();
                
            }
            console.log(scrapedData);
            await browser.close();
            
}catch(error){
        console.log(error);
        await browser.close();
    }

}

NSW_Hawkesbury();
