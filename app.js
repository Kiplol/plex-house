const express = require('express')
const app = express()
const port = 3000
const sylph = 'http://47.156.149.100:18934'
const plexToken = 'gkZp-GYsCatnMshA7JsM'

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
    // res.send("Watching " + title + "<br>Yay!<br><img src=\"" + artURL + "\">")
    res.send("<img src=\"" + artURL + "\">")
  }
  request(options, callback);
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// curl -H "X-Plex-Token: gkZp-GYsCatnMshA7JsM" 'http://sylph.local:32400/status/sessions'
// curl -H "X-Plex-Token: gkZp-GYsCatnMshA7JsM" 'http://47.156.149.100:18934/status/sessions'
