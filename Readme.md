# rill-render-errors

Error rendering middleware for rill

## Installation

`npm install jkroso/rill-render-error`

then in your app:

```js
import errorHandler from 'rill-render-error'
import Rill from 'rill'

const app = new Rill
app.use(errorHandler({JSX: React.createElement}))
app.get('/', () => { throw new Error('boom') })
app.listen(3000)
```
