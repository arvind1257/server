import Express from "express"
import { Post, Display } from "../controllers/contact.js"

const router = Express.Router()

router.post('/feedback',Post)
router.get('/display',Display)

export default router