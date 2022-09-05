const http = require('http')
const fs = require('fs')
const formidable = require('formidable')


const Datastore = require('nedb')

var playlist = new Datastore({
    filename: 'playlist.db',
    autoload: true
});

const server = http.createServer(function (req, res) {
    switch (req.method) {
        case "GET":
            if (req.url === "/admin") {
                fs.readFile(__dirname + "/static/admin/admin.html", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                })
            }
            if (req.url === "/style.css") {
                fs.readFile(__dirname + "/static/admin/style.css", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/css' });
                    res.write(data);
                    res.end();
                })
            }
            if (req.url === "/script.js") {
                fs.readFile(__dirname + "/static/admin/script.js", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/javascript' });
                    res.write(data);
                    res.end();
                })
            }
            if (req.url === "/getAlbums") {
                fs.readdir(__dirname + "/static/mp3", function (err, files) {
                    let albumsList = []
                    if (err) {
                        return console.log(err);
                    }
                    // tu można operować na zczytanych nazwach plików / katalogów
                    files.forEach(function (dirName) {
                        let songs = []
                        let album = {}
                        album.name = dirName
                        let content = fs.readdirSync(__dirname + "/static/mp3/" + dirName)
                        content.forEach(f => {
                            if (f.slice(-4) == ".jpg" || f.slice(-4) == ".png") {
                                album.cover = f
                            }
                            if (f.includes(".mp3")) {
                                songs.push(f)
                            }
                        })
                        if (album.cover == undefined) {
                            album.cover = "../../basicCover.jpg"
                        }
                        album.songs = songs
                        albumsList.push(album)
                    });
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.end(JSON.stringify(albumsList))
                });
            }
            if (req.url.slice(-4) === ".jpg" || req.url.slice(-4) === ".png") {
                fs.readFile("." + req.url, function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'image' });
                    res.write(data);
                    res.end();
                })
            }
            if (req.url.slice(-4) === ".mp3") {
                fs.readFile("." + decodeURI(req.url), function (error, data) {
                    fs.stat("." + decodeURI(req.url), function (e, d) {
                        res.writeHead(200, {
                            'Content-Type': 'audio/mpeg',
                            "Content-Length": d.size,
                            "Accept-Ranges": "bytes"
                        })
                        res.write(data);
                        res.end();
                    })

                })
            }
            if (req.url === "/getPlaylist") {
                playlist.find({}, function (err, docs) {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.writeHead(200, { 'Content-Type': 'plain/text' });
                    function compare(a, b) {
                        if (a.songId < b.songId) {
                            return -1;
                        }
                        if (a.songId > b.songId) {
                            return 1;
                        }
                        return 0;
                    }

                    docs.sort(compare);
                    res.end(JSON.stringify(docs));
                })
            }

            break;
        case "POST":
            if (req.url === "/addPlaylistElement") {
                let allData = ""
                let songId
                req.on("data", function (data) {
                    allData += data
                })

                req.on("end", function (data) {
                    allData = JSON.parse(allData)
                    playlist.count({}, function (err, count) {
                        songId = count
                        allData.songId = songId
                        playlist.insert(allData)
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.writeHead(200, { 'Content-Type': 'plain/text' });
                        res.end(JSON.stringify(allData));
                    })
                })


            }

            if (req.url === "/clearPlaylist") {
                playlist.remove({}, { multi: true }, function (err, docs) {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.writeHead(200, { 'Content-Type': 'plain/text' });
                    res.end(JSON.stringify(""));
                })
            }

            if (req.url === "/uploadAlbum") {
                let form = formidable({})

                form.keepExtensions = true
                form.uploadDir = "static/mp3"

                form.parse(req, function (err, fields, files) {
                    let num = 1
                    while (fs.existsSync("static/mp3/album" + num)) {
                        num++
                    }
                    fs.mkdirSync("static/mp3/album" + num)
                    for (let i = 0; files["file" + i] != undefined; i++) {
                        fs.rename(files["file" + i].path, "static\\mp3\\album" + num + "\\" + files["file" + i].name, function (err, data) {
                        })
                    }
                    res.end();
                });
            }
            break;
    }
})

server.listen(3000, function () {
    console.log("Server starts on port 3000.")
})