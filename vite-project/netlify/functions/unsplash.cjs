const fetch = require('node-fetch');

// Netlify function to fetch a random photo from Unsplash user dyno8426
// Requires UNSPLASH_ACCESS_KEY to be set in Netlify environment variables

const UNSPLASH_USERNAME = 'dyno8426';
const UNSPLASH_API_URL = `https://api.unsplash.com/users/${UNSPLASH_USERNAME}/photos`;
const PHOTOS_PER_PAGE = 30; // Unsplash API max per_page is 30

function corsHeaders() {
  return { 'Access-Control-Allow-Origin': '*' };
}

exports.handler = async function(event, context) {
  try {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      return {
        statusCode: 500,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Missing Unsplash access key' })
      };
    }

    // Get total photo count for the user
    const userRes = await fetch(`https://api.unsplash.com/users/${UNSPLASH_USERNAME}?client_id=${accessKey}`);
    if (!userRes.ok) {
      return {
        statusCode: userRes.status,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Failed to fetch Unsplash user info' })
      };
    }
    const userData = await userRes.json();
    const totalPhotos = userData.total_photos || 0;
    if (totalPhotos === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'No photos found for this user' })
      };
    }

    // Pick a random photo index
    const randomIndex = Math.floor(Math.random() * totalPhotos);
    const page = Math.floor(randomIndex / PHOTOS_PER_PAGE) + 1;
    const indexOnPage = randomIndex % PHOTOS_PER_PAGE;

    // Fetch the page of photos
    const photosRes = await fetch(`${UNSPLASH_API_URL}?page=${page}&per_page=${PHOTOS_PER_PAGE}&client_id=${accessKey}`);
    if (!photosRes.ok) {
      return {
        statusCode: photosRes.status,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Failed to fetch Unsplash photos' })
      };
    }
    const photos = await photosRes.json();
    if (!Array.isArray(photos) || photos.length === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'No photos found on this page' })
      };
    }
    const photo = photos[indexOnPage] || photos[0];
    // Return relevant fields
    const result = {
      id: photo.id,
      description: photo.description || photo.alt_description || '',
      url: photo.urls?.regular || '',
      thumb: photo.urls?.thumb || '',
      full: photo.urls?.full || '',
      link: photo.links?.html || '',
      author: photo.user?.name || '',
      author_username: photo.user?.username || '',
      created_at: photo.created_at || '',
    };
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(result)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: err.message })
    };
  }
};
