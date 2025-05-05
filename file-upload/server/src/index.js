const app = require('./app');
const config = require('./config');

const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 