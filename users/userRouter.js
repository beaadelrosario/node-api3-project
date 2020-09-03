const express = require("express");
const userDb = require("./userDb");
const postDb = require("../posts/postDb");
const router = express.Router();

router.post("/", validateUser, (req, res) => {
  userDb.insert(req.body)
  .then(response => {
    res.status(200).json(response)
  })
  .catch((error) => {
    res.status(500).json({ message: "not working", error: error });
  });
});

router.post("/:id/posts", validateUserId, validatePost,(req, res) => {
  const newPost = {
    text: req.body.text,
    user_id: req.user.id,
  }
  postDb.insert(newPost)
  .then((response) => {
    res.status(201).json({message: response})
  })
  .catch((error) => {
    res.status(500).json({ message: "not working", error: error });
  });
});

router.get("/", (req, res) => {
  // res.status(200).json({message:"success"})
  userDb.get()
    .then((response) => {
      // console.log(response)
      res.status(200).json({ data: response });
    })
    .catch((error) => {
      res.status(500).json({ message: "not working", error: error });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  userDb.getUserPosts(req.user.id)
  .then(response => {
    res.status(200).json({data: response})
  })
  .catch((error) => {
    res.status(500).json({ message: "not working", error: error });
  });
});

router.delete("/:id", validateUserId, (req, res) => {
  userDb.remove(req.user.id)
    .then((response) => {
      if (response > 0) {
        res.status(200).json({ message: "user was removed from db" });
      } else {
        res.status(404).json({ message: "user does not exist" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "not working", error: error });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  userDb.update(req.user.id, req.body)
  .then((response) => {
    if (response > 0) {
      res.status(200).json({ message: "user was updated" });
    } else {
      res.status(404).json({ message: "user does not exist" });
    }
  })
  .catch((error) => {
    res.status(500).json({ message: "not working", error: error });
  });
});

//custom middleware

function validateUserId(req, res, next) {
  console.log("from mw", req.params.id);
  const id = req.params.id;

  userDb.getById(id)
    .then((response) => {
      console.log(response);
      if (response) {
        req.user = response;
        next();
      } else {
        res.status(400).json({ message: "missing user data" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "not working", error: error });
    });
}

function validateUser(req, res, next) {
  console.log("from mw req body", req.body);
  const name = req.body.name;

  if (name) {
    next();
  } else if (name === "") {
    res.status(400).json({ message: "missing user data" });
  } else {
    res.status(400).json({ message: "missing required name field" });
  }
}

function validatePost(req, res, next) {
  const text = req.body.text;

  if (text) {
    next();
  } else if (text === "") {
    res.status(400).json({ message: "missing text data" });
  } else {
    res.status(400).json({ message: "missing required text field" });
  }
}

module.exports = router;
