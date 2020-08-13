const express = require('express')
const app = express()
const port = 3000
const sylph = 'http://47.156.149.100:18934'
const plexToken = 'gkZp-GYsCatnMshA7JsM'

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

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
    var art = metadata["art"]
    var artURL = sylph + art + "?X-Plex-Token=gkZp-GYsCatnMshA7JsM"
    var title = metadata["title"]
    console.log(artURL);
    // res.send(fitToDashboard(artURL))
    // res.send("<img src=\"" + artURL + "\">")
    res.render('test.ejs', { art_url: artURL, media_title: title} );
  }
  request(options, callback);
})

app.post('/plexhook', (req, res, next) => {
  var payload = JSON.parse(req.body);
  console.log('Got webhook for', payload);
  res.status(200).end() // Responding is important
})

function fitToDashboard(artURL) {
  var width = 900
  var height = 1440
  var style = "width:" + width + "px; height:" + height + "px;"
  return "<img src=\"" + artURL + "\"style=\"" + style + "\">"
}

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
