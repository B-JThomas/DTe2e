const { test } = require('@playwright/test');

//change how long the test should run
const minutes = 30;

const convertedTime = minutes*60000;
test.setTimeout(convertedTime);

test('Test for broken links', async ({ browser }) => {
    //All websites we want to test
    const startUrl = [
        "https://3dsleep.com.au/",
        "https://3dsleepinstitute.com.au/",
        "https://aedauthority.com.au/",
        "https://baasarstone.com.au/",
        "https://bins4blokes.org.au/",
        "https://brimbankbusinesslink.com.au/",
        "https://cfaphysios.com.au/",
        "https://clearscopelegal.com.au/",
        "https://dawn.com.au/",
        "https://digitaltreasury.com.au/",
        "https://educationhorizons.com/",
        "https://farmcafe.com.au/",
        "https://www.goagainsttheflow.org.au/",
        "https://www.highettpodiatry.com.au/",
        "https://iharvestcoworking.com.au/",
        "https://www.inconfidence.org.au/",
        "https://intmowers.com.au/",
        "https://www.kitlegal.com.au/",
        "https://macdonnells.com.au/",
        "https://www.mansemedical.com.au/",
        "https://melbournefootclinic.com.au/",
        "https://www.melbourneheartcare.com.au/",
        "https://mepacs.com.au/",
        "https://merkle.com.au/",
        "https://motormoney.com.au/",
        "https://pelvicexercise4u.com/",
        "https://www.pelvicfloorfirst.org.au/",
        "https://www.pharmacysmart.com.au/",
        "https://purplefoods.com.au/",
        "https://richdaleplastics.com.au/",
        "https://scagaustralia.com.au/",
        "https://sentiaanalysis.com/",
        "https://www.sinclairdermatology.com.au/",
        "https://qcskinclinic.com.au/",
        "https://sleepwise.com.au/",
        "https://surgivision.com.au/",
        "https://www.itconsultants.com.au/",
        "https://taubepilates.com/",
        "https://thebatterybase.com.au/",
        "https://universalbiosensors.com/",
        "https://vacl.org.au/"
    ]

    //For Each Website
    for (let i = 0; i < startUrl.length; i++) {
        //Open new Browser & Context
        const context = await browser.newContext();
        const page = await context.newPage();

        //Define and visit URL
        const url = startUrl[i]
        await page.goto(url, { timeout: 60000 });

        //Gather Links
        const links = await page.$$('a');

        //Set fail count
        var fails = 0;
        var statusError = 0;
        var hrefFetchError = 0;

        //Error Handling
        function handleError(errorType) {
            if (errorType==1){
                statusError++;
            }else if(errorType==3){
                hrefFetchError++;
            }
            fails++;
        }

        function removeCommas(input) {
            if (typeof input === 'string') {
                return input.replace(/,/g, '');
            }
            return input;
        }

        //For Each link
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            try {
                //Get URL
                const href = await link.getAttribute('href', { timeout: 60000 });
                //Check Null
                if (href) {
                    //Check Root directory
                    if (href.startsWith(url)) {
                        try {
                            //Get Responce Status
                            const response = await page.evaluate(async (link) => {
                                const href = link.getAttribute('href');
                                const result = await fetch(href, { method: 'HEAD' });
                                return { status: result.status, href};
                            }, link);
                            if (response.status >= 400) {
                                const className = await link.getAttribute('class');
                                const textContent = await link.textContent();
                                console.log(`${url},Status 400,${removeCommas(textContent)},${removeCommas(className)},${href}`);
                                handleError(1);
                            } else if (response.status >= 300) {
                                const className = await link.getAttribute('class');
                                const textContent = await link.textContent();
                                console.log(`${url},Status 300,${removeCommas(textContent)},${removeCommas(className)},${href}`);
                                handleError(1);
                            }
                        } catch (error) {
                            handleError(3)
                        }
                    }
                }
                else {
                    handleError(3)
                }
            } catch (error) {
                const className = await link.getAttribute('class');
                const textContent = await link.textContent();
                console.log(`${url},Href,${removeCommas(textContent)},${removeCommas(className)},Null`);
                handleError(3)
            }
        }

        console.log(`${url},Attempts: ${links.length},Total: ${fails}, Href: ${hrefFetchError}, Status: ${statusError}`)
        //Close Browser/Context
        await page.close();
        await context.close();
    }
    csvStream.end();
});