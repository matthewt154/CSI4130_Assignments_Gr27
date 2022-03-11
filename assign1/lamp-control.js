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

    //adding a point to rotate around ("at" point)
    var at_point= new THREE.Group();
    scene.add(at_point);

    var mesh_point = new THREE.MeshBasicMaterial({ color: 'red' });
    var point_geometry = new THREE.SphereGeometry(1, 15, 15);
    var point = new THREE.Mesh(point_geometry, mesh_point);
    at_point.add(point);

    
    //==========Camera controls========================
    var cameraParams = {
        radius: 125, //constant
        a: Math.PI, //z rotation azimuth
        theta: Math.PI/2 //y rotation
    };

    // need a camera to look at things
    // calcaulate aspectRatio
    var aspectRatio = window.innerWidth / window.innerHeight;
    var width = 20;
    // Camera needs to be global
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 1000);
    // position the camera back and point to the center of the scene (aka the red point) 
    //using spherical cartesian coordinates
    camera.position.x = cameraParams.radius * Math.cos(cameraParams.a) * Math.sin(cameraParams.theta);
    camera.position.y = cameraParams.radius * Math.sin(cameraParams.a) * Math.sin(cameraParams.theta);
    camera.position.z = cameraParams.radius * Math.cos(cameraParams.theta);
    camera.lookAt(point.position);

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

    // setting up the camera control gui
    var camera_control = new function () {
        //camera placement
        //y rotation
        this.y_rotation = cameraParams.theta
        this.z_rotation = cameraParams.a
        this.rotateY_camera = function () {
            camera.position.x = cameraParams.radius * Math.cos(camera_control.z_rotation) * Math.sin(camera_control.y_rotation);
            camera.position.y = cameraParams.radius * Math.sin(camera_control.z_rotation) * Math.sin(camera_control.y_rotation);
            camera.position.z = cameraParams.radius * Math.cos(camera_control.y_rotation);
            camera.lookAt(point.position);
            renderer.render(scene, camera);
        };
        //z rotation
        this.rotateZ_camera = function () {
            camera.position.x = cameraParams.radius * Math.cos(camera_control.z_rotation) * Math.sin(camera_control.y_rotation);
            camera.position.y = cameraParams.radius * Math.sin(camera_control.z_rotation) * Math.sin(camera_control.y_rotation);
            camera.position.z = cameraParams.radius * Math.cos(camera_control.y_rotation);
            camera.lookAt(point.position);
            renderer.render(scene, camera);
            
        };
        //at point location
        this.pointing_location_x = point.position.x

        this.change_pointer_x = function () {
            point.position.x = camera_control.pointing_location_x; 
            camera.lookAt(point.position);
            renderer.render(scene, camera);
        };
        
        this.pointing_location_y = point.position.y; 
        this.change_pointer_y = function () {
            point.position.y = camera_control.pointing_location_y; 
            camera.lookAt(point.position);
            renderer.render(scene, camera);
        }; 
    };

    //GUI controls
    var gui = new dat.GUI();
    gui.add(controls, 'lower_arm_joint', -Math.PI, Math.PI).onChange(controls.rotate_lower_arm);
    gui.add(controls, 'upper_arm_joint', -Math.PI, Math.PI).onChange(controls.rotate_upper_arm);
    gui.add(controls, 'head_left_and_right', -Math.PI, Math.PI).onChange(controls.rotateZ_head);
    gui.add(controls, 'head_up_and_down', -Math.PI, Math.PI).onChange(controls.rotateX_head);

    //Camera GUI Controls
    var cam_gui = new dat.GUI();
    cam_gui.add(camera_control, 'y_rotation', -Math.PI, Math.PI).onChange(camera_control.rotateY_camera);
    cam_gui.add(camera_control, 'z_rotation', -Math.PI, Math.PI).onChange(camera_control.rotateZ_camera);    
    cam_gui.add(camera_control, 'pointing_location_x', -20, 20).onChange(camera_control.change_pointer_x);  
    cam_gui.add(camera_control, 'pointing_location_y', -20, 20).onChange(camera_control.change_pointer_y);    

    //------------------------jump animation----------------------------
    var controls_animation = new function () {
        this.jump_animation = false
            this.toggle_jump = function () {

                if(this.jump_animation) {
                    //jump disabled
                    this.jump_animation = false
                } else {
                    //jump enabled
                    this.jump_animation = true
                    render_jump();
                    console.log("jump enabled")
                }

            };
        };
    
    var gui = new dat.GUI();
    gui.add(controls_animation, 'jump_animation').onChange(controls_animation.toggle_jump);

    function render_jump() {

        //Disables if switch is off
        if (!controls_animation.jump_animation) {
            frame_int = 0;
            return
        }

        // render using requestAnimationFrame - register function
        requestAnimationFrame(render_jump);

        //adds 3 degrees per frame
        frame_int = frame_int + 3*Math.PI/180

        //Animates the upper arm, the lower arm and the lamp head and support
        lower_lamp.rotation.x = (Math.PI/4)*(Math.sin(-frame_int)) + Math.PI + Math.PI/2 + Math.PI/4
        upper_lamp.rotation.x = (Math.PI/2)*(Math.sin(frame_int)) + Math.PI/2
        lamp_light.rotation.x = (Math.PI/2)*(Math.sin(-frame_int)) + Math.PI/2 - Math.PI/8
        support.position.set(0, 20*Math.sin(-frame_int - 10*Math.PI/180), 0);

        //render
        renderer.render(scene, camera);
    }
}
//initialises frame counter for jump animation
frame_int = 0
    
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // If we use a canvas then we also have to worry of resizing it
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;

// register our resize event function
window.addEventListener('resize', onResize, true);