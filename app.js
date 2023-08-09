require('dotenv').config({ path: "./config/.env" });
require('express-async-errors');


// * Configuring CLient
const path = require("path");

// extra security packages
const helmet = require('helmet');
// ! Not required in Jobster
// const cors = require('cors');
const xss = require('xss-clean');
// ! Not required in Jobster
// const rateLimiter = require('express-rate-limit');

// ! Not required in Jobster
// Swagger
// const swaggerUI = require('swagger-ui-express');
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./swagger.yaml');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
// routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// ! Not required in Jobster
// app.set('trust proxy', 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//   })
// );

// FrontEnd
app.set('trust proxy', 1);
app.use(express.static(path.resolve(__dirname, './client/build')));
app.use(express.json());
app.use(helmet());
// ! Not required in Jobster
// app.use(cors());
app.use(xss());

// ! Not required in Jobster
// app.get('/', (req, res) => {
//   res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
// });
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

// ! Serve index.html for every route other than API ROute
app.get("*", (req,res) => {
  return res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
