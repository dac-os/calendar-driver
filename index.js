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

  return httpRequest(uri + '/calendars?page=' + page, function (error, res, body) {
    var calendars;
    if (error) {
      error = new VError(error, 'error requesting events');
      return next(error);
    }
    try {
      calendars = JSON.parse(body);
      return next(null, calendars);
    } catch (error) {
      error = new VError(error, 'error parsing calendars to json');
      return next(error);
    }
  });
};

exports.calendar = function (id, next) {
  'use strict';

  return httpRequest(uri + '/calendars/' + id, function (error, res, body) {
    var calendar;
    if (error) {
      error = new VError(error, 'error requesting calendar "$s"', id);
      return next(error);
    }
    try {
      calendar = JSON.parse(body);
      return next(null, calendar);
    } catch (error) {
      error = new VError(error, 'error parsing calendar "$s" to json', id);
      return next(error);
    }
  });
};

exports.events = function (calendar, page, next) {
  'use strict';

  return httpRequest(uri + '/calendars/' + calendar + '/events?page=' + page, function (error, res, body) {
    var events;
    if (error) {
      error = new VError(error, 'error requesting calendar "$s" events', calendar);
      return next(error);
    }
    try {
      events = JSON.parse(body);
      return next(null, events);
    } catch (error) {
      error = new VError(error, 'error parsing calendar "$s" events to json', calendar);
      return next(error);
    }
  });
};

exports.event = function (calendar, id, next) {
  'use strict';

  return httpRequest(uri + '/calendars/' + calendar + '/events/' + id, function (error, res, body) {
    var event;
    if (error) {
      error = new VError(error, 'error requesting event "$s"', id);
      return next(error);
    }
    try {
      event = JSON.parse(body);
      return next(null, event);
    } catch (error) {
      error = new VError(error, 'error parsing event "$s" to json', id);
      return next(error);
    }
  });
};
