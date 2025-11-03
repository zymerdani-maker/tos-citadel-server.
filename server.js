 const express = require('express');
    const fetch = require('node-fetch');
    const cors = require('cors');
    require('dotenv').config();

    const app = express();
    app.use(express.json());
    app.use(cors()); // Allow requests from any origin

    const OPENAI_KEY = process.env.OPENAI_KEY;
    const NEWSAPI_KEY = process.env.NEWSAPI_KEY;

    app.post('/openai', async (req, res) => {
      try {
        const prompt = req.body.prompt;
        const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: "You are TOS AI." }, { role: "user", content: prompt }]
          })
        });
        const jsonResponse = await apiResponse.json();
        res.json(jsonResponse);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get('/news', async (req, res) => {
      try {
        const query = encodeURIComponent(req.query.q || 'news');
        const url = `https://newsapi.org/v2/everything?q=${query}&pageSize=3&language=en`;
        const apiResponse = await fetch(url, { headers: { 'X-Api-Key': NEWSAPI_KEY }});
        const jsonResponse = await apiResponse.json();
        res.json(jsonResponse);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`TOS Citadel Server running on port ${PORT}`));
    
    



