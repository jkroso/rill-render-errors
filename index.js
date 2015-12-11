import {relative, isAbsolute} from 'path'
import {JSX} from 'mana'

export default ({req, res}, next) =>
  next().catch(e => {
    res.status = e.status || 500
    res.set('Content-Type', 'text/html')
    res.body = '<!DOCTYPE html>' + render(e, res.status)
  })

const css = `
  body {
    padding: 50px 80px;
    font: 14px "Helvetica Neue", Helvetica, sans-serif;
  }
  h1, h2 {
    margin: 0;
    padding: 10px 0;
  }
  h1 {
    font-size: 2em;
  }
  h2 {
    font-size: 1.2em;
    font-weight: 200;
    color: #aaa;
  }
  ul {
    padding: 0 3em;
    list-style: decimal;
  }
  .message {
    padding: 0 1em;
  }
  p, li {
    font: 0.9em monospace;
    line-height: 1.3;
  }
  a {
    text-decoration: none;
  }
`

const render = (error, status) =>
  <html>
    <head>
      <title>Error - {status}</title>
      <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0"/>
      <style>{css}</style>
    </head>
    <body>
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
