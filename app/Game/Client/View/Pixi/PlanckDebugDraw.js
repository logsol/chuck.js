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
            centerOfMass: true
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
        this.ctx.lineWidth = 0.3 / this.scale; // Made thinner (was 0.5)

        // Iterate through all bodies
        for (var body = world.getBodyList(); body; body = body.getNext()) {
            var transform = body.getTransform();
            
            // Iterate through all fixtures
            for (var fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
                var shape = fixture.getShape();
                
                // Check if this is a sensor
                var isSensor = fixture.isSensor();
                
                // Skip sensor fixtures if DEBUG_DRAW_SENSORS is false
                if (isSensor && !Settings.DEBUG_DRAW_SENSORS) {
                    continue;
                }
                
                // Skip non-sensor fixtures if they were sensors in the old logic
                if (!isSensor && !Settings.DEBUG_DRAW_SENSORS) {
                    // This was the old logic - skip sensors, but we're keeping non-sensors
                }
                
                // Set colors based on sensor status and body type
                if (isSensor) {
                    // Sensors: orange with more visibility, no stroke
                    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0)'; // No stroke
                    this.ctx.fillStyle = 'rgba(255, 165, 0, 0.3)'; // Orange with higher alpha
                } else {
                    // Regular fixtures: colored by body type
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
                }

                this.drawShape(shape, transform, isSensor);
            }
        }

        // Draw center of mass for each body
        if (this.flags.centerOfMass) {
            for (var body = world.getBodyList(); body; body = body.getNext()) {
                var transform = body.getTransform();
                this.drawCenterOfMass(transform);
                // Removed drawBodyOrigin call since origin and center of mass are the same in Planck.js
            }
        }

        this.ctx.restore();
    };

    PlanckDebugDraw.prototype.drawShape = function(shape, transform, isSensor) {
        var type = shape.getType();
        
        if (type === 'circle') {
            this.drawCircle(shape, transform, isSensor);
        } else if (type === 'polygon') {
            this.drawPolygon(shape, transform, isSensor);
        } else if (type === 'edge') {
            this.drawEdge(shape, transform, isSensor);
        } else if (type === 'chain') {
            this.drawChain(shape, transform, isSensor);
        }
    };

    PlanckDebugDraw.prototype.drawCircle = function(shape, transform, isSensor) {
        var radius = shape.getRadius();
        
        // Get the circle's local position (center relative to body)
        var localCenter = shape.m_p || planck.Vec2(0, 0);
        
        // Transform the local position to world coordinates
        var worldCenter = this.transformVertex(localCenter, transform);
        
        this.ctx.beginPath();
        this.ctx.arc(worldCenter.x, worldCenter.y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Only draw stroke for non-sensors
        if (!isSensor) {
            this.ctx.stroke();
            
            // Draw radius line to show rotation (only for non-sensors)
            this.ctx.beginPath();
            this.ctx.moveTo(worldCenter.x, worldCenter.y);
            this.ctx.lineTo(worldCenter.x + radius, worldCenter.y);
            this.ctx.stroke();
        }
    };

    PlanckDebugDraw.prototype.drawPolygon = function(shape, transform, isSensor) {
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
        
        // Only draw stroke for non-sensors
        if (!isSensor) {
            this.ctx.stroke();
        }
    };

    PlanckDebugDraw.prototype.drawEdge = function(shape, transform, isSensor) {
        var v1 = this.transformVertex(shape.m_vertex1, transform);
        var v2 = this.transformVertex(shape.m_vertex2, transform);
        
        this.ctx.beginPath();
        this.ctx.moveTo(v1.x, v1.y);
        this.ctx.lineTo(v2.x, v2.y);
        
        // Only draw stroke for non-sensors
        if (!isSensor) {
            this.ctx.stroke();
        }
    };

    PlanckDebugDraw.prototype.drawChain = function(shape, transform, isSensor) {
        var vertices = shape.m_vertices;
        if (!vertices || vertices.length < 2) return;

        this.ctx.beginPath();
        
        var v = this.transformVertex(vertices[0], transform);
        this.ctx.moveTo(v.x, v.y);
        
        for (var i = 1; i < vertices.length; i++) {
            v = this.transformVertex(vertices[i], transform);
            this.ctx.lineTo(v.x, v.y);
        }
        
        // Only draw stroke for non-sensors
        if (!isSensor) {
            this.ctx.stroke();
        }
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

    PlanckDebugDraw.prototype.drawCenterOfMass = function(transform) {
        var centerX = transform.p.x;
        var centerY = transform.p.y;
        var size = 0.05; // Made much smaller (was 0.2)
        
        this.ctx.strokeStyle = '#ffff00'; // Yellow color for center of mass
        this.ctx.lineWidth = 1 / this.scale; // Made thinner (was 2)
        
        // Draw a cross at the center of mass
        this.ctx.beginPath();
        // Horizontal line
        this.ctx.moveTo(centerX - size, centerY);
        this.ctx.lineTo(centerX + size, centerY);
        // Vertical line
        this.ctx.moveTo(centerX, centerY - size);
        this.ctx.lineTo(centerX, centerY + size);
        this.ctx.stroke();
    };

    PlanckDebugDraw.prototype.setFlags = function(flags) {
        this.flags = flags;
    };

    return PlanckDebugDraw;

}); 