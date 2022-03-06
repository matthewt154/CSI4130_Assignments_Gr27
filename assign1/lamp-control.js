//Initialzie the lamp
function init() {
     // add our rendering surface and initialize the renderer
    var container = document.createElement('div');
    document.body.appendChild(container);
    renderer = new THREE.WebGLRenderer();
    // set some state - here just clear color
    renderer.setClearColor(new THREE.Color(0x333333));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    //stick figure built in a scenegraph
    var scene = new THREE.Scene();

    // Lamp is a group
    var lamp= new THREE.Group();
    scene.add(lamp);

    // number of primitives are one for the support, lower arm, upper
    //arm, two for the lamp shade and one for the bulb plus 3 spheres 
    //for the three respective joints, all children of lamp scene
    const base_height = -20;

    //rotation angles in radians TO_MODIFY
    var lower_rotation =-0.5;
    var upper_rotation=0.8;

    //base support 
    var faceMaterial_support = new THREE.MeshBasicMaterial({ color: '#49BEA2' });
    var cylinderGeometry_support = new THREE.CylinderGeometry(10,10, 3, 12);
    var support = new THREE.Mesh(cylinderGeometry_support, faceMaterial_support);
    support.position.set (0, base_height, 0);
    lamp.add(support);

    //lower lamp group
    var lower_lamp = new THREE.Group();
    lower_lamp.position.set(0, base_height+3);
    lamp.add(lower_lamp);

    //add lower sphere joint and arm
    var mesh_joint_one = new THREE.MeshBasicMaterial({ color: '#49BEA2' });
    var joint_one_geometry = new THREE.SphereGeometry(2.5, 15, 15);
    var joint_one = new THREE.Mesh(joint_one_geometry, mesh_joint_one);
    lower_lamp.add(joint_one);

    var faceMaterial_lower_arm = new THREE.MeshBasicMaterial({ color: '#49BEA2' });
    var cylinderGeometry_lower_arm = new THREE.CylinderGeometry(2,2, 25, 12);
    var lower_arm = new THREE.Mesh(cylinderGeometry_lower_arm, faceMaterial_lower_arm);
    lower_arm.position.set(0, base_height+33, 0);
    lower_lamp.add(lower_arm);

    lower_lamp.rotateX(lower_rotation);
    
    //middle joint and upper arm 
    var upper_lamp_base_x=Math.cos(lower_rotation)*25; 
    var upper_lamp_base_y=Math.sin(lower_rotation)*25;
    var upper_lamp = new THREE.Group();
    upper_lamp.position.set(upper_lamp_base_x, upper_lamp_base_y);
    lower_lamp.add(upper_lamp);

    var mesh_joint_mid = new THREE.MeshBasicMaterial({ color: '#49BEA2' });
    var joint_mid_geometry = new THREE.SphereGeometry(2.5, 15, 15);
    var joint_mid = new THREE.Mesh(joint_mid_geometry, mesh_joint_mid);
    upper_lamp.add(joint_mid);

    var faceMaterial_upper_arm = new THREE.MeshBasicMaterial({ color: '#49BEA2' });
    var cylinderGeometry_upper_arm = new THREE.CylinderGeometry(2, 2, 15, 12);
    var upper_arm = new THREE.Mesh(cylinderGeometry_upper_arm, faceMaterial_upper_arm);
    upper_arm.position.set(0, base_height+27, 0);
    //upper_arm.rotate;
    upper_lamp.add(upper_arm);
    upper_lamp.rotateX(upper_rotation);
   

    
    //Lamp light components are grouped
    var lamp_light_x=Math.cos(upper_rotation)*25; 
    var lamp_light_y=Math.sin(upper_rotation)*25;
    var lamp_light = new THREE.Group();
    lamp_light.position.set(lamp_light_x, lamp_light_y);
    upper_lamp.add(lamp_light);
    //upper sphere joint 
    var mesh_joint_top = new THREE.MeshBasicMaterial({ color: '#49BEA2' });
    var joint_top_geometry = new THREE.SphereGeometry(2.5, 15, 15);
    var joint_top = new THREE.Mesh(joint_top_geometry, mesh_joint_top);
    lamp_light.add(joint_top);
    //lamp cylinder
    var faceMaterial_lamp_cylinder = new THREE.MeshBasicMaterial({ color: 'green' });
    var cylinderGeometry_lamp_cylinder = new THREE.CylinderGeometry(5,5, 13, 12);
    var lamp_cylinder = new THREE.Mesh(cylinderGeometry_lamp_cylinder, faceMaterial_lamp_cylinder);
    
    //lamp cone 

    //bulb 
    const points = [];
for ( let i = 0; i < 8; i ++ ) {
	points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 3 + 4, ( i - 5 ) * 1 ) );
}
    var faceMaterial_bulb = new THREE.MeshBasicMaterial({ color: '#e2ae38'});
    var geometry_bulb = new THREE.LatheGeometry(points);
    const bulb = new THREE.Mesh(geometry_bulb, faceMaterial_bulb);
    upper_lamp.add(bulb);
    
    //==========Camera controls========================

    // need a camera to look at things
    // calcaulate aspectRatio
    var aspectRatio = window.innerWidth / window.innerHeight;
    var width = 20;
    // Camera needs to be global
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 1000);
    // position the camera back and point to the center of the scene
    camera.position.x = 100;
    camera.lookAt(scene.position);

    // render the scene
    renderer.render(scene, camera);

    //declared once at the top of your code
    var camera_axis = new THREE.Vector3(-30,30,30).normalize(); // viewing axis
    
    // setup the control gui
    var controls = new function () {
	this.speed = -10
        this.redraw = function () {
        };
    };


    var gui = new dat.GUI();
    gui.add(controls, 'speed', -15, -1).onChange(controls.redraw);
    render();
    
    function render() {
        // render using requestAnimationFrame - register function
        requestAnimationFrame(render);
	speed = 2 ** controls.speed
	
        renderer.render(scene, camera);
    }
    
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // If we use a canvas then we also have to worry of resizing it
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;

// register our resize event function
window.addEventListener('resize', onResize, true);