camX = 0;
camY = 0;

tileMap = []

function initThreeJs()
{
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 1000 );
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000, 1);
    renderer.sortObjects = false;
    document.getElementsByClassName("game")[0].appendChild( renderer.domElement );
    
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    
    camera.position.z = 120;
    
    time = 0;
    
    var render = function ()
    {
        time += 1;
        
        if ( keysReleasedNoHud(187) ) camera.position.z -= 1;
        if ( keysReleasedNoHud(189) ) camera.position.z += 1;
        if ( keysReleasedNoHud(48)  ) camera.position.z = 12;
        
        requestAnimationFrame( render );
        renderer.render(scene, camera);
        
        if (stateUpdate != undefined)
            stateUpdate();
        
        updateKeys();
    };
    
    render();
}

function boundCamera()
{
    var bottomLimit = 0 + (camera.position.z);
    if (camera.position.y < bottomLimit) camera.position.y = bottomLimit;
    
    var leftLimit = 0 + (camera.position.z * (innerWidth/innerHeight));
    if (camera.position.x < leftLimit)
    {
        camera.position.x = leftLimit;
        return true;
    }
    
    var rightLimit = tileMap.length - leftLimit;
    if (camera.position.x > rightLimit)
    {
        camera.position.x = rightLimit;
        return true;
    }
    
    return false;
}

textures = {}

function createRectangle( x , y , width , height , image )
{
    var geometry = new THREE.PlaneBufferGeometry( width, height, 1, 1);
    var material = null;
    if (image)
    {
        if (textures[image])
            material = new THREE.MeshBasicMaterial( {map: textures[image], side: THREE.DoubleSide} );
        else
        {
            var tex = THREE.ImageUtils.loadTexture(image);
            textures[image] = tex;
            material = new THREE.MeshBasicMaterial( {map: tex, side: THREE.DoubleSide} );
        }
    }
    else
        material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    material.depthWrite = false;
    material.transparent = true;
    material.opacity = 1;
    var plane = new THREE.Mesh( geometry, material );
    plane.position.x = x;
    plane.position.y = y;
    return plane;
}

function assignUVs(geometry) {

    geometry.faceVertexUvs[0] = [];

    geometry.faces.forEach(function(face) {

        var components = ['x', 'y', 'z'].sort(function(a, b) {
            return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
        });

        var v1 = geometry.vertices[face.a];
        var v2 = geometry.vertices[face.b];
        var v3 = geometry.vertices[face.c];

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);

    });

    geometry.uvsNeedUpdate = true;
}
