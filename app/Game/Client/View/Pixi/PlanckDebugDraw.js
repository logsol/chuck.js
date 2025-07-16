define([
    "Game/Config/Settings"
],

function (Settings) {

    "use strict";

    function PlanckDebugDraw(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scale = Settings.RATIO;
        this.cameraPos = { x: 0, y: 0 };
        this.cameraZoom = 1;
        this.flags = {
            shapes: true,
            joints: false,
            aabb: false,
            pairs: false,
            centerOfMass: false
        };
    }

    PlanckDebugDraw.prototype.clear = function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    PlanckDebugDraw.prototype.setTransform = function(cameraPos, zoom) {
        this.cameraPos = cameraPos;
        this.cameraZoom = zoom || 1;
    };

    PlanckDebugDraw.prototype.drawWorld = function(world) {
        if (!this.flags.shapes) return;

        this.ctx.save();
        
        // Apply camera transformations like the game layers do
        var transformedX = this.cameraPos.x * this.cameraZoom + Settings.STAGE_WIDTH / 2;
        var transformedY = this.cameraPos.y * this.cameraZoom + Settings.STAGE_HEIGHT / 2;
        
        this.ctx.translate(transformedX, transformedY);
        this.ctx.scale(this.scale * this.cameraZoom, this.scale * this.cameraZoom);
        this.ctx.lineWidth = 0.5 / this.scale;

        // Iterate through all bodies
        for (var body = world.getBodyList(); body; body = body.getNext()) {
            var transform = body.getTransform();
            
            // Iterate through all fixtures
            for (var fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
                var shape = fixture.getShape();
                
                // Skip sensor fixtures to match old Box2D behavior
                if (fixture.isSensor()) {
                    continue;
                }
                
                if (body.isDynamic()) {
                    this.ctx.strokeStyle = '#ff0000'; // Red for dynamic bodies
                    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
                } else if (body.isStatic()) {
                    this.ctx.strokeStyle = '#00ff00'; // Green for static bodies
                    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
                } else {
                    this.ctx.strokeStyle = '#0000ff'; // Blue for kinematic bodies
                    this.ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
                }

                this.drawShape(shape, transform);
            }
        }

        this.ctx.restore();
    };

    PlanckDebugDraw.prototype.drawShape = function(shape, transform) {
        var type = shape.getType();
        
        if (type === 'circle') {
            this.drawCircle(shape, transform);
        } else if (type === 'polygon') {
            this.drawPolygon(shape, transform);
        } else if (type === 'edge') {
            this.drawEdge(shape, transform);
        } else if (type === 'chain') {
            this.drawChain(shape, transform);
        }
    };

    PlanckDebugDraw.prototype.drawCircle = function(shape, transform) {
        var center = transform.p;
        var radius = shape.getRadius();
        
        this.ctx.beginPath();
        this.ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw radius line to show rotation
        this.ctx.beginPath();
        this.ctx.moveTo(center.x, center.y);
        this.ctx.lineTo(center.x + radius, center.y);
        this.ctx.stroke();
    };

    PlanckDebugDraw.prototype.drawPolygon = function(shape, transform) {
        var vertices = shape.m_vertices;
        if (!vertices || vertices.length < 3) return;

        this.ctx.beginPath();
        
        // Transform first vertex
        var v = this.transformVertex(vertices[0], transform);
        this.ctx.moveTo(v.x, v.y);
        
        // Transform and draw remaining vertices
        for (var i = 1; i < vertices.length; i++) {
            v = this.transformVertex(vertices[i], transform);
            this.ctx.lineTo(v.x, v.y);
        }
        
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    };

    PlanckDebugDraw.prototype.drawEdge = function(shape, transform) {
        var v1 = this.transformVertex(shape.m_vertex1, transform);
        var v2 = this.transformVertex(shape.m_vertex2, transform);
        
        this.ctx.beginPath();
        this.ctx.moveTo(v1.x, v1.y);
        this.ctx.lineTo(v2.x, v2.y);
        this.ctx.stroke();
    };

    PlanckDebugDraw.prototype.drawChain = function(shape, transform) {
        var vertices = shape.m_vertices;
        if (!vertices || vertices.length < 2) return;

        this.ctx.beginPath();
        
        var v = this.transformVertex(vertices[0], transform);
        this.ctx.moveTo(v.x, v.y);
        
        for (var i = 1; i < vertices.length; i++) {
            v = this.transformVertex(vertices[i], transform);
            this.ctx.lineTo(v.x, v.y);
        }
        
        this.ctx.stroke();
    };

    PlanckDebugDraw.prototype.transformVertex = function(vertex, transform) {
        // Apply transform: rotated_vertex = transform.q * vertex + transform.p
        var cos = Math.cos(transform.q.getAngle());
        var sin = Math.sin(transform.q.getAngle());
        
        return {
            x: transform.p.x + (cos * vertex.x - sin * vertex.y),
            y: transform.p.y + (sin * vertex.x + cos * vertex.y)
        };
    };

    PlanckDebugDraw.prototype.setFlags = function(flags) {
        this.flags = flags;
    };

    return PlanckDebugDraw;

}); 