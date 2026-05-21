const express = require('express');
const router = express.Router();

const validUrl = require('valid-url');
const shortid = require('shortid');

const Url = require('../models/Url');

const baseUrl = process.env.BASE;

// =============================
// Create Short URL
// POST /shorten
// =============================
router.post('/shorten', async (req, res) => {

  const { longUrl, expiry } = req.body;

  const expiryHours = expiry || 24;

  const expireAt = new Date(
      Date.now() + expiryHours * 60 * 60 * 1000
  );

  // Validate Base URL
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json('Invalid Base URL');
  }

  // Generate Short Code
  const urlCode = shortid.generate();

  try {

    // Validate Long URL
    if (validUrl.isUri(longUrl)) {

      const shortUrl = `${baseUrl}/${urlCode}`;

      // Check Existing URL
      let url = await Url.findOne({ longUrl });

      if (url) {
        return res.json(url);
      }

      // Create New URL
      url = new Url({
        longUrl,
        shortUrl,
        urlCode,
        expireAt,
        date: new Date()
      });

      await url.save();

      return res.json(url);

    } else {
      return res.status(401).json('Invalid Long URL');
    }

  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }

});

// =============================
// Redirect Short URL
// GET /:code
// =============================
router.get('/:code', async (req, res) => {

  try {

    const url = await Url.findOne({
      urlCode: req.params.code
    });

    if (url) {

      // Check Expiry
      if (url.expireAt < new Date()) {
        return res.status(410).send('This short URL has expired');
      }

      return res.redirect(url.longUrl);

    } else {
      return res.status(404).send('No URL Found');
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }

});

module.exports = router;