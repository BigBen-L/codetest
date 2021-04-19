const puppeteer = require("puppeteer");
const uuid = require("uuid");

import { writeFile } from "fs";
import { resolve } from "path";
import Hero from "../../models/hero";

async function getHeroes() {
  const START_URL = "https://www.marvel.com/characters";
  const heroes: Hero[] = [];

  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );

  console.log('Getting heroes from website', START_URL);
  await page.goto(START_URL);

  await page.setViewport({
    width: 1920,
    height: 1024
  });
  console.log('reset viewport');

  let data = await page.evaluate(() => {
    let name: any = document.querySelectorAll('p[class="card-body__headline"]');
    let photo: any = document.querySelectorAll('div.card-thumb-frame > figure.img__wrapper > img');
    let result = []

    for (let index = 0; index < 12; index++) {
      result.push({ id: index.toString(), name: name[index].innerText, photo: photo[index].src })
    }
    return result
  })

  console.log('get basic info of heroes')

  let links: any = await page.evaluate(()=> {
    let href: any = document.querySelectorAll('a.explore__link')
    let res = []
    for (let index = 0; index < 12; index++) {
      res.push(href[index].href)
    }
    return res
  })

  console.log('get bio links for heroes')

  for (let index = 0; index < 12; index++) {
    await page.goto(links[index])
    await page.waitFor(1000)
    const bio: any = await page.evaluate(() => {
      const description: any = document.querySelector('div.masthead__copy')
      let res = description.innerText
      return res
    })
    data[index].bio = bio
  }

  console.log('all data have been copied')
  await browser.close();

  writeFile(
    resolve(__dirname, "../heroes.json"),
    JSON.stringify(data, null, 2),
    err => {
      if (err) {
        throw err;
      }
      console.log("Finished writing file");
    }
  );
}

getHeroes();
