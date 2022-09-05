# Vue Webplayer
Music player based on vue framework and pure node.js, it works locally with mp3 files and jpg covers.

## Installation
After copying repo you need to install dependencies. Then run server and vue app.

```bash
cd client
npm i
npm run serve
cd ../server
npm i
node server.js
```

## Usage
Inside server/static/mp3 is an example album directory. Server reads all catalogues in static/mp3 as albums. Name of directory is also a name of album and inside should be placed mp3 files and optionally cover named cover.jpg, other file extensions are not readable. Besides that new album can be made with admin page on port 3000.