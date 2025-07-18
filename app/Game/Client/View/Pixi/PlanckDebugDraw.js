define([
    "Game/Config/Settings",
    "Lib/Vendor/Pixi"
],

function (Settings, PIXI) {

    "use strict";

    function PlanckDebugDraw(graphics) {
        this.graphics = graphics;
        this.scale = Settings.RATIO;
        this.flags = {
            shapes: true,
            joints: false,
            aabb: false,
            pairs: false,
            centerOfMass: true
        };
    }

    PlanckDebugDraw.prototype.clear = function() {
        this.graphics.clear();
    };

    PlanckDebugDraw.prototype.setTransform = function(cameraPos, zoom) {
        // Not needed for PIXI - transformations are handled by the layer system
    };

    PlanckDebugDraw.prototype.drawWorld = function(world) {
        if (!this.flags.shapes) return;

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
                
                // Set colors based on sensor status and body type
                var fillColor, lineColor, lineWidth;
                if (isSensor) {
                    // Sensors: orange with more visibility, no stroke
                    fillColor = 0xFFA500; // Orange
                    lineColor = 0x000000; // Black (transparent)
                    lineWidth = 0;
                } else {
                    // Regular fixtures: colored by body type
                    if (body.isDynamic()) {
                        fillColor = 0xFF0000; // Red for dynamic bodies
                        lineColor = 0xFF0000; // Red stroke
                    } else if (body.isStatic()) {
                        fillColor = 0x00FF00; // Green for static bodies
                        lineColor = 0x00FF00; // Green stroke
                    } else {
                        fillColor = 0x0000FF; // Blue for kinematic bodies
                        lineColor = 0x0000FF; // Blue stroke
                    }
                    lineWidth = 1;
                }

                this.drawShape(shape, transform, isSensor, fillColor, lineColor, lineWidth);
            }
        }

        // Draw center of mass for each body
        if (this.flags.centerOfMass) {
            for (var body = world.getBodyList(); body; body = body.getNext()) {
                var transform = body.getTransform();
                this.drawCenterOfMass(transform);
            }
        }
    };

    PlanckDebugDraw.prototype.drawShape = function(shape, transform, isSensor, fillColor, lineColor, lineWidth) {
        var type = shape.getType();
        
        if (type === 'circle') {
            this.drawCircle(shape, transform, isSensor, fillColor, lineColor, lineWidth);
        } else if (type === 'polygon') {
            this.drawPolygon(shape, transform, isSensor, fillColor, lineColor, lineWidth);
        } else if (type === 'edge') {
            this.drawEdge(shape, transform, isSensor, fillColor, lineColor, lineWidth);
        } else if (type === 'chain') {
            this.drawChain(shape, transform, isSensor, fillColor, lineColor, lineWidth);
        }
    };

    PlanckDebugDraw.prototype.drawCircle = function(shape, transform, isSensor, fillColor, lineColor, lineWidth) {
        var radius = shape.getRadius();
        
        // Get the circle's local position (center relative to body)
        var localCenter = shape.m_p || planck.Vec2(0, 0);
        
        // Transform the local position to world coordinates
        var worldCenter = this.transformVertex(localCenter, transform);
        
        // Draw filled circle
        this.graphics.beginFill(fillColor, 0.3);
        this.graphics.drawCircle(worldCenter.x * this.scale, worldCenter.y * this.scale, radius * this.scale);
        this.graphics.endFill();
        
        // Only draw stroke for non-sensors
        if (!isSensor && lineWidth > 0) {
            this.graphics.lineStyle(lineWidth, lineColor);
            this.graphics.drawCircle(worldCenter.x * this.scale, worldCenter.y * this.scale, radius * this.scale);
            
            // Draw radius line to show rotation
            this.graphics.moveTo(worldCenter.x * this.scale, worldCenter.y * this.scale);
            this.graphics.lineTo((worldCenter.x + radius) * this.scale, worldCenter.y * this.scale);
        }
    };

    PlanckDebugDraw.prototype.drawPolygon = function(shape, transform, isSensor, fillColor, lineColor, lineWidth) {
        var vertices = shape.m_vertices;
        if (!vertices || vertices.length < 3) return;

        // Transform all vertices
        var transformedVertices = [];
        for (var i = 0; i < vertices.length; i++) {
            var v = this.transformVertex(vertices[i], transform);
            transformedVertices.push(v.x * this.scale, v.y * this.scale);
        }
        
        // Draw filled polygon
        this.graphics.beginFill(fillColor, 0.3);
        this.graphics.drawPolygon(transformedVertices);
        this.graphics.endFill();
        
        // Only draw stroke for non-sensors
        if (!isSensor && lineWidth > 0) {
            this.graphics.lineStyle(lineWidth, lineColor);
            this.graphics.drawPolygon(transformedVertices);
        }
    };

    PlanckDebugDraw.prototype.drawEdge = function(shape, transform, isSensor, fillColor, lineColor, lineWidth) {
        var v1 = this.transformVertex(shape.m_vertex1, transform);
        var v2 = this.transformVertex(shape.m_vertex2, transform);
        
        // Only draw stroke for non-sensors
        if (!isSensor && lineWidth > 0) {
            this.graphics.lineStyle(lineWidth, lineColor);
            this.graphics.moveTo(v1.x * this.scale, v1.y * this.scale);
            this.graphics.lineTo(v2.x * this.scale, v2.y * this.scale);
        }
    };

    PlanckDebugDraw.prototype.drawChain = function(shape, transform, isSensor, fillColor, lineColor, lineWidth) {
        var vertices = shape.m_vertices;
        if (!vertices || vertices.length < 2) return;

        // Only draw stroke for non-sensors
        if (!isSensor && lineWidth > 0) {
            this.graphics.lineStyle(lineWidth, lineColor);
            
            var v = this.transformVertex(vertices[0], transform);
            this.graphics.moveTo(v.x * this.scale, v.y * this.scale);
            
            for (var i = 1; i < vertices.length; i++) {
                v = this.transformVertex(vertices[i], transform);
                this.graphics.lineTo(v.x * this.scale, v.y * this.scale);
            }
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
        
        // Draw a cross at the center of mass
        this.graphics.lineStyle(1, 0xFFFF00); // Yellow color for center of mass
        
        // Horizontal line
        this.graphics.moveTo((centerX - size) * this.scale, centerY * this.scale);
        this.graphics.lineTo((centerX + size) * this.scale, centerY * this.scale);
        
        // Vertical line
        this.graphics.moveTo(centerX * this.scale, (centerY - size) * this.scale);
        this.graphics.lineTo(centerX * this.scale, (centerY + size) * this.scale);
    };

    PlanckDebugDraw.prototype.setFlags = function(flags) {
        this.flags = flags;
    };

    return PlanckDebugDraw;

}); 