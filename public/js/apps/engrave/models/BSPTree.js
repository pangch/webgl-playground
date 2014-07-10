define(['./Plane', './Polygon', '../math', 'gl-matrix'], function(Plane, Polygon, math, glm) {
  var BSPTree = function() {
    // List of polygons attached to this tree node.
    this.polygons = [];
    this.plane = null;
    this.front = null;
    this.back = null;
  };
  
  // Splits a polygon by a plane, and push the splitted polygons into
  // lists corresponding to the location of the plane
  //
  // Coplanar polygons could be pushed into coplanar or coplanarOpposite, depending
  // on the direction of the polygon.
  var splitPolygon = function(polygon, plane, front, back, coplanar, coplanarReverse) {
    // First classifies the polygon by checking the position of each verticies to the plane
    var COPLANAR = 0;
    var FRONT = 1;    // 0x01
    var BACK = 2;     // 0x10
    var SPANNING = 3; // 0x11
    
    var polygonType = 0;
    var vertices = polygon.vertices;
    var dists = [];
    var vertexTypes = []

    for (var i = 0; i < vertices.length; i++) {
      var dist = plane.distToPoint(vertices[i]); // Position could be 1, 0, -1
      var position = math.floatSign(dist);
      if (position === -1) {
        position = 2;
      }
      polygonType |= position;
      dists.push(dist);
      vertexTypes.push(position);
    }
    
    if (polygonType === SPANNING) {
      // Split the spanning polygon into two and push them into corresponding lists: 
      //
      // Go through all the vertices, find the two vertices on opposite sides of the plane and
      // create new vertices at the intersection of the plane.
      var fVer = [], bVer = [];
      
      for (var i = 0; i < vertices.length; i++) {
        var vertex = vertices[i];
        var vertexType = vertexTypes[i];
        if (vertexType === COPLANAR) {
          fVer.push(vertex);
          bVer.push(vertex);
          continue;
        } else if (vertexType === FRONT) {
          fVer.push(vertex);
        } else {
          bVer.push(vertex);
        }
        
        var nextVertexIndex = (i < vertices.length - 1 ? i + 1 : 0);
        var nextVertexType = vertexTypes[nextVertexIndex];
        if (nextVertexType === vertexType || nextVertexType === COPLANAR) {
          continue;
        }
        
        // The next vertex is on the opposite side of the plane
        // The line (vertex, nextVertex) and be represented as P(t) = S + tV
        //   S = vertex and V = (nextVertex - vertex)
        // The intersecting point is N dot P(t) + d = 0
        // Therefore t = - (N dot S + d) / (N dot V)
        //   N dot S + d = dists[i]
        var nextVertex = vertices[nextVertexIndex];
        var vecS = vertex;
        var vecV = glm.vec3.sub(glm.vec3.create(), nextVertex, vertex);
        var t = - dists[i] / glm.vec3.dot(plane.normal, vecV);
        
        // Now intersection is P = S + tV. Push the intersection to both lists
        var vecP = glm.vec3.scaleAndAdd(glm.vec3.create(), vecS, vecV, t);
        fVer.push(vecP);
        bVer.push(vecP);
      }
      
      front.push(Polygon.fromVertices(fVer));
      back.push(Polygon.fromVertices(bVer));
    } else {
      // Push the polygon directly
      switch(polygonType) {
      case COPLANAR:
        var list = glm.vec3.dot(polygon.normal, plane.normal) > 0 ? coplanar : coplanarReverse;
        list.push(polygon);
        break;
      case FRONT:
        front.push(polygon);
        break;
      case BACK:
        back.push(polygon);
        break;
      }
    }
  }
  
  // Build BSP tree from a list of polygons
  BSPTree.fromPolygons = function(polygons) {
    if (polygons.length === 0) {
      return null;
    }
    
    var tree = new BSPTree();
    
    // Pick the first polygon
    var polygon = polygons[0];
    tree.polygons = [polygon];
    tree.plane = polygon.plane;
    
    // Split other polygons and push to lists
    var frontPolygons = [], backPolygons = [];
    var otherPolygons = polygons.slice(1);
    for (var i = 0; i < otherPolygons.length; i++) {
      splitPolygon(otherPolygons[i], tree.plane, frontPolygons, backPolygons, tree.polygons, tree.polygons);
    }
    
    // Build child trees for front and back lists
    tree.front = frontPolygons.length ? BSPTree.fromPolygons(frontPolygons) : null;
    tree.back = backPolygons.length ? BSPTree.fromPolygons(backPolygons) : null;
    
    return tree;
  };
  
  BSPTree.prototype = {
    eachNode: function(callback) {
      // In-order traversal of this tree
      if (this.front) {
        this.front.eachNode(callback);
      }
      callback(this);
      if (this.back) {
        this.back.eachNode(callback);
      }
    },
    
    buildAllPolygons: function() {
      // Store all polygons in this tree.
      var allPolygons = [];
      this.eachNode(function(node) {
        Array.prototype.push.apply(allPolygons, node.polygons);
      });
      this.allPolygons = allPolygons;
    },
    
    buildAllPolygonsIfNeeded: function() {
      if (this.allPolygons) {
        return;
      } else {
        this.buildAllPolygons();
      }      
    }
  }
  
  return BSPTree;
});