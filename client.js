requirejs.config({
	baseUrl: 'lib'
});


requirejs(["Chuck/Chuck"], function(Chuck) {
	Chuck.init();
});