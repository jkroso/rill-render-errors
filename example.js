import Rill from 'rill'
import error from './'

const app = new Rill

app.use(error)
app.get('/', () => { throw new Error('boom') })

app.listen(3000, () => console.log('http://localhost:3000'))
