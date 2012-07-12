requirejs.config({
	baseUrl: 'lib'
});

var inspector = {};

requirejs(["Chuck/View/View"], function(View) {
	var view = new View();
});