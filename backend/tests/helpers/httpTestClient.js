const createTestClient = (app) => {
  let server;
  let baseUrl;

  const start = async () => {
    if (server) {
      return;
    }

    await new Promise((resolve) => {
      server = app.listen(0, "127.0.0.1", resolve);
    });

    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
  };

  const stop = async () => {
    if (!server) {
      return;
    }

    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    server = null;
    baseUrl = null;
  };

  const request = async (path, options = {}) => {
    await start();

    const response = await fetch(`${baseUrl}${path}`, options);
    const bodyText = await response.text();
    let body = null;

    if (bodyText) {
      body = JSON.parse(bodyText);
    }

    return {
      status: response.status,
      body,
      headers: response.headers,
    };
  };

  return { request, start, stop };
};

module.exports = { createTestClient };
