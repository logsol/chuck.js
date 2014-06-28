define([
    'http', 
    'node-static',
    'Server/Api'
], 

function (http, nodeStatic, Api) {

    function HttpServer (options, coordinator) {
        options.port = options.port || 1234;
        options.caching = typeof options.caching != 'undefined' ? options.caching : 3600;
        options.rootDirectory = options.rootDirectory || './';

        this.server = null;
        this.api = new Api(coordinator);

        this.init(options);
    }

    HttpServer.prototype.init = function (options) {
        var self = this;

        var fileServer = new nodeStatic.Server(options.rootDirectory, { cache: options.caching });

        this.server = http.createServer(
            function (req, res) {
                
                var fullBody = '';
                req.addListener('data', function(chunk) { // doesn't work on Jeenas computer without this
                    fullBody += chunk.toString();
                });

                req.addListener('error', function(err) {
                    console.log('');
                });


                req.addListener('end', function () {

                    switch(true) {
                        case req.url == '/':
                            fileServer.serveFile('./static/html/index.html', 200, {}, req, res);
                            console.checkpoint('HTTP Server serves index');
                            break;

                        case req.url == '/client.js':
                            fileServer.serveFile('./client.js', 200, {}, req, res);
                            break;

                        case req.url == '/require.js':
                            fileServer.serveFile('./node_modules/requirejs/require.js', 200, {}, req, res);
                            break;

                        case req.url == '/screenfull.js':
                            fileServer.serveFile('./node_modules/screenfull/dist/screenfull.js', 200, {}, req, res);
                            break;

                        case req.url == '/api':
                            self.api.handleCall(fullBody);
                            var status = self.api.isError ? 400 : 200;
                            res.writeHead(status, {"Content-Type": self.api.getContentType()});
                            res.end(self.api.getOutput());
                            self.api.isError = false;
                            break;

                        case new RegExp(/^\/app/).test(req.url):
                            fileServer.serve(req, res, function () {
                                self.handleFileError(res)
                            });
                            break;

                        case new RegExp(/^\/static/).test(req.url):
                            fileServer.serve(req, res, function () {
                                self.handleFileError(res)
                            });
                            break;

                        default:
                            self.handleFileError(res);
                            break;
                    }
                });
            }
        );

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

    HttpServer.prototype.handleFileError = function (res) {
        res.writeHead(404, {'Content-Type': 'text/html'}); 
        res.end('<h1>404 not ... found</h1>'); 
    }

    return HttpServer;
});