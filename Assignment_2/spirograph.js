//---------Group 27---------
//Marthy Hardika 300074614
//Alexandre Latimer 300027473
//Matthew Tran 300028206


function init() {

    // add our rendering surface and initialize the renderer
    var container = document.createElement('div');
    document.body.appendChild(container);
    renderer = new THREE.WebGLRenderer();
    // set some state - here just clear color
    renderer.setClearColor(new THREE.Color(0x333333));
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    // add the output of the renderer to the html element
    container.appendChild(renderer.domElement);
    
    //Render autoclear is off to be able to display both viewports
    renderer.autoClear = false


    // All drawing will be organized in a scene graph
    var scene = new THREE.Scene();
    // A camera with fovy = 90deg means the z distance is y/2
    szScreen = 220;

    // show axes at the origin
    var axes = new THREE.AxesHelper(10);
    scene.add(axes);

    var aspectRatio = window.innerWidth / window.innerHeight;
    SCREEN_HEIGHT = window.innerHeight
    SCREEN_WIDTH = window.innerWidth

    //Camera for Front View
    cameraFront = new THREE.PerspectiveCamera( 90, aspectRatio, 1, 1000 );
	cameraFront.position.z = szScreen/2;
    cameraFront.lookAt(scene.position);
    //cameraHelper = new THREE.CameraHelper( cameraFront );
    //scene.add( cameraHelper );

    //Camera for Top View
	cameraTop = new THREE.PerspectiveCamera( 90, aspectRatio, 1, 1000 );
    cameraTop.position.y = szScreen/2;
    cameraTop.lookAt(scene.position);
    //cameraTopHelper = new THREE.CameraHelper( cameraTop );
	//scene.add( cameraTopHelper );


    // Create the Spirograph Group
    var spiroGroup = new THREE.Group();
    scene.add(spiroGroup)

    // Add teapot to the sprioGroup
    var teapotGeometry = new THREE.TeapotGeometry(3, 15, true, true, true, false, false);
    var teapot = new THREE.Mesh(teapotGeometry, new THREE.MeshBasicMaterial({ color: 'teal' }));
    teapot.position.set(50, 0, 0);
    spiroGroup.add(teapot);

    // Create the Spirograph curve
    class spirographCurve extends THREE.Curve {
        constructor(l, k) {
            super();
            this.k = k
            this.l = l
        }

        //calculate points from 0 to 6*PI of spirograph
        getPoint( t ) {
            // range 0 to 6*PI
            t = t*6*Math.PI

            var tx = R *(((1-this.k)*Math.cos(t)) + this.l*this.k*Math.cos((1-this.k)/this.k *t));
            var ty = R *(((1-this.k)*Math.sin(t)) - this.l*this.k*Math.sin((1-this.k)/this.k *t));
            var tz = 0
            return new THREE.Vector3( tx, ty, tz );
        };
    }

    //Setup controls for k and l for the spirograph
    var spiroControls = new function() {
        this.l = 0.9
        this.k = 0.3
        this.segments = 100;
		this.radius = 2;
		this.radialSegments = 8;
        this.update = function() {
			updateSpirograph(spiroControls.l, spiroControls.k, Math.round(spiroControls.segments), spiroControls.radius, Math.round(spiroControls.radialSegments));
		};
        this.redraw = function () {
        };
        this.reset = function() {
            this.l = 0.9
            this.k = 0.3
            updateSpirograph(spiroControls.l, spiroControls.k, Math.round(spiroControls.segments), spiroControls.radius, Math.round(spiroControls.radialSegments));
        }
    }

    var spiroPath;

    //updates spirograph with new l and k values
    function updateSpirograph(l, k, segments, radius, radialSegments) {
        spiroGroup.remove(spiroGraphMesh);
        spiroPath = new spirographCurve(l,k);
        var geometry = new THREE.TubeGeometry(spiroPath, segments, radius, radialSegments, false);

        var vertColMat = new THREE.MeshBasicMaterial({vertexColors: 0x0000ff});
        spiroGraphMesh = new THREE.Mesh(geometry, vertColMat);
        spiroGroup.add(spiroGraphMesh);
    }

    //Create a dummy node
    spiroGraphMesh = new THREE.Group();
    updateSpirograph(spiroControls.l, spiroControls.k, spiroControls.segments, spiroControls.radius, spiroControls.radialSegments);


    var gui = new dat.GUI();
    gui.add(spiroControls, 'l', -5, 5).onChange(spiroControls.update).listen()
    gui.add(spiroControls,'k', -1,2).onChange(spiroControls.update).listen()
    gui.add(spiroControls, 'reset')
    render();

    function render() {
        // render using requestAnimationFrame - register function
        requestAnimationFrame(render);

        // spin spirograph in "sphere"
		spiroGroup.rotation.y = (spiroGroup.rotation.y + 0.005) % (2.0 * Math.PI);
        spiroGroup.rotation.z = (spiroGroup.rotation.z + 0.005) % (2.0 * Math.PI);

        //Set teapot position to next point of the spirograph
        t += 0.001;
        var pos =  spiroPath.getPoint(t);
        teapot.position.set(pos.x, pos.y, pos.z);

        //Clear renderer manually
        renderer.clear();

        //Render Front Camera Viewport 
        renderer.setViewport( 0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
        renderer.render( scene, cameraFront );

        //Render Top Camera Viewport 
        renderer.setViewport( SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
        renderer.render( scene, cameraTop );

    }

}

//free curve parameter initial 
t = 0;
z = 25; //fixed value 
R = 50; //outer radius
k = 0.3; //ratio radius inner circle of outer circle 
l = 0.9; //point of pen on inner circle over radius of inner circle 

function onResize() {
    //Set resized aspect
    var aspect = window.innerWidth / window.innerHeight;
    cameraFront.aspect = aspect;

    cameraFront.updateProjectionMatrix();
    // If we use a canvas then we also have to worry of resizing it
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;

// register our resize event function
window.addEventListener('resize', onResize, true);