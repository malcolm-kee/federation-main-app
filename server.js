require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');

const express = require('express');
const { parse } = require('node-html-parser');
const { Client } = require('pg');

const dbClient = new Client({
  connectionString: process.env.DB_CONNECTIONG_STRING,
});

const connectionTask = dbClient.connect();

const app = express();
const port = process.env.PORT || 3000;

const htmlContent = fs.readFileSync(path.resolve('dist/index.html'), 'utf-8');

async function getAppUrls() {
  await connectionTask;
  const queryResult = await dbClient.query(
    `SELECT app_name, url FROM app_versions WHERE latest IS TRUE;`
  );

  const result = {};

  queryResult.rows.forEach((row) => {
    result[row.app_name] = row.url;
  });

  return result;
}

function serverIndexHtml(response) {
  getAppUrls().then((urls) => {
    const $html = parse(htmlContent);

    const $title = $html.querySelector('title');

    $title.insertAdjacentHTML(
      'afterend',
      `<script>var appUrls = ${JSON.stringify(urls)};</script>`
    );

    Object.values(urls).forEach((url) =>
      $title.insertAdjacentHTML(
        'afterend',
        `<link rel="preload" as="script" href="${url}/remoteEntry.js" />`
      )
    );

    response.send($html.toString());
  });
}

app.use(express.static('dist', { index: false }));

app.get('/', (_, res) => serverIndexHtml(res));

app.use('/', (req, res, next) => {
  if ((req.method === 'GET' || req.method === 'HEAD') && req.accepts('html')) {
    serverIndexHtml(res);
  } else next();
});

app.listen(port, () => console.log(`HelloNode app listening on port ${port}!`));