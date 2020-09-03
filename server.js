const express = require('express');
const postRouter = require("./posts/postRouter");
const userRouter = require("./users/userRouter");

const server = express();
server.use(express.json());
server.use("/api/posts", postRouter);
server.use("/api/users", userRouter);

server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

// Start by defining a function that shows our current predicament at the console as the application loads.We’ll write middleware that logs information about every request that comes into our server. 
function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url})}`
  );
  next();
}
// Then add it as the first middleware in the queue. server.use(logger); ABOVE

function validateUserId(id) {
  return function (req, res, next) {
    if (req.headers.id === id) {
      next();
    } else {
      res.status(400).json({ message: "missing required name field" });
    }
  };
}

module.exports = server;
