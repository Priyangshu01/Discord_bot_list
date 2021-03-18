let router = require("express").Router();
let auth = require("@utils/auth.js");
router.use(require("express").json());

router.get("/", async (req, res)=>{
    const key = await auth.getAccess(req.query.code);
    res.cookie('key', key, {
     maxAge: 86400 * 1000 * 90,
     httpOnly: true,
     secure: true
    });
    await res.redirect(process.env.DOMAIN);
});
router.get("/user", async (req, res)=>{
 if(req.query.key || req.cookies['key']){
  try {
  const user = await auth.getUser(req.query.key || req.cookies['key']);
  await res.json(user);
 }
  catch(e){
   res.json({error: e});
  }
 }
 else res.json({error: "no_key"});
});
module.exports = router;