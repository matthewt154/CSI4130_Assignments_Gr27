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
    szScreen = 180;

    // show axes at the origin
    var axes = new THREE.AxesHelper(10);
    scene.add(axes);

    // Add teapot to the scene
    var teapotGeometry = new THREE.TeapotGeometry(3, 15, true, true, true, false, false);
    var teapot = new THREE.Mesh(teapotGeometry, new THREE.MeshBasicMaterial({ color: 'teal' }));
    teapot.position.set(50, 0, 0);
    scene.add(teapot);

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

    //Setup controls for k and l for the spirograph
    var spiroControls = new function() {
        this.l = 0.9
        this.k = 0.3
        this.redraw = function () {
        };
        this.reset = function() {
            this.l = 0.9
            this.k = 0.3
        }
    }


    var gui = new dat.GUI();
    gui.add(spiroControls, 'l', -5, 5).onChange(spiroControls.redraw).listen()
    gui.add(spiroControls,'k', -1,2).onChange(spiroControls.redraw).listen()
    gui.add(spiroControls, 'reset')
    render();

    function render() {
        // render using requestAnimationFrame - register function
        requestAnimationFrame(render);

        //add 3 degrees per frame 
        t = t + 10*Math.PI/(180*6)

        const past_x = teapot.position.x ;
        const past_y = teapot.position.y ;
        const past_z = teapot.position.z ;

        l = spiroControls.l
        k = spiroControls.k

        teapot.position.x = R *(((1-k)*Math.cos(t)) + l*k*Math.cos((1-k)/k *t));
        teapot.position.y = R *(((1-k)*Math.sin(t)) - l*k*Math.sin((1-k)/k *t));
        teapot.position.z = R *(((1-k)*Math.sin(t)) + l*k*Math.sin((1-k)/k *t));
        

        //drawing spirograph path 
        var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

        var points = [];
        points.push(new THREE.Vector3( past_x, past_y, past_z ) );
        points.push( new THREE.Vector3( teapot.position.x, teapot.position.y, teapot.position.z ) );      

        var geometry = new THREE.BufferGeometry().setFromPoints( points );
        var line = new THREE.Line( geometry, material );
        scene.add (line); 

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