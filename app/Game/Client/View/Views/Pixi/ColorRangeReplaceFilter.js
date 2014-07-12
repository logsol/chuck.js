define([
    "Lib/Vendor/Pixi"
],
 
function (PIXI) {

    var Parent = PIXI.AbstractFilter;
 
    function ColorRangeReplaceFilter() {
        Parent.call(this);

        this.passes = [this];

        // set the uniforms
        
        this.uniforms = {
            minColor: {type: '3fv', value: [0,0,0]},
            maxColor: {type: '3fv', value: [0,0,0]},
            newColor: {type: '3fv', value: [0,0,0]},
            brightnessOffset: {type: '1f', value: 0}
        };

        this.fragmentSrc = [
            'precision mediump float;',
            'varying vec2 vTextureCoord;',
            'varying vec4 vColor;',
            'uniform sampler2D uSampler;',
            'uniform vec3 minColor;',
            'uniform vec3 maxColor;',
            'uniform vec3 newColor;',
            'uniform float brightnessOffset;',

            'void main(void) {',
            '   vec4 pixel = texture2D(uSampler, vTextureCoord);',
            '   if(pixel.x >= minColor.x && pixel.y >= minColor.y && pixel.z >= minColor.z',
            '      && pixel.w == 1.0',
            '      && pixel.x <= maxColor.x && pixel.y <= maxColor.y && pixel.z <= maxColor.z) {',

            '         pixel.rgb = mix(pixel.rgb, vec3(0.2126*pixel.r + 0.7152*pixel.g + 0.0722*pixel.b), 1.0);', // desaturate to gray
            '         pixel.rgb += brightnessOffset;',
            '         pixel.rgb *= newColor;',
            '   }',
            '   gl_FragColor = pixel;',
            '}'
        ];
    }

    ColorRangeReplaceFilter.prototype = Object.create(Parent.prototype);
    ColorRangeReplaceFilter.prototype.constructor = ColorRangeReplaceFilter;

    
    Object.defineProperty(ColorRangeReplaceFilter.prototype, 'minColor', {
        get: function() {
            return PIXI.rgb2hex(this.uniforms.minColor.value);
        },
        set: function(value) {
            this.uniforms.minColor.value = PIXI.hex2rgb(value);
        }
    });
    
    Object.defineProperty(ColorRangeReplaceFilter.prototype, 'maxColor', {
        get: function() {
            return PIXI.rgb2hex(this.uniforms.maxColor.value);
        },
        set: function(value) {
            this.uniforms.maxColor.value = PIXI.hex2rgb(value);
        }
    });

    Object.defineProperty(ColorRangeReplaceFilter.prototype, 'newColor', {
        get: function() {
            return PIXI.rgb2hex(this.uniforms.newColor.value);
        },
        set: function(value) {
            this.uniforms.newColor.value = PIXI.hex2rgb(value);
        }
    });

    Object.defineProperty(ColorRangeReplaceFilter.prototype, 'brightnessOffset', {
        get: function() {
            return this.uniforms.brightnessOffset.value;
        },
        set: function(value) {
            this.uniforms.brightnessOffset.value = value;
        }
    });

    return ColorRangeReplaceFilter;
});
