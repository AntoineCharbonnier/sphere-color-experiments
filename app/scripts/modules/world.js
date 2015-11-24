import { Keyboard } from './keyboard';
import { Sphere } from './sphere';

let THREE = require('../vendors/three.min');
let EffectComposer = require('three-effectcomposer')(THREE);
let OrbitControls = require('three-orbit-controls')(THREE);

class World {

    constructor( _options ) {

    	let options = _options || {};

        this.scene     = null;
        this.camera    = null;
        this.renderer  = null;
        this.composer  = null;
        this.keyboard  = null;
        this.container = options.container || document.body;
        this.controls  = null;

    	this.params = {
    		active: options.active || true,
	        height: options.height || window.innerHeight,
	        width: options.width   || window.innerWidth
    	};

    	this.mouse = {
	        x: null,
	        y: null
	    };

	    this.clock = null;
    }

    init() {

    	this.scene = new THREE.Scene();
    	this.camera = new THREE.PerspectiveCamera( 45, this.params.width / this.params.height, 1, 10000 );
    	this.scene.add( this.camera );

        this.addLights();
        this.addSphere();

        this.renderer = new THREE.WebGLRenderer({
	        antialias: true
	    });
	    this.renderer.setClearColor(  0x000000, 1 );
    	this.renderer.setSize( this.params.width, this.params.height );

    	this.composer = new EffectComposer( this.renderer );
    	this.container.appendChild( this.renderer.domElement );
    	this.clock = Date.now();

    	this.addListeners();
    	this.animate();

    }

    addControls() {

        this.controls = new OrbitControls( this.camera );
    }

    addLights() {
        var ambient = new THREE.AmbientLight( 0x777777 );
        this.scene.add( ambient );

        var directionalLight = new THREE.DirectionalLight( 0xe2ffaa );
        directionalLight.position.x = 0;
        directionalLight.position.y = -1;
        directionalLight.position.z = -1;
        directionalLight.position.normalize();
        this.scene.add( directionalLight );

        var light = new THREE.SpotLight( 0x999999, 2, 0 );
        light.position.set( -500, 9500, -12000 );
        light.target.position.set( 0, 0, -11990 );
        light.castShadow = true;
        this.scene.add( light );
    }

    addSphere() {
    	this.sphere = new Sphere();
    	this.scene.add( this.sphere );
    }


    getScene() {
        return this.scene;
    }

    animate( ts ) {
        if (this.params.active) {
            window.requestAnimationFrame( this.animate.bind(this) );
            this.render( ts );
        }
    }

    render() {
    	if (!this.params.active)
        	this.params.active = true;
        this.renderer.render( this.scene, this.camera );	

    }

    addListeners() {
    	window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );
    	this.keyboard = new Keyboard();	
        this.keyboard.addObject( this.sphere );
    }

    onWindowResize() {
        this.params.width  = window.innerWidth;
        this.params.height = window.innerHeight;
        this.camera.aspect = this.params.width / this.params.height;
	    this.camera.updateProjectionMatrix();
	    this.renderer.setSize( this.params.width, this.params.height );
    }

}

export { World };