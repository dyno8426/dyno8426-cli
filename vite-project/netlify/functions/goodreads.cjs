const fetch = require('node-fetch');
const xml2js = require('xml2js');

// Replace with your Goodreads RSS feed URL or accept as query param
const GOODREADS_RSS_URL = 'https://www.goodreads.com/review/list_rss/30211354?shelf=read';

function corsHeaders() {
  return { 'Access-Control-Allow-Origin': '*' };
}

exports.handler = async function(event, context) {
  try {
    const res = await fetch(GOODREADS_RSS_URL);
    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Failed to fetch Goodreads RSS' })
      };
    }
    const xml = await res.text();
    const parser = new xml2js.Parser();
    const feed = await parser.parseStringPromise(xml);
    const reviews = feed.rss.channel[0].item;
    if (!reviews || reviews.length === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'No reviews found' })
      };
    }
    // Pick a random review
    const review = reviews[Math.floor(Math.random() * reviews.length)];
    const book = {
      title: review.title?.[0] || '',
      author: review['author_name']?.[0] || '',
      book: review['book_title']?.[0] || '',
      pubDate: review.pubdate?.[0] || '',
      description: review['user_review']?.[0] || '',
      link: review.link?.[0] || '',
      rating: review.user_rating?.[0] || ''
    };
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(book)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: err.message })
    };
  }
};
