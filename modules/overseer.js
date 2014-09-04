define(["model"], function (Model) {
  return function Overseer () {
    var overseer = Model(),
        runtime = {};

    overseer.when("config", function (config) {
      // TODO handle setting config multiple times
      Object.keys(config).forEach(function (alias) {
        var options = config[alias],
            module = options.module;

        // Do not pass the module into the model configuration.
        delete options.module;

        require(["modelContrib/" + module], function (constructor) {
          var model = constructor(overseer);
          runtime[alias] = model;
          model.set(options);
        });
      });
    });

    // Gets a model by alias. May be asynchronous
    // if the model has not yet been constructed.
    function getModel(alias, callback) {

      var model = runtime[alias] ? runtime[alias]: null;

      // If the model is already loaded,
      if(model){

        // call the callback immediately,
        callback(model);
      } else {

        // otherwise, wait until the model has loaded by polling.
        setTimeout(function () {
          getModel(alias, callback);
        }, 0);
      }
    }

    // Expose getModel to the public Overseer API.
    overseer.getModel = getModel;

    return overseer;
  };
});
