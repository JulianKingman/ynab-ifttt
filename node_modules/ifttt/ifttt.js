var _ = require('underscore');
var util = require('util');

var ActionResource = require('./lib/resource/actionResource');
var ACTION_RESOURCE = 'action';

var TriggerResource = require('./lib/resource/triggerResource');
var TRIGGER_RESOURCE = 'trigger';

/**
 * Ifttt
 *
 * @param config
 * @param config.apiVersion
 * @param config.authMode
 * @param config.channelKey
 * @param config.logger
 * @param config.testAccessToken
 *
 * @constructor
 * @see https://developers.ifttt.com/docs/api_reference
 */
function Ifttt(config) {
  config = _.defaults(config || {}, {
    apiVersion: 'v1',
    authMode: 'header', // 'header', 'oauth2'
    logger: console,
    testAccessToken: ''
  });

  if (_.isUndefined(config.channelKey)) {
    throw new Error('Property `channelKey` is required.');
  }

  this.iftttApiVersion = config.apiVersion;

  // IFTTT channel key, needed for test setup verification.
  this.iftttChannelKey = config.channelKey;

  // IFTTT version basepath
  this.iftttBasepath = '/ifttt/' + this.iftttApiVersion;

  // IFTTT auth mode
  this.iftttAuthMode = config.authMode;

  // IFTTT test access token
  this.iftttTestAccessToken = config.testAccessToken;

  // Internal reference to desired logger.
  this.logger = config.logger; // Must support `info`, `error`, `warn`

  // Internal registry for actions & triggers.
  this.registry = {
    action: {},
    trigger: {}
  };

  // Internal registry for generic handlers.
  this.handlers = {
    status: null,
    user_info: null,
    test_setup_fake: null
  };

  // Internal storage of current user data for triggers / triggerFields.
  this.currentUserData = null;
}

Ifttt.prototype.addExpressRoutes = function(app) {
  var that = this;

  // Header check middleware wrapper.
  var headerCheck = function(req, res, next){
    that.accessCheck(req, res, next, {forceHeaderCheck: true});
  };

  // Auth check middleware wrapper.
  var authCheck = function(req, res, next){
    that.accessCheck(req, res, next);
  };

  /**
   * Implements IFTTT Channel status:
   *
   * Provide an API endpoint which IFTTT can periodically check for your
   * channel’s availability. This endpoint is not user-specific, and thus does
   * not require an access token.
   *
   * @see https://developers.ifttt.com/docs/api_reference#channel-status
   */
  app.get(this.iftttBasepath + '/status', headerCheck, function(req, res){
    if (!_.isFunction(that.handlers.status)) {
      return res.status(503).send();
    }

    that.handlers.status(req, function(err, available){
      if (available) {
        return res.status(200).send();
      }
      else {
        return res.status(503).send();
      }
    });
  });

  /**
   * Implements IFTTT User information:
   *
   * After acquiring an access token, IFTTT will make a request to your user
   * information endpoint. This information is considered private, and will only
   * be displayed to the user who activated your channel. Occasionally, IFTTT
   * will make requests to this endpoint to verify that the user’s access token
   * is still valid.
   *
   * @see https://developers.ifttt.com/docs/api_reference#user-information
   */
  app.get(this.iftttBasepath + '/user/info', authCheck, function(req, res){
    if (!_.isFunction(that.handlers.user_info)) {
      return res.status(500).send();
    }

    that.handlers.user_info(req, function(err, data){
      var response = that._handleResponse(err, data);
      that._sendExpressResponse(res, response);
    });
  });

  /**
   * Implements IFTTT Test setup:
   *
   * Before starting an automated test, the endpoint testing tool will send a
   * POST request to your channel API’s test/setup endpoint. This serves as a
   * signal to your API that a test is about to begin.
   *
   * For security, the endpoint testing tool will send your Channel Key in the
   * request to test/setup as a bearer token. Before performing any of the
   * above operations, you should verify that the value of the bearer token
   * matches the value for your Channel Key, as displayed in the Developer UI.
   *
   * @see https://developers.ifttt.com/docs/testing#the-testsetup-endpoint
   */
  app.post(this.iftttBasepath + '/test/setup', headerCheck, function(req, res){
    if (req.get('IFTTT-Channel-Key') !== that.iftttChannelKey) {
      return res.status(401).send('Unauthorized');
    }

    that.generateTestSetupSample(function(samples){
      var setupResponse = {
        accessToken: that.iftttTestAccessToken,
        samples: samples
      };

      var response = that._handleResponse(null, setupResponse);
      that._sendExpressResponse(res, response);
    });
  });

  /**
   * Implements IFTTT Triggers:
   *
   * Each trigger requires a unique API endpoint. For each recipe using a given
   * trigger, IFTTT will poll that trigger’s endpoint once about every 15
   * minutes. For each new item returned by the trigger, IFTTT will fire the
   * recipe’s associated action.
   *
   * @see https://developers.ifttt.com/docs/api_reference#triggers
   */
  app.post(this.iftttBasepath + '/triggers/:trigger_slug', authCheck, function(req, res){
    var trigger_slug = req.param('trigger_slug');
    var payload = req.body;

    that.getTriggerResponse(trigger_slug, req, payload, function(response){
      that._sendExpressResponse(res, response);
    });
  });

  /**
   * Implements IFTTT Trigger fields:
   *
   * Trigger fields can have dynamic options and dynamic validation. Each dynamic
   * option and validation requires a unique endpoint.
   *
   * @see https://developers.ifttt.com/docs/api_reference#trigger-fields
   */
  app.post(this.iftttBasepath + '/triggers/:trigger_slug/fields/:trigger_field_slug/options', authCheck, function(req, res){
    var trigger_slug = req.param('trigger_slug');
    var trigger_field_slug = req.param('trigger_field_slug');

    that.getTriggerFieldOptionsResponse(trigger_slug, trigger_field_slug, req, function(response){
      that._sendExpressResponse(res, response);
    });
  });

  app.post(this.iftttBasepath + '/triggers/:trigger_slug/fields/:trigger_field_slug/validate', authCheck, function(req, res){
    var trigger_slug = req.param('trigger_slug');
    var trigger_field_slug = req.param('trigger_field_slug');
    var payload = req.body;

    that.getTriggerFieldValidateResponse(trigger_slug, trigger_field_slug, req, payload, function(response){
      that._sendExpressResponse(res, response);
    });
  });

  /**
   * Implements IFTTT Actions:
   *
   * Each action requires a unique API endpoint.
   *
   * @see https://developers.ifttt.com/docs/api_reference#actions
   */
  app.post(this.iftttBasepath + '/actions/:action_slug', authCheck, function(req, res){
    var action_slug = req.param('action_slug');
    var payload = req.body;

    that.getActionResponse(action_slug, req, payload, function(response){
      that._sendExpressResponse(res, response);
    });
  });

  /**
   * Implements IFTTT Action fields:
   *
   * Action fields can have dynamic options. Each dynamic option requires a
   * unique endpoint. Unlike trigger fields, action fields do not currently
   * support dynamic validation.
   *
   * @see https://developers.ifttt.com/docs/api_reference#action-fields
   */
  app.post(this.iftttBasepath + '/actions/:action_slug/fields/:action_field_slug/options', authCheck, function(req, res){
    var action_slug = req.param('action_slug');
    var action_field_slug = req.param('action_field_slug');

    that.getActionFieldOptionsResponse(action_slug, action_field_slug, req, function(response){
      that._sendExpressResponse(res, response);
    });
  });

  this.logger.info('Added IFTTT express routes.');
};

Ifttt.prototype.accessCheck = function(req, res, next, options) {
  var that = this;

  options = _.defaults(options || {}, {
    forceHeaderCheck: false
  });

  // Either we run auth mode 'header' and we check the header for each request,
  // or we force this header check for specific endpoints (status, test/setup).
  if (this.iftttAuthMode === 'header' || options.forceHeaderCheck) {
    if (req.get('IFTTT-Channel-Key') !== this.iftttChannelKey) {
      this.logger.warn('Invalid IFTTT-Channel-Key header.');
      return res.status(401).send('Unauthorized');
    }
  }

  // If we run auth mode 'oauth2', we use the provided middleware to check the
  // oauth2 session. If no middleware is provided, we assume the check was
  // already done earlier in the request.
  if (this.iftttAuthMode === 'oauth2' && !options.forceHeaderCheck && !_.isUndefined(this.oauth2middleware)) {
    this.oauth2middleware(req, res, function(err){
      if (err) {
        var response = that._handleResponse(err, null);
        return that._sendExpressResponse(res, response);
      }

      next();
    });
  }
  else {
    next();
  }
};

Ifttt.prototype._sendExpressResponse = function(res, response) {
  return res.status(response.status).send(response.body);
};

/**
 * Prepare an response for IFTTT.
 *
 * @param err
 * @param data
 * @see https://developers.ifttt.com/docs/api_reference#general-api-requirements
 */
Ifttt.prototype._handleResponse = function(err, data) {
  var response = {
    status: null,
    body: {}
  };

  if (err) {
    var errResponse = {};

    // Make sure we get a valid error object, otherwise we create one.
    if (!_.isObject(err) || !err.message) {
      errResponse = {
        message: err.toString()
      };
    }
    else {
      errResponse.message = err.message;

      if (err.status) {
        errResponse.status = err.status;
      }
    }

    response.status = err.statusCode || 500;
    response.body.errors = [errResponse];
  }
  else {
    response.status = 200;
    response.body.data = data;
  }

  return response;
};

/**
 * Registers a resource.
 *
 * @param type
 * @param resource
 */
Ifttt.prototype._registerResource = function(type, resource) {
  this.registry[type][resource.getSlug()] = resource;
};

/**
 * Returns all resources of given type.
 *
 * @param type
 */
Ifttt.prototype._getResources = function(type) {
  return this.registry[type];
};

/**
 * Returns a resource.
 *
 * @param type
 * @param slug
 */
Ifttt.prototype._getResource = function(type, slug) {
  return this.registry[type][slug];
};

/**
 * Returns a resource.
 *
 * @param type
 * @param slug
 */
Ifttt.prototype._getResource = function(type, slug) {
  return this.registry[type][slug];
};

/**
 * Get the response for a resource.
 */
Ifttt.prototype._getResourceResponse = function(type, slug, req, payload, cb) {
  var that = this;
  var resource = this._getResource(type, slug);

  if (!resource) {
    var err = new Error('Unknown ' + type + '.');
    this.logger.error(err);

    var response = this._handleResponse(err);
    return cb(response);
  }

  this.logger.log(util.format('_getResourceResponse - type: %s, slug: %s, payload: %j', type, slug, payload));

  resource.getResponse(req, payload, function(err, data){
    var response = that._handleResponse(err, data);
    return cb(response);
  });
};

/**
 * Get response for a field method.
 */
Ifttt.prototype._getFieldMethodResponse = function(type, slug, field_slug, method, req, payload, cb) {
  var that = this;
  var resource = this._getResource(type, slug);

  if (!resource) {
    var err = new Error('Unknown ' + type + '.');
    this.logger.error(err);

    var response = this._handleResponse(err);
    return cb(response);
  }

  var field = resource.getField(field_slug);

  if (!field) {
    var err = new Error('Unknown ' + type + ' field.');
    this.logger.error(err);

    var response = this._handleResponse(err);
    return cb(response);
  }

  switch (method) {
  case 'options':
    field.options(req, function(err, data){
      var response = that._handleResponse(err, data);
      return cb(response);
    });
    break;
  case 'validate':
    field.validate(req, payload, function(err, data){
      var response = that._handleResponse(err, data);
      return cb(response);
    });
    break;
  }
};

/**
 * Generate sample data for test/setup endpoint.
 */
Ifttt.prototype.generateTestSetupSample = function(cb) {
  var samples = {
    triggers: {},
    triggerFieldValidations: {},
    actions: {},
    actionRecordSkipping: {}
  };

  var triggers = this.getTriggers();

  _.each(triggers, function(trigger){
    var fields = trigger.getFields();

    if (fields) {
      samples.triggers[trigger.getSlug()] = {};

      _.each(fields, function(field){
        var sampleData = field.getOptionsSampleData();
        if (!_.isUndefined(sampleData.valid)) {
          samples.triggers[trigger.getSlug()][field.getSlug()] = sampleData.valid;
        }

        if (!_.isUndefined(sampleData.invalid)) {
          samples.triggerFieldValidations[trigger.getSlug()] = samples.triggerFieldValidations[trigger.getSlug()] || {};
          samples.triggerFieldValidations[trigger.getSlug()][field.getSlug()] = sampleData;
        }
      });
    }
  });

  var actions = this.getActions();

  _.each(actions, function(action){
    var fields = action.getFields();

    if (fields) {
      samples.actions[action.getSlug()] = {};

      _.each(fields, function(field){
        var sampleData = field.getOptionsSampleData();
        if (!_.isUndefined(sampleData.valid)) {
          samples.actions[action.getSlug()][field.getSlug()] = sampleData.valid;
        }

        if (field.isRequired()) {
          samples.actionRecordSkipping[action.getSlug()] = samples.actionRecordSkipping[action.getSlug()] || {};
          samples.actionRecordSkipping[action.getSlug()][field.getSlug()] = '';
        }
      });
    }
  });

  return cb(samples);
};

/**
 * Action shortcuts:
 */
Ifttt.prototype.registerAction = function(action) {
  this._registerResource(ACTION_RESOURCE, action);
};

Ifttt.prototype.getActions = function() {
  return this._getResources(ACTION_RESOURCE);
};

Ifttt.prototype.getAction = function(slug) {
  return this._getResource(ACTION_RESOURCE, slug);
};

Ifttt.prototype.getActionResponse = function(slug, req, payload, cb) {
  this._getResourceResponse(ACTION_RESOURCE, slug, req, payload, cb);
};

Ifttt.prototype.getActionFieldOptionsResponse = function(slug, field_slug, req, cb) {
  this._getFieldMethodResponse(ACTION_RESOURCE, slug, field_slug, 'options', req, null, cb);
};

Ifttt.Action = ActionResource;

/**
 * Trigger shortcuts:
 */
Ifttt.prototype.registerTrigger = function(trigger) {
  this._registerResource(TRIGGER_RESOURCE, trigger);
};

Ifttt.prototype.getTriggers = function() {
  return this._getResources(TRIGGER_RESOURCE);
};

Ifttt.prototype.getTrigger = function(slug) {
  return this._getResource(TRIGGER_RESOURCE, slug);
};

Ifttt.prototype.getTriggerResponse = function(slug, req, payload, cb) {
  this._getResourceResponse(TRIGGER_RESOURCE, slug, req, payload, cb);
};

Ifttt.prototype.getTriggerFieldOptionsResponse = function(slug, field_slug, req, cb) {
  this._getFieldMethodResponse(TRIGGER_RESOURCE, slug, field_slug, 'options', req, null, cb);
};

Ifttt.prototype.getTriggerFieldValidateResponse = function(slug, field_slug, req, value, cb) {
  this._getFieldMethodResponse(TRIGGER_RESOURCE, slug, field_slug, 'validate', req, value, cb);
};

Ifttt.Trigger = TriggerResource;

module.exports = Ifttt;
