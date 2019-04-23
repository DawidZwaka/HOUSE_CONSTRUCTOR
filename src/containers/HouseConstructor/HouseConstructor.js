import React from 'react';
import THREE from '../../THREE';
import MainMenu from '../../UI/MainMenu/MainMenu';
import './HouseCustomizer.css';
import VertexShader from '../../shaders/vertex';
import FragmentShader from '../../shaders/fragmentShader';

class HouseConstructor extends React.Component
{
    state = {
        canRotate: false,
        left: null,
        cameraDistance: 4,
        houseBaseProps: {
            materialFunc: 'lambertMesh',
            materialProps: {
                color: '#f9f9f9',
            },
            GeometryFunc: 'cuboid',
            size: [4,2,4]
        },
        houseAddons: {
            garage: {
                materialFunc: 'lambertMesh',
                materialProps: {
                    color: '#f9f9f9',
                },
                GeometryFunc: 'cuboid',
                size: [2,1,3],
                position: 'left'
            },/*
            roof:{
                materialFunc: 'lambertMesh',
                materialProps: {
                    color: '#f9f9f9',
                },
                GeometryFunc: 'cone',
                size: [3,.6,4],
                position: 'top'
            }*/
        },
        interimWidth: 1,
        interimHeight: 1,
        interimDepth: 1,
        interimPos: 'left',
    } 
    componentDidMount()
    {
        //SETTING SCENE,CAMERA,RENDERER ETC.
        const houseConstructor = this.refs['houseConstructor'];
        const width = houseConstructor.clientWidth;
        const height = houseConstructor.clientHeight;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(80, width/height, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        houseConstructor.appendChild(this.renderer.domElement);
        this.updateDimensions(houseConstructor);

        //CAMERA SETTING
        this.camera.position.z = 8;//this.state.houseBaseProps.size[2]*2.5;
        this.camera.position.y = 2.5;
        this.camera.rotation.x = -Math.PI/20;
        this.controls = new THREE.OrbitControls(this.camera, houseConstructor);
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 3;
        this.controls.maxPolarAngle = Math.PI/2.3;
        this.controls.enableKeys = false;
        this.controls.enablePan = false;
        this.controls.maxDistance = 20;
        this.controls.enableDambing = true;

        //CREATE HOUSE BASE
        this.house = this.create3Dobj(
            ...Object.values(this.state.houseBaseProps)
        );
        this.house.castShadow = true;
        this.scene.add(this.house);

        //CREATE HOUSE ADDONS
        Object.entries(this.state.houseAddons).map(
            addon => {
                const addonObj = this.create3Dobj(...Object.values(addon[1]));
                this.house.add(addonObj);
            });

        //CREATE SURRODINGS
        this.createSurroindings();    

        //RESIZE LISTENER, ANIMATION LOOP
        window.addEventListener('resize', () => this.updateDimensions(houseConstructor));
        this.animate();
    }


    updateDimensions = (field) =>{
        console.dir(field);
        this.renderer.setSize(field.clientWidth,field.clientHeight);
        const aspectRatio = field.clientWidth/field.clientHeight;
        this.camera.aspect = aspectRatio;
        this.camera.updateProjectionMatrix();
    }

    create3Dobj = (
        materialFuncSym, 
        materialProps={color:'white'}, 
        shapeFuncSym, 
        shapeProps=[1,1,1],
        positionSym) => {
        
        let materialFunc,shapeFunc;
        switch (materialFuncSym) {
            case 'basicMesh':
            materialFunc = THREE.MeshBasicMaterial
                break;
            case 'lambertMesh':
            materialFunc = THREE.MeshLambertMaterial
                break;
        
            default: materialFunc = THREE.MeshBasicMaterial
                break;
        }
        switch (shapeFuncSym) {
            case 'cuboid':
            shapeFunc = THREE.BoxGeometry
                break;
            case 'cone': 
            shapeFunc = THREE.ConeGeometry
                break;
            default: shapeFunc = THREE.BoxGeometry
                break;
        }


        const material = new materialFunc(materialProps);
        const shape = new shapeFunc(...shapeProps);

        const THREEDobj = new THREE.Mesh(shape, material);
        THREEDobj.castShadow = true;

        switch(positionSym){
            case 'left':
            {
                THREEDobj.position.x = -this.state.houseBaseProps.size[0]/2-THREEDobj.geometry.parameters.width/2;
                break;
            }
            case 'top': 
            {
                THREEDobj.position.y = +this.state.houseBaseProps.size[1]/2+THREEDobj.geometry.parameters.height/2;
                break;
            }
            case 'right':
            {
                THREEDobj.position.x = this.state.houseBaseProps.size[0]/2+THREEDobj.geometry.parameters.width/2;
                break;
            }
            case 'front':
            {
                THREEDobj.position.z = this.state.houseBaseProps.size[2]/2+THREEDobj.geometry.parameters.depth/2;
                break;
            }
            case 'back':
            {
                THREEDobj.position.z = -this.state.houseBaseProps.size[2]/2-THREEDobj.geometry.parameters.depth/2;
                break;
            }
            default: break;
        }


        return THREEDobj;
    }

    createSurroindings = () => {
        //FLOOR
        const material = new THREE.MeshPhongMaterial({color: 0x444444});
        material.color.setHSL( .21, 1, 0.7 );
        const shape = new THREE.PlaneBufferGeometry(1000,1000);
        const floor = new THREE.Mesh(shape, material);
        floor.receiveShadow = true;
        floor.rotation.x = -Math.PI/2;
        floor.position.y = -this.state.houseBaseProps.size[1]/2;
        this.scene.add(floor);

        //HEMISPHERE LIGHT
        let light = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
        light.color.setHSL( 0.6, 1, 0.6 );
		light.groundColor.setHSL( 0.095, 1, 0.75 );
        light.position.set(0,50,0);
        this.scene.add(light);
        
        //SPOT LIGHT
        const pointLight = new THREE.DirectionalLight(0xffffff, 1);
        pointLight.color.setHSL( 0.1, 1, 0.9 );
		pointLight.position.set( 1, 1.9, 1 );
		pointLight.position.multiplyScalar( 30 );
        this.scene.add(pointLight)

        pointLight.castShadow = true;
        pointLight.shadow.bias = -0.00001;
        pointLight.shadow.mapSize.width = 2048;
        pointLight.shadow.mapSize.height = 2048;
        pointLight.shadow.camera.near = 1;
        pointLight.shadow.camera.far = 500;

        var spotLightHelper = new THREE.DirectionalLightHelper( pointLight );
        this.scene.add( spotLightHelper );
        

        const uniforms = {
            "topColor": { value: new THREE.Color( 0x0077ff ) },
            "bottomColor": { value: new THREE.Color( 0xffffff ) },
            "offset": { value: 13 },
            "exponent": { value: 1.3 }
        };
        const skyMaterial = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: VertexShader,
            fragmentShader: `
            uniform vec3 topColor;
			uniform vec3 bottomColor;
			uniform float offset;
			uniform float exponent;
			varying vec3 vWorldPosition;
			void main() {
				float h = normalize( vWorldPosition + offset ).y;
				gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
			}`,
            side: THREE.BackSide
        } );
        const skyShape = new THREE.SphereBufferGeometry(1000, 12, 10);
        const sky = new THREE.Mesh(skyShape, skyMaterial);
        this.scene.add(sky);
        
        this.scene.background = new THREE.Color().setHSL( 0.25, 1, .96 );
        this.scene.fog = new THREE.Fog(this.scene.background, .1, 200);
        //this.scene.fog.color.copy(uniforms['bottomColor'].value);
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);

        this.controls.update();
    }

    someFunc = (ev) => {
        const pos = this.state.interimPos;
        const field = this.refs['someField'];
        const size = this.refs['interimSize'];
        const houseBaseSize = this.state.houseBaseProps.size;
        const objSize = [
            this.state.interimWidth,
            this.state.interimHeight,
            this.state.interimDepth
        ];

        if(pos==='left' || pos==='right'){
            field.style.height = (houseBaseSize[1]*parseInt(field.style.width))/houseBaseSize[0]+'px';
        }
        else if(pos==='front' || pos==='back'){

        }
        else{

        }

        size.style.width = this.state.interimWidth*100/houseBaseSize[0]+'%';
        size.style.height = this.state.interimHeight*100/houseBaseSize[1]+'%';
        
        const obj = this.create3Dobj('lambertMesh', {color: 'white'}, 'cuboid', objSize, pos);
        console.log(pos);
        this.scene.add(obj);
    }

    render()
    {
        return(
        <>
        <div style={{
            display: 'flex',
            flex: '1 1 100%',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '70px 70px',
            height: '100%',
            boxSizing: 'border-box',
            maxWidth: '1400px',
            border: '2px solid black'
        }}>
            <div style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                transform: 'translateY(30%)',
            }}>
                <h1 style={{
                    fontWeight: '100',
                    width: '100%',
                    margin: 0,
                    lineHeight: 1,
                }}
                >House Customizer</h1>
                <MainMenu/>
            </div>
            <div style={{
                width: '100%',
                flex: '1 1 100%',
                padding: '0px',
                boxSizing: 'border-box',
                margin: 0,
                maxWidth: '100%'
            }} ref='houseConstructor'></div>
            <div style={{
                border: '2px solid black',
                width: '103%',
                padding: '10px'
            }}>
                <form>

                    <select 
                        onChange={ev => this.setState({interimPos: ev.target.value})}>
                        <option value='top'>TOP</option>
                        <option value='right'>RIGHT</option>
                        <option value='left'>LEFT</option>
                        <option value='front'>FRONT</option>
                        <option value='back'>BACK</option>
                    </select>
                    <input 
                        className='planeInput' 
                        step='0.1'
                        onChange={ev =>this.setState({interimWidth: ev.target.value})} 
                        type='number'/>
                    <input 
                        className='planeInput' 
                        step='0.1'
                        onChange={ev => this.setState({interimHeight: ev.target.value})} 
                        type='number'/>
                    <input 
                        className='planeInput' 
                        step='0.1'
                        onChange={ev => this.setState({interimDepth: ev.target.value})} 
                        type='number'/>
                </form>
                <div ref='someField' style={{
                    width: '150px',
                    background: '#cecece'
                }}>
                    <div
                    ref='interimSize'
                    style={{
                        border: '1px red solid',
                        background: 'rgba(255,0,0, .2)'
                    }}></div>
                </div>
                <button onMouseEnter={this.someFunc}>Position</button>
                <button style={{
                    background: 'none',
                    border: '2px solid black',
                    padding: '5px 15px'
                }}>Add</button>
            </div>
        </div>

        </>);
    }
}

export default HouseConstructor;