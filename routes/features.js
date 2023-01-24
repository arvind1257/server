import Express from "express"
import { Add, Display, Modify, Delete, Setting } from "../controllers/features.js"

const router = Express.Router()

router.post('/add',Add)
router.post('/display',Display)
router.post('/modify',Modify)
router.post('/delete',Delete)
router.post('/setting',Setting)

export default router