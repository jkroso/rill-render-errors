import error from './easy'
import Rill from 'rill'

const app = new Rill

app.use(error)
app.get('/', () => { throw new Error('boom') })

app.listen(3000, () => console.log('http://localhost:3000'))
