const https = require('https');
const url = require('url');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const envelope = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body;
    const piece = envelope.split('\n')[0];
    const header = JSON.parse(piece);
    const dsn = url.parse(header.dsn);
    const projectId = dsn.pathname.replace('/', '');

    const sentryHost = dsn.hostname;
    const sentryPath = `/api/${projectId}/envelope/`;

    return new Promise((resolve) => {
      const req = https.request(
        {
          hostname: sentryHost,
          path: sentryPath,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-sentry-envelope',
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              headers: {
                'Access-Control-Allow-Origin': '*',
              },
              body: data,
            });
          });
        }
      );

      req.on('error', (e) => {
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: e.message }),
        });
      });

      req.write(envelope);
      req.end();
    });
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid Sentry envelope' }),
    };
  }
};
