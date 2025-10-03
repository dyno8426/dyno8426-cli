
// Use native fetch if available, otherwise fallback to node-fetch (for Node <18)
let fetchFn: typeof fetch;
try {
  fetchFn = fetch;
} catch {
  fetchFn = require('node-fetch');
}
const { parseStringPromise } = require('xml2js');

// API endpoint: /api/goodreads-random
// Vite/Node/Express style handler
export default async function handler(req: any, res: any) {
  const FEED_URL = 'https://www.goodreads.com/review/list_rss/30211354';
  try {
  const rssRes = await fetchFn(FEED_URL);
    if (!rssRes.ok) throw new Error('Failed to fetch RSS');
    const xml = await rssRes.text();
    const parsed = await parseStringPromise(xml, { explicitArray: false });
    const items = parsed.rss.channel.item;
    if (!items || items.length === 0) {
      res.status(404).json({ error: 'No reviews found' });
      return;
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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
}
