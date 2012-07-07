define(['http', 'node-static'], function(http, nodeStatic) {

	function HttpServer(options) {
		options.port = options.port || 1234;
		options.caching = options.caching || true;
		options.rootDirectory = options.rootDirectory || './';

		this.server = null;

		this.init(options);
	}

	HttpServer.prototype.init = function(options) {
		var self = this;

		var fileServer = new nodeStatic.Server(options.rootDirectory, { cache: options.caching });

		this.server = http.createServer(
			function(req, res){
				req.addListener('end', function () {
					switch(true) {
						case req.url == '/':
							fileServer.serveFile('./static/html/index.html', 200, {}, req, res);
							break;

						case req.url == '/client.js':
							fileServer.serveFile('./client.js', 200, {}, req, res);
							break;

						case req.url == '/require.js':
							fileServer.serveFile('./node_modules/requirejs/require.js', 200, {}, req, res);
							break;

						case new RegExp(/^\/lib/).test(req.url):
							fileServer.serve(req, res, function(){
								self.handleFileError(res)
							});
							break;

						case new RegExp(/^\/static/).test(req.url):
							fileServer.serve(req, res, function(){
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
		this.server.listen(options.port);
	}

	HttpServer.prototype.getServer = function(){
		return this.server;
	}

	HttpServer.prototype.handleFileError = function (res){
		res.writeHead(404, {'Content-Type': 'text/html'}); 
		res.end('<h1>404 not ... found</h1>'); 
	}

	return HttpServer;
});