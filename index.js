var VError, httpRequest, async, uri;
VError = require('verror');
httpRequest = require('request');
async = require('async');

exports.configUri = function (newUri) {
  'use strict';

  uri = newUri;
};

function downloadPages(url, next) {
  'use strict';

  var lastPage, results, lastLength;
  results = [];
  lastLength = 0;
  lastPage = 0;
  async.doWhilst(function (next) {
    return httpRequest({
      'url'  : uri + url,
      'json' : true,
      'qs'   : {'page' : lastPage}
    }, function (error, res, body) {
      if (error) {
        return next(error);
      }
      results = results.concat(body);
      lastLength = body.length;
      lastPage++;
      return next();
    });
  }, function () {
    return lastLength > 0;
  }, function (error) {
    return next(error, results);
  });
}

exports.calendars = function (next) {
  'use strict';

  return downloadPages('/calendars', next);
};

exports.calendar = function (id, next) {
  'use strict';

  return httpRequest({
    'url'  : uri + '/calendars/' + id,
    'json' : true
  }, function (error, res, body) {
    next(error, body);
  });
};

exports.events = function (calendar, next) {
  'use strict';

  return downloadPages('/calendars/' + calendar + '/events', next);
};

exports.event = function (calendar, id, next) {
  'use strict';

  return httpRequest({
    'url'  : uri + '/calendars/' + calendar + '/events/' + id,
    'json' : true
  }, function (error, res, body) {
    next(error, body);
  });
};
