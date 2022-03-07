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
    const arm_height = 25;
    const joint_radius = 2;
    const lamp_body_height = 12;
    const lamp_cone_height = 12;

    //rotation angles in radians TO_MODIFY
    var lower_rotation =-Math.PI/4;
    var upper_rotation=Math.PI/2;
    var head_rotation=Math.PI/2;

    //base support 
    var faceMaterial_support = new THREE.MeshBasicMaterial({ color: '#b3f542' });
    var cylinderGeometry_support = new THREE.CylinderGeometry(10,10, 3, 12);
    var support = new THREE.Mesh(cylinderGeometry_support, faceMaterial_support);
    support.position.set (0, base_height, 0);
    lamp.add(support);

    //--------------------------------------- lower lamp group ---------------------------------------
    var lower_lamp = new THREE.Group();
    support.add(lower_lamp);

    //add lower sphere joint
    var mesh_joint_one = new THREE.MeshBasicMaterial({ color: '#a83256' });
    var joint_one_geometry = new THREE.SphereGeometry(joint_radius, 15, 15);
    var joint_one = new THREE.Mesh(joint_one_geometry, mesh_joint_one);
    lower_lamp.add(joint_one);

    //add lower arm
    var faceMaterial_lower_arm = new THREE.MeshBasicMaterial({ color: '#49BEA2' });
    var cylinderGeometry_lower_arm = new THREE.CylinderGeometry(2,2, arm_height, 12);
    var lower_arm = new THREE.Mesh(cylinderGeometry_lower_arm, faceMaterial_lower_arm);
    lower_arm.position.set(0, (arm_height/2), 0);
    lower_lamp.add(lower_arm);

    //rotate lower_lamp group
    lower_lamp.rotation.x = lower_rotation;
    lower_lamp.position.set(0, joint_radius, 0);
    
    //--------------------------------------- upper lamp group ---------------------------------------
    var upper_lamp = new THREE.Group();
    lower_lamp.add(upper_lamp);
    
    //add middle joint
    var mesh_joint_mid = new THREE.MeshBasicMaterial({ color: '#a83256' });
    upper_lamp.rotation.x = upper_rotation;
    var joint_mid_geometry = new THREE.SphereGeometry(joint_radius, 15, 15);
    var joint_mid = new THREE.Mesh(joint_mid_geometry, mesh_joint_mid);
    upper_lamp.add(joint_mid);

    //add upper arm
    var faceMaterial_upper_arm = new THREE.MeshBasicMaterial({ color: '#49BEA2' });
    var cylinderGeometry_upper_arm = new THREE.CylinderGeometry(2, 2, arm_height, 12);
    var upper_arm = new THREE.Mesh(cylinderGeometry_upper_arm, faceMaterial_upper_arm);
    upper_arm.position.set(0, arm_height /2.0, 0);
    upper_lamp.add(upper_arm);

    //rotate and relatively position upper_lamp group
    upper_lamp.rotation.x = upper_rotation;
    upper_lamp.position.set(0, arm_height, 0);   

    //-------------------------------------- lamp light group --------------------------------------
    //Lamp light components are grouped
    var lamp_light = new THREE.Group();
    upper_lamp.add(lamp_light);

    //add upper sphere joint 
    var mesh_joint_top = new THREE.MeshBasicMaterial({ color: '#a83256' });
    var joint_top_geometry = new THREE.SphereGeometry(joint_radius, 15, 15);
    var joint_top = new THREE.Mesh(joint_top_geometry, mesh_joint_top);

    lamp_light.add(joint_top);
    //add lamp body
    var faceMaterial_lamp_body = new THREE.MeshBasicMaterial({ color: '#42f5ec' });
    var cylinderGeometry_lamp_body = new THREE.CylinderGeometry(3,3, lamp_body_height, 12);
    var lamp_body = new THREE.Mesh(cylinderGeometry_lamp_body, faceMaterial_lamp_body);
    lamp_body.position.set(0, 0, -joint_radius*2);
    lamp_light.add(lamp_body);
    
    //add lamp cone 
    var faceMaterial_lamp_cone = new THREE.MeshBasicMaterial({ color: '#42a4f5' });
    var cylinderGeometry_lamp_cone = new THREE.CylinderGeometry(8,3, lamp_cone_height, 12);
    var lamp_cone = new THREE.Mesh(cylinderGeometry_lamp_cone, faceMaterial_lamp_cone);
    lamp_cone.position.set(0, lamp_body_height, -joint_radius*2);
    lamp_light.add(lamp_cone);

    //add bulb 
    var mesh_lamp_bulb = new THREE.MeshBasicMaterial({ color: '#eff542' });
    var lamp_bulb_geometry = new THREE.SphereGeometry(3, 15, 15);
    var lamp_bulb = new THREE.Mesh(lamp_bulb_geometry, mesh_lamp_bulb);
    lamp_bulb.position.set(0, lamp_body_height/2+lamp_cone_height, -joint_radius*2);
    lamp_light.add(lamp_bulb);

    //rotate and relatively position lamp light group
    lamp_light.rotation.x = head_rotation;
    lamp_light.position.set(0, arm_height, 0);


    //TODO: is this needed?
    /*const points = [];
for ( let i = 0; i < 8; i ++ ) {
	points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 3 + 4, ( i - 5 ) * 1 ) );
}
    var faceMaterial_bulb = new THREE.MeshBasicMaterial({ color: '#e2ae38'});
    var geometry_bulb = new THREE.LatheGeometry(points);
    const bulb = new THREE.Mesh(geometry_bulb, faceMaterial_bulb);*/
    //upper_lamp.add(bulb);
    
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
        //Lower joint x rotation
        this.lower_arm_joint = lower_rotation
            this.rotate_lower_arm = function () {
                lower_lamp.rotation.x = controls.lower_arm_joint;
                renderer.render(scene, camera);
            };
        //Upper joint x rotation
        this.upper_arm_joint = upper_rotation
        this.rotate_upper_arm = function () {
            upper_lamp.rotation.x = controls.upper_arm_joint;
            renderer.render(scene, camera);
        };
        //Lamp head x rotation (left and right)
        this.head_left_and_right = 0
        this.rotateZ_head = function () {
            lamp_light.rotation.z = controls.head_left_and_right;
            renderer.render(scene, camera);
        };
        //Lamp head y rotation (up and down)
        this.head_up_and_down = head_rotation
        this.rotateX_head = function () {
            lamp_light.rotation.x = controls.head_up_and_down;
            renderer.render(scene, camera);
        };
    };

    //GUI controls
    var gui = new dat.GUI();
    gui.add(controls, 'lower_arm_joint', -Math.PI, Math.PI).onChange(controls.rotate_lower_arm);
    gui.add(controls, 'upper_arm_joint', -Math.PI, Math.PI).onChange(controls.rotate_upper_arm);
    gui.add(controls, 'head_left_and_right', -Math.PI, Math.PI).onChange(controls.rotateZ_head);
    gui.add(controls, 'head_up_and_down', -Math.PI, Math.PI).onChange(controls.rotateX_head);
    
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