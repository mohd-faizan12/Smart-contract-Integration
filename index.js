const express = require("express");
const app = express();
const router=require('./route');

const port = 4000;
app.use(express.json());
app.use('/apis',router);
router.get('/', (req, res) => {
  res.json("server started");
});

app.listen(port, () => console.log(`listening on port ${port}`));
module.exports=app;