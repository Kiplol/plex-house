const express = require('express')
const app = express()
const port = 3000
const sylph = 'http://47.156.145.253:18934'
const plexToken = 'gkZp-GYsCatnMshA7JsM'

var multer = require('multer');
var upload = multer({ dest: '/tmp/' });

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.listen(process.env.PORT || port, () => {
  console.log(`Plex House app listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
  //  res.send('Hello World!' + req)

  var request = require('request');
  var options = {
    url: `${sylph}/status/sessions`,
    method: 'GET',
    headers: {
      'X-Plex-Token': plexToken,
      'accept': 'application/json'
    }
  };

  function callback(error, response, body) {
    console.log(body);
    var info = JSON.parse(body)
    var mediaContainer = info["MediaContainer"]
    var size = mediaContainer["size"]
    if (size == 0) {
      res.send()
      return
    }
    var metadata = mediaContainer["Metadata"][0]
    var username = metadata["User"]["title"]
    if (username != "ekipper") {
        res.send()
        return
    }
    res.render('test.ejs',  metadataToViewOptions(metadata));
  }
  request(options, callback);
})

app.post('/plexhook', upload.single('thumb'), (req, res, next) => {
  var payload = JSON.parse(req.body.payload);
  console.log('Got webhook for', payload);
  res.status(200).end() // Responding is important
})

function metadataToViewOptions(metadata) {
    var art = metadata["parentThumb"] || metadata["thumb"] || metadata["art"] || ""
    var artURL = sylph + art + `?X-Plex-Token=${plexToken}`
    var title = metadata["title"]
    var mediaType = metadata["type"]
    var subtitle = ""
    if (mediaType == "movie") {
        subtitle = metadata["tagline"] || metadata["year"] || ""
    } else if (mediaType == "episode") {
        subtitle = metadata["grandparentTitle"] + ", " + metadata["parentTitle"] + " Episode " + (parseInt(metadata["index"]))
    }
    return { art_url: artURL, media_title: title, media_subtitle: subtitle}
}
