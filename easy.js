import middleware from './index'
import {JSX} from 'mana'

const debug = process.env.NODE_ENV != 'production'

export default middleware({JSX, debug})
