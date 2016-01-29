import {relative, isAbsolute} from 'path'
import FreeStyle from 'free-style'
import accepts from 'accepts'

const sheet = FreeStyle.create()
const className = sheet.registerStyle({
  font: '14px "Helvetica Neue", Helvetica, sans-serif',
  padding: '50px 80px',
  'h1, h2': {
    padding: '10px 0',
    margin: '0',
  },
  'h1': { fontSize: '2em'},
  'h2': {
    fontSize: '1.2em',
    fontWeight: '200',
    color: '#aaa',
  },
  'ul': {
    padding: '0 3em',
    listStyle: 'decimal',
  },
  '.message': { padding: '0 1em' },
  'p, li': {
    font: '0.9em monospace',
    lineHeight: '1.3'
  },
  'a': { textDecoration: 'none' }
})

export default ({JSX,debug=false}) => {
  const render = (error, status) =>
    <html>
      <head>
        <title>Error - {status}</title>
        <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0"/>
        <style>{sheet.getStyles()}</style>
      </head>
      <body className>
        <h1>Error</h1>
        {process.env.NODE_ENV != 'production' ? ErrorInfo(error) : null}
      </body>
    </html>

  const ErrorInfo = ({message,stack}) =>
    <div class="error">
      <h2>Message:</h2>
      <p class="message">{message}</p>
      <h2>Stack:</h2>
      <ul>{stack.split(/\n\s*at\s+/).slice(1).map(Frame)}</ul>
    </div>

  const Frame = (line) => {
    const match = /\((.*)\)$/.exec(line)
    if (match == null || !isAbsolute(match[1])) return <li>{line}</li>
    return <li>
      {line.slice(0, match.index)}
      <a type="text/plain" href={'file://' + match[1]}>
        {'./' + relative(process.cwd(), match[1])}
      </a>
    </li>
  }

  return ({req, res}, next) =>
    next().catch(e => {
      if (debug) console.error(e.stack)
      res.status = e.status || 500
      switch (accepts(req).type('text/plain', 'text/html')) {
        case 'text/html':
          res.set('Content-Type', 'text/html')
          res.body = '<!DOCTYPE html>' + render(e, res.status)
          break
        default:
          res.set('Content-Type', 'text/plain')
          res.body = e.stack
      }
    })
}
