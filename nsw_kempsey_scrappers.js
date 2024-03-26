const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

puppeteer.use(pluginStealth());

const email = "onetender800@gmail.com";
const pwd = "p9%AA~40DaV)";

async function NSW_Kempsey(){
    const browser = await puppeteer.launch({headless:false
    });
    const page1 = await browser.newPage();
    //data container
    let scrapedData = [];
    try {

        //login
        await page1.goto("https://app.eprocure.com.au/kempsey/login");
        await page1.waitForSelector('form');
        await page1.type(" form > div:nth-child(1) > div > input",email,{delay:150});
        await page1.type("#show_hide_password > input",pwd,{delay:150});
        await page1.click('[type="submit"]');
        await page1.waitForNavigation({waitUntil:'load'});

        //counting  the scrapers
        // const links = await page1.$(()=>Array.from(document.querySelectorAll("app-public-tender > div:nth-child(3) > div")));
        await page1.waitForTimeout(3000);
        const linkCount = await page1.evaluate(()=>Array.from(document.querySelectorAll('app-public-tender > div:nth-child(3) > div > div > div > div:nth-child(2) > span '),(e)=>e.innerText));

        

        //scraping details

        
        if (linkCount.length > 0) {
            console.log("im in")
            //title
                const titleELements = await page1.evaluate(()=>Array.from(document.querySelectorAll('a.text-black.ng-tns-c105-0.ng-star-inserted'),(e)=>e.innerText));
            //agency

            //atmId
                const atmIdElements = await page1.evaluate(()=>Array.from(document.querySelectorAll('h6.card-subtitle.text-black.mt-2.ng-tns-c105-0.ng-star-inserted'),(e)=>e.innerText));
            //category
                
            //location
            
            //region

            //idNumber

            //publishedDate and closingDate
                const DateElements = await page1.evaluate(()=>Array.from(document.querySelectorAll('span.font-14.ng-tns-c105-0'),(e)=>e.innerText)); //includes data in the order of each tender(each tender has 3 parts as Closing,Released dates and Type) [ClosingDate,ReleasedDate,Type,ClosingDate,ReleasedDate,Type,ClosingDate,....]

            //updatedDateTime
                let updatedDateTimeElement = "no date found";
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
    
                    updatedDateTimeElement = new Date().toLocaleDateString();
                    updatedDateTimeElement = formatDate(updatedDateTimeElement);

    
    
                //date formatter
                function formatCustomDate(inputDate) {
                    if (inputDate == "not specified") {
                        return inputDate;
                    } else {
                        // Extract the relevant date part, allowing for variations in timestamps and timezones
                        const datePart = inputDate.match(/\d{2}\/\d{2}\/\d{4}/)[0];
                
                        // Extract day, month, and year from the date part
                        const [day, monthNum, year] = datePart.split('/').map(part => parseInt(part, 10));
                
                        // **Key change: Adjust for Australian date format where January is 01**
                        const month = monthNum - 1;
                
                        // Convert month number to short month name
                        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                
                        // Combine the formatted parts
                        const formattedDate = `${day} ${monthNames[month]} ${year}`;
                
                        return formattedDate;
                    }
                }
            
            for(let i = 0 ; i < linkCount.length; i++){
    
                //description
                    await page1.click(`app-public-tender > div:nth-child(3) > div:nth-child(${i+1}) > div > div > div > div > div > div > table > tr > td:nth-child(2) > h4 > a`);
                    await page1.waitForTimeout(1000);
                    let descriptionElement = " ";
                        descriptionElement = await page1.evaluate((i)=>{
                        descriptionElement = document.querySelector(`app-public-tender > div:nth-child(3) > div:nth-child(${i+ 1}) > div > div > div:nth-child(2) > div > div > span`);
                        descriptionElement = descriptionElement ? descriptionElement.innerText : "";
                        return descriptionElement.replace(/\n+/g," ");
                    },i);

    
    
                scrapedData.push({
                    title: titleELements[i],
                    agency: "",
                    atmId: atmIdElements[i],
                    category: "not specified",
                    location: ["NSW"],
                    region: ["Kempsey Shire Council"],
                    idNumber: atmIdElements[i],
                    publishedDate: formatCustomDate(DateElements[3*(i+1)-2]),
                    closingDate: formatCustomDate(DateElements[3*(i+1)-3]),
                    description: descriptionElement,
                    link: await page1.url(),
                    updatedDateTime: updatedDateTimeElement,
                })
                
            }

        } else {
            console.log(scrapedData);
            await browser.close();
        }
       
        await page1.waitForTimeout(2000);
        console.log(scrapedData);
        await browser.close();

    } catch (error) {
        console.log(error);
        console.log(scrapedData);
        await browser.close();
    }



}

NSW_Kempsey();
