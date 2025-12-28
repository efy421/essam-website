const Parser = require("rss-parser");

exports.handler = async () => {
  try {
    const FEED_URL = process.env.BEEHIIV_RSS_URL;

    if (!FEED_URL) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing BEEHIIV_RSS_URL" }),
      };
    }

    const parser = new Parser();
    const feed = await parser.parseURL(FEED_URL);

    const items = (feed.items || []).slice(0, 6).map(item => ({
      title: item.title || "",
      link: item.link || "",
      date: item.isoDate || item.pubDate || "",
      category: (item.categories && item.categories[0]) || "Journal",
    }));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
