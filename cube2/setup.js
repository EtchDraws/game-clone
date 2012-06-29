
// Checks for features we cannot run without
// Note: Modify this for your needs. If your level does not use
//       texture compression, remove the check for it here.
(function() {
  function fail(text) {
    Module.preRun.push(function() {
      Module._main = null;
      alert(text);
    });
    throw text;
  }
  var canvas = document.createElement('canvas');
  if (!canvas) fail('No canvas element, halting.');
  var context = canvas.getContext('experimental-webgl');
  if (!context) fail('No WebGL, halting.');
  var s3tc = context.getExtension('WEBGL_compressed_texture_s3tc') ||
             context.getExtension('MOZ_WEBGL_compressed_texture_s3tc') ||
             context.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc');
  if (!s3tc) fail('No s3tc texture compression, halting');
})();

// Loading music. Will be stopped once the first frame of the game runs
Module.loadingMusic = new Audio();
Module.loadingMusic.src = 'OutThere_0.ogg';
Module.loadingMusic.play();

Module.postLoadWorld = function() {
  if (Module.loadingMusic) {
    Module.loadingMusic.pause();
    Module.loadingMusic = null;
  }
  Module.tweakDetail();
};

Module.autoexec = function(){}; // called during autoexec on load, so useful to tweak settings that require gl restart
Module.tweakDetail = function(){}; // called from postLoadWorld, so useful to make changes after the map has been loaded

(function() {
  var desired = 600; // for something like 600x600
  var w, h;
  if (screen.width >= screen.height) {
    h = desired;
    w = Math.floor(desired * screen.width / screen.height);
  } else {
    w = desired;
    h = Math.floor(desired * screen.height / screen.width);
  }
  Module.desiredWidth = w;
  Module.desiredHeight = h;
})();

// Public API
var BananaBread = {
  init: function() {
    BananaBread.setPlayerModelInfo = Module.cwrap('_ZN4game18setplayermodelinfoEPKcS1_S1_S1_S1_S1_S1_S1_S1_S1_S1_S1_b', null,
      ['string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'number']);
    BananaBread.execute = Module.cwrap('_Z7executePKc', 'number', ['string']);
    BananaBread.executeString = Module.cwrap('_Z10executestrPKc', 'string', ['string']);
  },
};

Module.postRun.push(BananaBread.init);
