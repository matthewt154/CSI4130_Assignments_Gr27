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
    renderer.setSize(window.innerWidth, window.innerHeight);
    // add the output of the renderer to the html element
    container.appendChild(renderer.domElement);


    // All drawing will be organized in a scene graph
    var scene = new THREE.Scene();
    // A camera with fovy = 90deg means the z distance is y/2
    szScreen = 120;

    // show axes at the origin
    var axes = new THREE.AxesHelper(10);
    scene.add(axes);

    // Add teapot to the scene
    var teapotGeometry = new THREE.TeapotGeometry(3, 15, true, true, true, false, false);
    var teapot = new THREE.Mesh(teapotGeometry, new THREE.MeshBasicMaterial({ color: 'teal' }));
    teapot.position.set(0, 0, 0);
    scene.add(teapot);

    // need a camera to look at things
    // calcaulate aspectRatio
    var aspectRatio = window.innerWidth / window.innerHeight;
    // Camera needs to be global
    camera = new THREE.PerspectiveCamera(90, aspectRatio, 1, 1000);
    //camera = new THREE.OrthographicCamera(szScreen * aspect / -2, szScreen * aspect / 2, szScreen / 2, szScreen / -2, -500, 500);
    // position the camera back and point to the center of the scene
    camera.position.z = szScreen / 2;
    camera.lookAt(scene.position);

    // render the scene
    renderer.render(scene, camera);

    view = "Front"
    // setup the control gui
    var controls = new function() {
        this.view = "Front";
        //Switches between the front and top views
        this.switchView = function() {
            if (this.view == "Front") {
                camera.position.z = 0
                camera.position.y = szScreen/2
                camera.lookAt(scene.position);
                this.view = "Top"
                console.log("Top")          
            }
            else {
                camera.position.z = szScreen/2
                camera.position.y = 0
                camera.lookAt(scene.position);
                this.view = "Front"
                console.log("Front")
            }
            view = this.view
        }

    };


    var gui = new dat.GUI();
    gui.add(controls, 'switchView')
    gui.add(controls, 'view').listen();
    render();

    function render() {
        // render using requestAnimationFrame - register function
        requestAnimationFrame(render);

        //add 3 degrees per frame 
        t = t + 10*Math.PI/(180*6)
        const past_x = teapot.position.x ;
        const past_y = teapot.position.y ;

        teapot.position.x = R *(((1-k)*Math.cos(t)) + l*k*Math.cos((1-k)/k *t));
        teapot.position.y = R *(((1-k)*Math.sin(t)) + l*k*Math.sin((1-k)/k *t));

        
        //drawing spirograph path 
        var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

        var points = [];
        points.push(new THREE.Vector3( past_x, past_y, 0 ) );
        points.push( new THREE.Vector3( teapot.position.x, teapot.position.y, 0 ) );

       

        var geometry = new THREE.BufferGeometry().setFromPoints( points );
        var line = new THREE.Line( geometry, material );
        scene.add (line); 
        renderer.render(scene, camera);
    }

}

//free curve parameter initial 
t = 0;
z = 25; //fixed value 
R = 25; //outer radius
k = 0.3; //ratio radius inner circle of outer circle 
l = 0.9; //point of pen on inner circle over radius of inner circle 

function onResize() {
    //Set resized aspect
    var aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;

    camera.updateProjectionMatrix();
    // If we use a canvas then we also have to worry of resizing it
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;

// register our resize event function
window.addEventListener('resize', onResize, true);