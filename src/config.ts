import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://qingmu.me/",
  author: "青木",
  desc: "一个程序员",
  title: "青木",
  ogImage: "/assets/og.png",
  lightAndDarkMode: true,
  postPerPage: 3,
};

export const LOCALE = ["zh-CN"]; // set to [] to use the environment default

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/stringke",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
];
