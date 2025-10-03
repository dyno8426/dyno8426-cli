const fetch = require('node-fetch');
const { parseStringPromise } = require('xml2js');

// Goodreads RSS feed for your 'read' shelf
const FEED_URL = 'https://www.goodreads.com/review/list_rss/30211354?shelf=read';

exports.handler = async function(event, context) {
  try {
    const rssRes = await fetch(FEED_URL);
    if (!rssRes.ok) throw new Error('Failed to fetch RSS');
    const xml = await rssRes.text();
    const parsed = await parseStringPromise(xml, { explicitArray: false });
    const items = parsed.rss.channel.item;
    if (!items || items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No reviews found' })
      };
    }
    // If only one item, wrap in array
    const reviews = Array.isArray(items) ? items : [items];
    const random = reviews[Math.floor(Math.random() * reviews.length)];
    // Pick relevant fields
    const result = {
      title: random.title,
      link: random.link,
      pubDate: random.pubDate,
      description: random.description,
      author: random['author_name'],
      book: random['book_title'],
      book_link: random['book_link'],
      rating: random['user_rating'],
    };
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(result)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Unknown error' })
    };
  }
};
