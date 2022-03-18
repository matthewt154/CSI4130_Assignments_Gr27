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
        //speed = 2 ** controls.speed
            // earth group rotates arond sun
        //earthRotGroup.rotation.z = (earthRotGroup.rotation.z + 3 * speed) % (2.0 * Math.PI);
        // Teapot has to compensate to stay on top of earth
        //earthGroup.rotation.z = (earthGroup.rotation.z - 3 * speed) % (2.0 * Math.PI);
        // console.log(earthRotGroup.rotation.z , earthGroup.rotation.z)
        // saturn group rotates arond sun
        //saturnRotGroup.rotation.z = (saturnRotGroup.rotation.z + speed) % (2.0 * Math.PI);
        // saturn ring and moon rotate around saturn
        //saturnGroup.rotation.x = (saturnGroup.rotation.x + 5 * speed) % (2.0 * Math.PI);
        //saturnGroup.rotation.y = (saturnGroup.rotation.y + 5 * speed) % (2.0 * Math.PI);
        // Todo: Make sure to look at Earth (moves!) or Sun (does not move)

        renderer.render(scene, camera);
    }

}


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