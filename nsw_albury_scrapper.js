const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

puppeteer.use(pluginStealth());

async function NSW_Albury(){
    const browser = await puppeteer.launch({headless: false});
try{
    const page1 = await browser.newPage();

    await page1.goto('https://www.cityofsydney.nsw.gov.au/lists-maps-inventories/open-tenders-expressions-of-interest');
    await page1.waitForTimeout(2000);


    //
        
            // const titles = await page1.evaluate(()=>document.querySelector('.container .col .col-lg-10 div div div div h5').innerText);
            // let ScrapedData =[];
            // const titles = await page1.evaluate(()=>Array.from(document.querySelectorAll('.container .col .col-lg-10 div div div div'),(e)=>{
                
            //     let title = "";

            //          title= e.querySelector('h5').innerText;              

            //     return title;


                // let atmId = "";

                // let category = "not specified";

                // let location = ["NSW"];

                // let region = ["Albury City Council"];

                // let idNumber = "";
                
                // let publishedDate = "no date found";

                // let closingDate = "no date found";
                // try{
                //     closingDate = e.querySelector('h6').innerText;

                // }catch(error){
                //     console.log('closing date',error);
                //     closingDate = "no date found";
                // }

                // let description = "";
                // try{

                // }catch(error){
                //     console.log("description",error);
                //     description = "";
                // }

                // const link = page1.url();


                // let updatedDateTime = "no date found";

                //     try{
                //         //updatedDateTime formattter
                //         function formatDate(inputDate) {
                //             const dateObj = new Date(inputDate);
                            
                //             // Create a new Intl.DateTimeFormat instance for the desired format
                //             const formatter = new Intl.DateTimeFormat('en-GB', {
                //                 day: '2-digit',
                //                 month: 'short',
                //                 year: 'numeric'
                //             });
                            
                //             return formatter.format(dateObj);
                //             }

                //         updatedDateTime = new Date().toLocaleDateString();
                //         updatedDateTime = formatDate(updatedDateTime);

                //     }catch(error){
                //         console.log('updatedDateTime',error);
                //     }




                //     return {title,
                //         agency,
                //         atmId,
                //         category,
                //         location,
                //         region,
                //         idNumber,
                //         publishedDate,
                //         closingDate,
                //         description,
                //         link,
                //         updatedDateTime}




            // }))

        //agency

        //atmID

        //category

        //location

        //region

        //idNumber

        //publishedDate

        //closingDate

        //description

        //link

        //updatedDateTime



    // console.log(ScrapedData);
    browser.close();
}catch(error){
    console.log(error);
    browser.close()
}

}

NSW_Albury();