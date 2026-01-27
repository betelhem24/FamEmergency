import express from 'express';
// I am importing express to manage the paths.

const router = express.Router();
// I am initializing the routing tool.

router.get('/test', (req, res) => {
// I am creating a test path to make sure contacts are working.
  res.send("Contact route is working");
});

export default router;
// I am sharing this file with the rest of the app.