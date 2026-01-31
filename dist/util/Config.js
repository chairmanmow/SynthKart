"use strict";
function loadConfig() {
    var configPath = js.exec_dir + 'synthkart.ini';
    var config = {
        general: {
            gameName: 'OUTRUN'
        },
        highscores: {
            server: 'file',
            port: 10088,
            serviceName: 'synthkart',
            filePath: 'highscores.json'
        },
        ansiTunnel: {
            directory: 'ansi_art',
            maxRows: 2000,
            scrollSpeed: 0.5
        }
    };
    if (!file_exists(configPath)) {
        logWarning('Config file not found: ' + configPath + ', using defaults');
        return config;
    }
    try {
        var file = new File(configPath);
        if (!file.open('r')) {
            logWarning('Failed to open config file: ' + configPath);
            return config;
        }
        var currentSection = '';
        var line;
        while ((line = file.readln()) !== null) {
            line = line.trim();
            if (line === '' || line.charAt(0) === ';' || line.charAt(0) === '#') {
                continue;
            }
            if (line.charAt(0) === '[' && line.charAt(line.length - 1) === ']') {
                currentSection = line.substring(1, line.length - 1).toLowerCase().replace(/_/g, '');
                continue;
            }
            var equals = line.indexOf('=');
            if (equals === -1)
                continue;
            var key = line.substring(0, equals).trim().toLowerCase().replace(/_/g, '');
            var value = line.substring(equals + 1).trim();
            if (value.length >= 2 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
                value = value.substring(1, value.length - 1);
            }
            if (currentSection === 'general') {
                if (key === 'gamename')
                    config.general.gameName = value;
            }
            else if (currentSection === 'highscores') {
                if (key === 'server') {
                    config.highscores.server = value;
                }
                else if (key === 'port') {
                    var p = parseInt(value, 10);
                    if (!isNaN(p) && p > 0)
                        config.highscores.port = p;
                }
                else if (key === 'servicename') {
                    config.highscores.serviceName = value;
                }
                else if (key === 'filepath') {
                    config.highscores.filePath = value;
                }
            }
            else if (currentSection === 'ansitunnel') {
                if (key === 'directory') {
                    config.ansiTunnel.directory = value;
                }
                else if (key === 'maxrows') {
                    var num = parseInt(value, 10);
                    if (!isNaN(num) && num > 0)
                        config.ansiTunnel.maxRows = num;
                }
                else if (key === 'scrollspeed') {
                    var speed = parseFloat(value);
                    if (!isNaN(speed) && speed > 0)
                        config.ansiTunnel.scrollSpeed = speed;
                }
            }
        }
        file.close();
    }
    catch (e) {
        logError('Error loading config file: ' + e);
    }
    if (config.highscores.filePath.charAt(0) !== '/' &&
        config.highscores.filePath.indexOf(':') === -1) {
        config.highscores.filePath = js.exec_dir + config.highscores.filePath;
    }
    if (config.ansiTunnel.directory.charAt(0) !== '/' &&
        config.ansiTunnel.directory.indexOf(':') === -1) {
        config.ansiTunnel.directory = js.exec_dir + config.ansiTunnel.directory;
    }
    logInfo('Config loaded: ansiDir=' + config.ansiTunnel.directory +
        ' hsServer=' + config.highscores.server);
    return config;
}
var OUTRUN_CONFIG = loadConfig();
