const axios = require('axios');
const cheerio = require('cheerio'); // You will need to install this

exports.handler = async () => {
  try {
    const url = process.env.KIT_PUBLIC_FEED_URL;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const items = [];

    // This finds your 4 posts on your public Kit page
    $('.creator-profile-feed-item').each((i, el) => {
      items.push({
        title: $(el).find('h2').text().trim(),
        link: "https://essam-shamim.kit.com" + $(el).find('a').attr('href'),
        date: $(el).find('.date').text().trim(),
        slug: $(el).find('a').attr('href').split('/').pop()
      });
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};