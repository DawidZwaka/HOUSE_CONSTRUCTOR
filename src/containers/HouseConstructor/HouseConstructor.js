import React from 'react';
import * as THREE from 'three.js';


class HouseConstructor extends React.Component
{
    componentDidMount()
    {
        const houseConstructor = this.refs['houseConstructor'];
        const width = houseConstructor.clientWidth;
        const height = houseConstructor.clientHeight;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(width,height);
        houseConstructor.appendChild(this.renderer.domElement);
        
        this.camera.position.z = 3;
        this.camera.position.y = 1;
        this.camera.rotation.x = -Math.PI/10;

        this.house = this.create3Dobj(
            THREE.MeshBasicMaterial,
            {color: 'white',
             wireframe: true
            },
            THREE.BoxGeometry,
            [2,1,2]);

        this.scene.add(this.house);

        this.animate();
    }

    create3Dobj = (materialFunc = THREE.MeshBasicMaterial, materialProps = {color: 'white'}, shapeFunc = THREE.BoxGeometry, shapeProps = [1,1,1]) => {
        
        const material = new materialFunc(materialProps);
        let [v1,v2,v3]=shapeProps;
        const shape = new shapeFunc(v1,v2,v3);

        const THREEDobj = new THREE.Mesh(shape, material);
        return THREEDobj;
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);

        this.house.rotation.y += 0.01;
    }

    render()
    {
        return(<div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <h1>House Constructor</h1>
            <div style={{
                width: '90vw',
                height: '40vh'
            }} ref='houseConstructor'></div>
        </div>);
    }
}

export default HouseConstructor;