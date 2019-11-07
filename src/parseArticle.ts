import Axios from "axios";

import cheerio from 'cheerio';

export async function parseArticle(url: string) {
  const html = await Axios.get(url, { responseType: 'text'}).then(res => res.data);
  const $ = cheerio.load(html);
  const title = $('title').text().split('|')[0].trim();
  debugger
  const content = $('.dre-site-wrapper__content').text();
  return {
    url,
    title,
    content,
  };
}
