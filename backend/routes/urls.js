const express = require('express');
const validator = require('validator');
const ShortURL = require('../models/ShortURL');
const ClickLog = require('../models/ClickLog');
const { nanoid } = require('nanoid');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const geoip = require('geoip-lite');
const router = express.Router();
const clientUrl = process.env.CLIENT_URL;
// Get user's short URLs (protected, filter non-expired)
router.get('/', auth, async (req, res) => {
  try {
    const now = new Date();
    const urls = await ShortURL.find({ 
      userId: req.user._id, 
      $or: [
        { expireAt: { $gt: now } },
        { expireAt: null }
      ]
    }).sort({ createdAt: -1 }).limit(20);
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Shorten URL (protected)
router.post('/shorten', auth, async (req, res) => {
  try {
    console.log('Shorten route entered. Body:', req.body);
    console.log('Shorten: Auth passed, user ID:', req.user?._id);
    if (!req.user?._id) return res.status(401).json({ error: 'User not authenticated' });

    const { originalUrl, customAlias, password, maxClicks, expireAt } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ error: 'URL required' });
    }

    // Fix: Ensure protocol for validation
    let validatedUrl = originalUrl;
    if (!validatedUrl.startsWith('http://') && !validatedUrl.startsWith('https://')) {
      validatedUrl = 'https://' + validatedUrl;
    }

    if (!validator.isURL(validatedUrl, { require_protocol: true })) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    let shortCode = customAlias || nanoid(6);

    if (customAlias) {
      const existing = await ShortURL.findOne({ customAlias });
      if (existing) return res.status(400).json({ error: 'Alias taken!' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const expireDate = expireAt ? new Date(expireAt) : null;
    if (expireAt && isNaN(expireDate.getTime())) {
      return res.status(400).json({ error: 'Invalid expire date' });
    }

    const newUrl = new ShortURL({
      originalUrl: validatedUrl,
      shortCode,
      customAlias: customAlias || null,
      password: hashedPassword,
      maxClicks: parseInt(maxClicks) || 0,
      expireAt: expireDate,
      userId: req.user._id
    });

    const savedUrl = await newUrl.save();
    console.log('Shorten: Saved successfully, ID:', savedUrl._id);

    res.json({ shortLink: `${process.env.BASE_URL}/${shortCode}` });

  } catch (err) {
    console.error('Shorten route error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Redirect (public)
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await ShortURL.findOne({ shortCode });

    if (!url) return res.status(404).send('Not found');

    if (url.expireAt && new Date() > url.expireAt) {
      return res.status(410).send('Link expired (date reached)');
    }

    if (url.password) {
  const { pw } = req.query;
  if (!pw || !(await bcrypt.compare(pw, url.password))) {
    // Fix: Redirect to frontend password page on port 5173 (Vite)
   return res.redirect(`${clientUrl}/password/${shortCode}`);
  }
}

    if (url.maxClicks > 0 && url.clicks >= url.maxClicks) {
      return res.status(410).send('Link expired (max clicks reached)');
    }

    const clientIp = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'Unknown';
    const geo = geoip.lookup(clientIp) || {};
    const click = new ClickLog({
      shortUrl: url._id,
      referrer: req.get('Referrer'),
      ip: clientIp,
      country: geo.country || 'Unknown',
      city: geo.city || 'Unknown'
    });
    await click.save();
    url.clicks += 1;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get analytics (protected)
router.get('/:shortCode/analytics', auth, async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await ShortURL.findOne({ shortCode, userId: req.user._id });
    if (!url) return res.status(404).send('Not found or not yours');

    const clicks = await ClickLog.find({ shortUrl: url._id })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({
      url,
      clicks: clicks.map(c => ({
        timestamp: c.timestamp,
        referrer: c.referrer || 'Direct',
        ip: c.ip,
        country: c.country,
        city: c.city
      }))
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});
// Validate password for protected URL (public, returns JSON)
router.get('/:shortCode/validate', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { pw } = req.query;
    const url = await ShortURL.findOne({ shortCode });

    if (!url) return res.status(404).json({ error: 'Not found' });

    if (url.expireAt && new Date() > url.expireAt) {
      return res.status(410).json({ error: 'Link expired (date reached)' });
    }

    if (url.maxClicks > 0 && url.clicks >= url.maxClicks) {
      return res.status(410).json({ error: 'Link expired (max clicks reached)' });
    }

    if (url.password) {
      if (!pw || !(await bcrypt.compare(pw, url.password))) {
        return res.status(401).json({ error: 'Invalid password' });
      }
    }

    // Success: Return originalUrl (frontend redirects)
    res.json({ originalUrl: url.originalUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Delete URL (protected)
router.delete('/:shortCode', auth, async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await ShortURL.findOne({ shortCode, userId: req.user._id });
    if (!url) return res.status(404).json({ error: 'Not found or not yours' });

    await ClickLog.deleteMany({ shortUrl: url._id });
    await ShortURL.findByIdAndDelete(url._id);

    res.json({ message: 'URL deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;