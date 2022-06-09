"use strict";

import fetch from "node-fetch";
import express from "express";
import fs from "fs";
import { title } from "process";

const app = express();

app.use(express.static("public"));

const api =
  "https://www.reddit.com/r/rocketry/comments/4fvsm9/please_tell_me_why_rocket_engines_are_so_hard_to.json";

const askReddit = "https://www.reddit.com/r/AskReddit.json";

const singleComment =
  "https://www.reddit.com/r/AskReddit/comments/uxeieq/what_simple_advice_can_drastically_improve.json";

const newPage =
  "https://www.reddit.com/r/tifu/comments/uyu1hn/tifu_by_pranking_my_dad_that_i_28f_was_en_route.json";
const mainPage = async function (site) {
  try {
    const res = await fetch(site);
    const body = await res.json();
    const section = body.data.children;

    console.log(`This section has ${section.length} parts.`);

    for (const item of section) {
      console.log(`${section.indexOf(item)}: ${item.data.title}`);
      console.log("");
      console.log(item.data.url);
      console.log("");
    }
  } catch (err) {
    console.log(err.message);
  }
};

const singlePage = async function (site) {
  try {
    const res = await fetch(site);
    const body = await res.json();

    const sectionTitle = body[0].data.children;
    console.log("Section Title");
    console.log(sectionTitle.length);
    console.log(sectionTitle[0].data.title);
    console.log(sectionTitle[0].data.url);
    console.log("");

    const sectionBody = body[1].data.children;
    console.log("Section Body");
    console.log(sectionBody.length);
    for (let i = 0; i < 25; i++) {
      console.log(`This is section ${i}`);
      console.log(sectionBody[i].data.author);
      console.log(sectionBody[i].data.body);
      console.log(!(sectionBody[i].data.replies === ""));
      const replies = sectionBody[i].data.replies;
      try {
        if (replies === "") {
          console.log("this post has no replies");
        } else {
          console.log(
            `This post has ${sectionBody[i].data.replies.data.children.length} replies.`
          );
        }
      } catch (err) {
        console.log(err.message);
      }
      console.log("");
    }
  } catch (err) {}
};

const convDate = (date) => new Date(date * 1000).toLocaleString();

const testFunc = async function (site) {
  try {
    const res = await fetch(site);
    const body = await res.json();
    const sectionBody = body[0].data.children[0].data.title;
    //const result = buildComm(body);
    console.log(sectionBody);
    // for (let i = 0; i < 10; i++) {
    //   const section = body[1].data.children[i];
    //   const replies = section.data.replies.data.children[0];
    //   console.log(replies.data.body);
    //   console.log("*****************");
    // }
  } catch (err) {
    console.log(err.message);
  }
};

const createMainJson = async function (site) {
  try {
    const res = await fetch(site);
    const body = await res.json();
    const pageObj = [];
    const sectionBody = body.data.children;
    for (let i = 0; i < sectionBody.length; i++) {
      const instanceObj = {};
      instanceObj.title = sectionBody[i].data.title;
      instanceObj.subreddit = sectionBody[i].data.subreddit;
      instanceObj.author = sectionBody[i].data.name;
      instanceObj.url = sectionBody[i].data.url;
      pageObj.push(instanceObj);
    }
    return pageObj;
  } catch (err) {
    console.log(err.message);
  }
};

const buildFull = function (section) {
  try {
    const titleArray = [];
    const titleObj = {};
    const sectionBody = section[0].data.children[0].data;
    titleObj.title = sectionBody.title;
    titleObj.subreddit = sectionBody.subreddit;
    titleObj.created = sectionBody.created;
    titleObj.author = sectionBody.author;
    titleObj.num_comments = sectionBody.num_comments;
    titleObj.url = sectionBody.url;
    titleObj.comments = buildComm(section);
    titleArray.push(titleObj);
    return titleArray;
  } catch (err) {
    console.log(err.message);
  }
};

const buildReply = function (section) {
  try {
    const repArray = [];
    const sectionBody = section.data.replies.data.children[0];
    const repObj = {};
    repObj.body = sectionBody?.data.body;
    repObj.body_html = sectionBody?.data.body_html;
    repObj.author = sectionBody?.data.author;
    repObj.created = sectionBody?.data.created;
    repObj.depth = sectionBody?.data.depth;
    repObj.permalink = sectionBody?.data.permalink;
    repArray.push(repObj);
    return repArray;
  } catch (err) {
    console.log(err.message, "error in replies");
  }
};

const buildComm = function (section) {
  const comArray = [];
  const sectionBody = section[1].data.children;
  let pass = 0;
  for (const item of sectionBody) {
    console.log(`This is pass ${pass}`);
    const comObj = {};
    comObj.body = item.data?.body;
    comObj.body_html = item.data?.body_html;
    comObj.author = item.data?.author;
    comObj.created = item.data?.created;
    comObj.depth = item.data?.depth;
    comObj.permalink = item.data?.permalink;
    comObj.reply = buildReply(item);
    comArray.push(comObj);
    pass++;
  }
  return comArray;
};

const createComJson = async (site) => {
  try {
    const res = await fetch(site);
    const body = await res.json();
    const pageObj = [];
    const sectionTitle = body[0].data.children[0].data.author;
    const sectionBody = body[1].data.children;
    for (let i = 0; i < sectionBody.length; i++) {
      const instanceObj = {};
      instanceObj.title = sectionBody[i].data.title;
      instanceObj.subreddit = sectionBody[i].data.subreddit;
      instanceObj.author = sectionBody[i].data.name;
      instanceObj.url = sectionBody[i].data.url;
      pageObj.push(instanceObj);
    }
  } catch (err) {
    console.log(err.message);
  }
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("Could not write to file!");
      resolve("Success!");
    });
  });
};

const writeMainJsonFile = async (site) => {
  try {
    const data = await createMainJson(site);
    const name = site.split("/").at(-1);
    await writeFilePro(`${name}`, JSON.stringify(data));
  } catch (err) {
    console.log(err.message);
  }
};

const writeSubJsonFile = async (site) => {
  try {
    const res = await fetch(site);
    const body = await res.json();
    const data = await buildFull(body);
    const name = site.split("/").at(-1);
    await writeFilePro(`${name}`, JSON.stringify(data));
  } catch (err) {
    console.log(err.message);
  }
};

//writeJsonFile(askReddit);

//testFunc(singleComment);

writeSubJsonFile(newPage);

//mainPage(askReddit);

//console.log(data[1].data.children.length);

//const text1 = data[0].data.children[0].data.selftext;
//const text2 = data[1].data.children[10].data.body;

//console.log(`Question:\n\n${text1}\n\nResponce:\n\n${text2}`);

app.get("/", (req, res) => {
  res.send("Hello From the Server");
});

export { app };
