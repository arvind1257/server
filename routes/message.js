import Express from "express"
import { Post,Delete } from "../controllers/message.js"

const router = Express.Router()

router.post('/message',Post)
router.post('/delete',Delete)
export default router