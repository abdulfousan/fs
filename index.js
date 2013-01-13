var fs = null;
function init(then) {
  if(fs) {
    then(fs); return;
  }

  var rFS = window.requestFileSystem
    || window.webkitRequestFileSystem;

  rFS(window.PERSISTENT, 1024*1024, then);
}

exports.readFile = function(fileName, callback) {
  init(function(fs) {
    fs.root.getFile(fileName, {},
      function onSuccess(file) {
        var reader = new FileReader();

        reader.onloadend = function(e) {
          callback(null, this.result);
        };

        reader.readAsArrayBuffer(file);
      },
      function onError(err) {
        callback(err);
      });
  });
};

exports.writeFile = function(fileName, data, callback) {
  init(function(fs) {
    fs.root.getFile(fileName, {create: true}, function(fileEntry) {
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.onwriteend = function(e) {
          callback(null);
        };

        fileWriter.onerror = function(e) {
          callback(e.toString());
        };

        fileWriter.write(data);
      });
    });
  });
};

exports.removeFile = function(fileName, callback) {
  init(function(fs) {
    fs.root.getFile(fileName, {create:false}, function(fileEntry) {
      fileEntry.remove(callback);
    });
  });
};