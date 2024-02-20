const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

puppeteer.use(pluginStealth());

//login credentials
const email = "onetender66@gmail.com";
const pwd = "oneTender#99"; 

async function NSW_CentralCoast(){
    const browser = await puppeteer.launch({
        headless:false,
        // args: ["--no-sandbox"]
    })
    try {
        const page1 = await browser.newPage();
    
        //goto the registration page
            await page1.goto('https://portal.tenderlink.com/centralcoastnsw/');
            await page1.waitForSelector('#loginPasswordPane');
    
        //insert the credentials
            await page1.type('#Email',email,{delay:130});
            await page1.type('#Password',pwd,{delay:150});
            
        //click the login button
            await page1.click('#btnLogin')
            await page1.waitForNavigation({waitUntil:'load'});

            
        //click the "All current tenders" in the dashboard
            await page1.click('#menuAllOpenTenders');
            await page1.waitForTimeout(2000);


        //checking how many links are there to be scraped
        const linkArr = await page1.evaluate(()=>Array.from(document.querySelectorAll('#firefoxscrolllayer > div:nth-child(1) > .table > tbody > tr')));
        const numOfLinks = linkArr.length-1;

        //creating an array to hold scraped data
        tenderData = [];

        //looping inside each link to scrape data
        for(let i = 0; i<numOfLinks-1 ; i++){

            let tempObj = await page1.evaluate((i)=>{

                //title
                    let titleElement = document.querySelector(`#firefoxscrolllayer > div:nth-child(1)> .table > tbody:nth-child(1) > tr:nth-child(${2+i}) > td:nth-child(2)`);
                    titleElement = titleElement? titleElement.innerText : "";
                //agency
                //atmId
                    let atmIdElement = document.querySelector(`#firefoxscrolllayer > div:nth-child(1)> .table > tbody:nth-child(1) > tr:nth-child(${2+i}) > td:nth-child(1)`);
                    atmIdElement = atmIdElement? atmIdElement.innerText: "";
                //category
                //location
                //region
                //idNumber
                  let  idNumberElement = document.querySelector(`#firefoxscrolllayer > div:nth-child(1)> .table > tbody:nth-child(1) > tr:nth-child(${2+i}) > td:nth-child(1)`);
                  idNumberElement = idNumberElement? idNumberElement.innerText:"";
                //publishedDate
                //closingDate
                closingDateElemnt = document.querySelector(`#firefoxscrolllayer > div:nth-child(1)> .table > tbody:nth-child(1) > tr:nth-child(${2+i}) > td:nth-child(5)`);
                closingDateElemnt = closingDateElemnt? closingDateElemnt.innerText : "no date found";
                //description-extracted insid the next evaluate function
                //link-extracted out of this evaluate function
                //updatedDateTime -extracted out of this evaulate function

                return {
                    title: titleElement,
                    agency: "",
                    atmId: atmIdElement,
                    category: "not specified",
                    location: ["NSW"],
                    region: ["Central Coast Council"],
                    idNumber: idNumberElement,
                    publishedDate: "no date found",
                    closingDate: closingDateElemnt,
                    description: "",
                    link: "",
                    updatedDateTime: ""
                };

            },i);

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


            //fromatting closingDate
                tempObj.closingDate = formatCustomDate(tempObj.closingDate);

            //extracting description
                //go inside the link-click on the tenderID
                    await page1.click(`#firefoxscrolllayer > div:nth-child(1)> .table > tbody:nth-child(1) > tr:nth-child(${2+i}) > td:nth-child(1) > a:nth-child(1)`);
                    // await page1.waitForNavigation({waitUntil:'networkidle2'});
                    await page1.waitForTimeout(2000);

                //extracting descrption
                let description = await page1.evaluate(()=>{
                    let descriptionElement = document.querySelector('.tendertabletext');
                    descriptionElement = descriptionElement? descriptionElement.innerText : "";
                    return descriptionElement.replace(/\n+/g," ");
                });
                
                tempObj.description = description;

            //extracting link
                 tempObj.link = await page1.url();

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
                tempObj.updatedDateTime = formatDate(updatedDateTime);
            
            //pushing tempObj into tenderData array
                tenderData.push(tempObj);
        //goback to the all tender page
        await page1.goBack();
        console.log(i);
        }//loop end
            
        await page1.waitForTimeout(3000);
        await browser.close()
        console.log(tenderData);
    } catch (error) {
        console.log(error);
        await browser.close();
        
    }

}

NSW_CentralCoast();