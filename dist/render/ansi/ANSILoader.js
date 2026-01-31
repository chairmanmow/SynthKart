"use strict";
var ANSILoader = (function () {
    function ANSILoader() {
    }
    ANSILoader.ensureGraphicLoaded = function () {
        if (!ANSILoader._graphicLoaded) {
            try {
                load('graphic.js');
                ANSILoader._graphicLoaded = true;
                logInfo("ANSILoader: graphic.js loaded successfully");
            }
            catch (e) {
                logWarning("ANSILoader: Failed to load graphic.js - " + e);
            }
        }
    };
    ANSILoader.load = function (pathOrFilename, optDirectory) {
        ANSILoader.ensureGraphicLoaded();
        var path;
        if (pathOrFilename.indexOf('/') >= 0 || pathOrFilename.indexOf('\\') >= 0) {
            path = pathOrFilename;
        }
        else {
            var dir = optDirectory || ANSILoader.defaultDirectory;
            path = dir + '/' + pathOrFilename;
        }
        try {
            if (typeof file_exists === 'function' && !file_exists(path)) {
                logWarning("ANSI file not found: " + path);
                return null;
            }
            var graphic = new Graphic(80, 1);
            graphic.auto_extend = true;
            if (!graphic.load(path)) {
                logWarning("Failed to load ANSI file via Graphic: " + path);
                return null;
            }
            var width = graphic.width;
            var height = graphic.height;
            var cells = [];
            for (var row = 0; row < height; row++) {
                cells[row] = [];
                for (var col = 0; col < width; col++) {
                    var cell = graphic.data[col][row];
                    cells[row][col] = {
                        char: cell.ch || ' ',
                        attr: cell.attr || 7
                    };
                }
            }
            logInfo("ANSILoader: Loaded " + path + " (" + width + "x" + height + " actual size)");
            return {
                width: width,
                height: height,
                cells: cells
            };
        }
        catch (e) {
            logWarning("Error loading ANSI file: " + path + " - " + e);
            return null;
        }
    };
    ANSILoader.scanDirectory = function (dirPath) {
        var dir = dirPath || ANSILoader.defaultDirectory;
        var files = [];
        try {
            if (typeof directory === 'function') {
                var glob = dir + '/*.ans';
                var allFiles = directory(glob);
                if (allFiles && allFiles.length) {
                    for (var i = 0; i < allFiles.length; i++) {
                        files.push(allFiles[i]);
                    }
                }
            }
            logInfo("ANSILoader.scanDirectory: Found " + files.length + " files in " + dir);
        }
        catch (e) {
            logWarning("Error scanning ANSI directory: " + dir + " - " + e);
        }
        return files;
    };
    ANSILoader.defaultDirectory = '/sbbs/xtrn/outrun/ansi_art';
    ANSILoader._graphicLoaded = false;
    return ANSILoader;
}());
