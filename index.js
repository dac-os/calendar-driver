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

/**
 * Validates if a date is between two events in the calendar
 * @param todayDate
 * @param yearEventBefore
 * @param idEventBefore
 * @param yearEventAfter
 * @param idEventAfter
 * @param next
 */
exports.betweenEvents = function (todayDate, yearEventBefore, idEventBefore, yearEventAfter, idEventAfter, next) {
  'use strict';

  this.event(yearEventBefore, idEventBefore, function (error, enrollmentStartEvent) {
    if (error) {
      error = new VError(error, 'Error when trying to get the calendar event');
      next(error);
    }

    this.event(yearEventAfter, idEventAfter, function (error, enrollmentEndEvent) {
      if (error) {
        error = new VError(error, 'Error when trying to get the calendar event');
        next(error);
      }

      next(!error && !!enrollmentStartEvent && !!enrollmentEndEvent &&
        new Date(enrollmentStartEvent.date) <= todayDate &&
        todayDate < new Date(enrollmentEndEvent.date));
    }.bind(this));
  }.bind(this));
}
