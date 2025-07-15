define([
    'express',
    'http',
    'path',
    'Server/Api',
    'fs'
], 

function (express, http, path, Api, fs) {

    "use strict";

    function HttpServer (options, coordinator) {
        options.port = options.port || 1234;
        options.rootDirectory = options.rootDirectory || './';

        this.api = new Api(coordinator);
        this.app = express();
        this.server = http.createServer(this.app);
        this.init(options);
    }

    HttpServer.prototype.init = function (options) {
        var self = this;
        var app = this.app;

        // Serve static files
        app.use('/static', express.static(path.join(options.rootDirectory, 'static')));
        app.use('/app', express.static(path.join(options.rootDirectory, 'app')));

        // Serve index.html at root
        app.get('/', function(req, res) {
            res.sendFile(path.resolve(options.rootDirectory, 'static/html/index.html'));
        });

        // Serve client.js and minified version
        app.get('/client.js', function(req, res) {
            if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(options.rootDirectory, 'build/client.min.js'))) {
                res.sendFile(path.resolve(options.rootDirectory, 'build/client.min.js'));
            } else {
                res.sendFile(path.resolve(options.rootDirectory, 'client.js'));
            }
        });
        app.get('/client.min.js', function(req, res) {
            res.sendFile(path.resolve(options.rootDirectory, 'build/client.min.js'));
        });

        // Serve require.js, screenfull.js, chart.js from node_modules
        app.get('/require.js', function(req, res) {
            res.sendFile(path.resolve(options.rootDirectory, 'node_modules/requirejs/require.js'));
        });
        app.get('/screenfull.js', function(req, res) {
            res.sendFile(path.resolve(options.rootDirectory, 'static/vendor/screenfull.js'));
        });
        app.get('/chart.js', function(req, res) {
            // Chart.js v4 uses 'dist/chart.umd.js'
            res.sendFile(path.resolve(options.rootDirectory, 'node_modules/chart.js/dist/chart.umd.js'));
        });

        // API endpoint
        app.post('/api', express.text({type: '*/*'}), function(req, res) {
            self.api.handleCall(req.body);
            var status = self.api.isError ? 400 : 200;
            res.status(status).type(self.api.getContentType()).send(self.api.getOutput());
            self.api.isError = false;
        });

        // 404 handler
        app.use(function(req, res) {
            res.status(404).send('<h1>404 not ... found</h1>');
        });

        this.server.once('error', function(err) {
            if(err.code == 'EADDRINUSE') {
                console.error('port already in use. Closing.');
            } else {
                throw new Error(err);
            }
        });

        this.server.listen(options.port);
        console.checkpoint('start HTTP server');
    }

    HttpServer.prototype.getServer = function () {
        return this.server;
    }

    return HttpServer;
});