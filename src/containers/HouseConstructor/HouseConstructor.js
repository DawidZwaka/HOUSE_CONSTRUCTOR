import React from 'react';
import * as THREE from 'three.js';


class HouseConstructor extends React.Component
{
    state = {
        canRotate: false,
        left: null,
        cameraDistance: 4
    } 
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
        
        this.camera.position.z = 4;
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

        //this.house.rotation.y += 0.01;
    }

    Rotate3DobjectHandler = (ev) => {
        const left = ev.clientX - ev.target.offsetLeft;

        if(this.state.canRotate)
        {
            const difference = this.state.left - left;

            if(difference<0) this.house.rotation.y -= difference*0.01;
            if(difference>0) this.house.rotation.y -= difference*0.01;

            this.setState({left: left});
        }
    }

    startRotatingHandler = (ev) => {
        const left = ev.clientX - ev.target.offsetLeft;

        this.setState({
            canRotate: true,
            left: left
        });
        
    }

    changeDistanceToTheObjectHandler = (ev) => {

        
        const distanceDifference = this.state.cameraDistance-ev.deltaY;
        const HouseGeometryProps = this.house.geometry.parameters;
        let cameraDistance = this.camera.position.z;
        let minDistance = 0;
        let maxDistance = 0;
 
        if(HouseGeometryProps.width >= HouseGeometryProps.depth){
            minDistance=HouseGeometryProps.width*1.7;
            maxDistance=HouseGeometryProps.width*5;
        }
        else {
            minDistance = HouseGeometryProps.depth*1.7;
            maxDistance = HouseGeometryProps.depth*5;
        }

        if(distanceDifference>0 && cameraDistance>minDistance) this.camera.position.z += 0.005*ev.deltaY;
        if(distanceDifference<0 && cameraDistance<maxDistance) this.camera.position.z += 0.005*ev.deltaY;
    }
    render()
    {
        return(
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <h1>House Constructor</h1>
            <div style={{
                width: '90vw',
                height: '40vh'
            }} ref='houseConstructor'
            onMouseDown={this.startRotatingHandler}
            onMouseUp={() => this.setState({canRotate: false})}
            onMouseMove={this.Rotate3DobjectHandler}
            onWheel={this.changeDistanceToTheObjectHandler}></div>
        </div>);
    }
}

export default HouseConstructor;