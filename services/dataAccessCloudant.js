exports.insert = function(cloudant, req, res) {
  var mydb = cloudant.db.use('audit')
  // ...and insert a document in it.
  if(! req.body.audit._id) req.body.audit._id = req.body.audit.crn + '_' + req.body.audit.timestamp;
  mydb.insert(req.body.audit, function(err, body, header) {
    if (err) {
      return console.log('[mydb.insert] ', err.message);
    }
    console.log('You have inserted the record.');
    res.json({'result': 'sucecss'});
  });
}

exports.query = function(cloudant, req, res) {
  var mydb = cloudant.db.use('audit')
  mydb.list({ include_docs: true }, function(err, body) {
  if (!err) {
    body.rows.forEach(function(doc) {
      // console.log(doc);
    });
    res.json(body.rows);
  } else {
    return console.log('[mydb.list] ', err.message);
  }
});
}
