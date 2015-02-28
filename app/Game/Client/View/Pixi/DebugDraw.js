define([
    "Lib/Vendor/Box2D",
    "Game/Client/View/Pixi/Layers/Debug"
],
 
function (Box2D, Debug) {

    "use strict";

    var Parent = Box2D.Dynamics.b2DebugDraw;
 
    function DebugDraw() {
        Parent.call(this);


        this.m_drawScale = 1;

          this.m_sprite = {
             graphics: {
                clear: function () {
                    Debug.graphics.clear();
                    Debug.graphics.lineStyle ( 1, 0x00ff00 , .8 )

                   //__this.m_ctx.clearRect(0, 0, __this.m_ctx.canvas.width, __this.m_ctx.canvas.height)
                }
             }
          };

    }

    DebugDraw.prototype = Object.create(Parent.prototype);

    DebugDraw.prototype.SetSprite = function (sprite) {
        this.m_ctx = Debug.graphics;

        this.m_ctx.beginPath = function(){
            Debug.graphics.beginFill(0x00ff00, 0.2);
        };
        this.m_ctx.closePath = function(){
            Debug.graphics.endFill();
        };
        this.m_ctx.fill = function(){
            this.endFill();
        };
        this.m_ctx.stroke = function(){
            //console.log('customStroke');
        };

    };

    DebugDraw.prototype.DrawPolygon = function (vertices, vertexCount, color) {
        if (!vertexCount) return;
        var s = this.m_ctx;
        var drawScale = this.m_drawScale;
        s.beginPath();
        s.strokeStyle = this._color(color.color, this.m_alpha);
        s.moveTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
        for (var i = 1; i < vertexCount; i++) {
           s.lineTo(vertices[i].x * drawScale, vertices[i].y * drawScale);
        }
        s.lineTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
        s.closePath();
        s.stroke();
    };

    DebugDraw.prototype.DrawSolidPolygon = function (vertices, vertexCount, color) {
        if (!vertexCount) return;
        var s = this.m_ctx;
        var drawScale = this.m_drawScale;
        s.beginPath();
        s.strokeStyle = this._color(color.color, this.m_alpha);
        s.fillStyle = this._color(color.color, this.m_fillAlpha);
        s.moveTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
        for (var i = 1; i < vertexCount; i++) {
           s.lineTo(vertices[i].x * drawScale, vertices[i].y * drawScale);
        }
        s.lineTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
        s.closePath();
        s.fill();
        s.stroke();
    };

    DebugDraw.prototype.DrawCircle = function (center, radius, color) {
        if (!radius) return;
        var s = this.m_ctx;
        var drawScale = this.m_drawScale;
        s.beginPath();
        s.strokeStyle = this._color(color.color, this.m_alpha);
        s.arc(center.x * drawScale, center.y * drawScale, radius * drawScale, 0, Math.PI * 2, true);
        s.closePath();
        s.stroke();
    };

    DebugDraw.prototype.DrawSolidCircle = function (center, radius, axis, color) {
        if (!radius) return;
        var s = this.m_ctx,
           drawScale = this.m_drawScale,
           cx = center.x * drawScale,
           cy = center.y * drawScale;
        s.moveTo(0, 0);
        s.beginPath();
        s.strokeStyle = this._color(color.color, this.m_alpha);
        s.fillStyle = this._color(color.color, this.m_fillAlpha);
        s.arc(cx, cy, radius * drawScale, 0, Math.PI * 2, true);
        s.moveTo(cx, cy);
        s.lineTo((center.x + axis.x * radius) * drawScale, (center.y + axis.y * radius) * drawScale);
        s.closePath();
        s.fill();
        s.stroke();
    };

    DebugDraw.prototype.DrawSegment = function (p1, p2, color) {
        var s = this.m_ctx,
           drawScale = this.m_drawScale;
        s.strokeStyle = this._color(color.color, this.m_alpha);
        s.beginPath();
        s.moveTo(p1.x * drawScale, p1.y * drawScale);
        s.lineTo(p2.x * drawScale, p2.y * drawScale);
        s.closePath();
        s.stroke();
    };

    DebugDraw.prototype.DrawTransform = function (xf) {
        var s = this.m_ctx,
           drawScale = this.m_drawScale;
        s.beginPath();
        s.strokeStyle = this._color(0xff0000, this.m_alpha);
        s.moveTo(xf.position.x * drawScale, xf.position.y * drawScale);
        s.lineTo((xf.position.x + this.m_xformScale * xf.R.col1.x) * drawScale, (xf.position.y + this.m_xformScale * xf.R.col1.y) * drawScale);

        s.strokeStyle = this._color(0xff00, this.m_alpha);
        s.moveTo(xf.position.x * drawScale, xf.position.y * drawScale);
        s.lineTo((xf.position.x + this.m_xformScale * xf.R.col2.x) * drawScale, (xf.position.y + this.m_xformScale * xf.R.col2.y) * drawScale);
        s.closePath();
        s.stroke();
    };

    return DebugDraw;
 
});