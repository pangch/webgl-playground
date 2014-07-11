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
        var list = glm.vec3.dot(polygon.plane.normal, plane.normal) > 0 ? coplanar : coplanarReverse;
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
    // Recursively remove all parts of input polygons that are inside the current BSP tree.
    clipPolygons: function(polygons, inside) {
      if (this.plane === null) {
        return polygons;
      }
      
      var frontPolygons = [], backPolygons = [];
      for (var i = 0; i < polygons.length; i++) {
        splitPolygon(polygons[i], this.plane, frontPolygons, backPolygons, frontPolygons, backPolygons);
      }
      
      if (this.front) {
        frontPolygons = this.front.clipPolygons(frontPolygons, inside);
      } else if (inside) {
        frontPolygons = [];
      }
      
      if (this.back) {
        backPolygons = this.back.clipPolygons(backPolygons, inside);
      } else if (!inside) {
        // The backPolygons here falls into the back side of 
        // every surface of the BSP tree, therefore it is
        // inside the solid represented by the BSP tree.
        backPolygons = [];
      }
      
      return frontPolygons.concat(backPolygons);
    },
    
    // Recursively remove all parts of polygons of this BSP tree that are inside or outside another BSP tree.
    clipBy: function(bsp, inside) {
      var clippedTree = new BSPTree();
      
      // Clip this polygons of the current node
      clippedTree.polygons = bsp.clipPolygons(this.polygons, inside);
      clippedTree.plane = this.plane;
      
      // Recursively clip polygons of child nodes
      clippedTree.front = this.front ? this.front.clipBy(bsp, inside) : null;
      if (clippedTree.front && clippedTree.front.allPolygons().length === 0) {
        clippedTree.front = null;
      }
      
      clippedTree.back = this.back ? this.back.clipBy(bsp, inside) : null;
      if (clippedTree.back && clippedTree.back.allPolygons().length === 0) {
        clippedTree.back = null;
      }
      return clippedTree;
    },
    
    clipInside: function(bsp) {
      return this.clipBy(bsp, false);
    },
    
    clipOutside: function(bsp) {
      return this.clipBy(bsp, true);
    },
    
    // Invert the inside / outside of this BSP
    invert: function() {
      var invertedTree = new BSPTree();      
      invertedTree.polygons = this.polygons.map(function(p) { return p.flip() });
      invertedTree.plane = this.plane.flip();
      invertedTree.front = this.back ? this.back.invert() : null;
      invertedTree.back = this.front ? this.front.invert() : null;
      return invertedTree;
    },
        
    // Iterate the tree
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
    
    allPolygons: function() {
      if (!this._allPolygons) {
        var allPolygons = [];
        this.eachNode(function(node) {
          Array.prototype.push.apply(allPolygons, node.polygons);
        });
        this._allPolygons = allPolygons;
      }
      return this._allPolygons;
    }    
  }
  
  return BSPTree;
});