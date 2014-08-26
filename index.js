var VError, httpRequest, async, uri;
VError = require('verror');
httpRequest = require('request');
async = require('async');

exports.configUri = function (newUri) {
  'use strict';

  uri = newUri;
};

exports.calendars = function (page, next) {
  'use strict';

  return httpRequest({
    'url'  : uri + '/calendars',
    'json' : true,
    'qs'   : {'page' : page}
  }, function (error, res, body) {
    next(error, body);
  });
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

exports.events = function (calendar, page, next) {
  'use strict';

  return httpRequest({
    'url'  : uri + '/calendars/' + calendar + '/events',
    'json' : true,
    'qs'   : {'page' : page}
  }, function (error, res, body) {
    next(error, body);
  });
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
