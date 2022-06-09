"use strict";

const pup = require("puppeteer");
const fs = require("fs");

const site =
  "https://en.wikipedia.org/wiki/List_of_longest_rivers_of_the_United_States_(by_main_stem)";

const site2 = "https://en.wikipedia.org/wiki/World_War_I_casualties";

// capture a screen shot

const grabScreenshot = async (webPage) => {
  const filename = webPage.split("/").at(-1);

  const browser = await pup.launch();
  const page = await browser.newPage(); // launch new page

  await page.goto(webPage, { waitUntil: "networkidle2" }); //get screenshot
  console.log("Opened wiki page..");

  await page.screenshot({ path: `images/${filename}.png` }); // save the file
  console.log("Saved Screenshot...");

  await browser.close();
};

//grabScreenshot(site2);

// scrape some info

const getTable = async (webPage) => {
  const browser = await pup.launch();
  const page = await browser.newPage(); // launch new page

  await page.goto(webPage, { waitUntil: "networkidle2" }); //get screenshot
  console.log("Opened wiki page..");

  await page.waitForSelector("table.wikitable");

  const content = await page.$$eval("tbody > tr", (rows) => {
    return Array.from(rows, (row) => {
      const col = row.querySelectorAll("td");
      return Array.from(col, (c) => c.textContent.trim().replace(/['"]+/g, ""));
    });
  });

  await browser.close();

  console.log(content);
};

getTable(site);
