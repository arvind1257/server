import Express from "express";
import { login, signup, usertype} from "../controllers/auth.js"
const router = Express.Router();

router.post('/signup',signup)
router.post('/login',login)
router.post('/usertype',usertype)

export default router;