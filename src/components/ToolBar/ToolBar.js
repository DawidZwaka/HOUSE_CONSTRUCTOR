import React from 'react';
import DraggableRect from '../DraggableRect/DraggableRect';

class ToolBar extends React.Component{

    render(){

        const width = 100*this.props.areaRatio,
            height = 100;

        return(
            <div style={{
                border: '2px solid black',
                width: '103%',
                padding: '10px'
            }}>
            <div style={{display: 'flex',
                        }}
                ref='lol'>
                <form>
                    <select 
                        onChange={this.props.pos}>
                        <option value='top'>TOP</option>
                        <option value='right'>RIGHT</option>
                        <option value='left'>LEFT</option>
                        <option value='front'>FRONT</option>
                        <option value='back'>BACK</option>
                    </select>
                </form>
                    <DraggableRect
                            width={width}
                            height={height}
                            updateProps={this.props.updateProps}/>
                
                <button style={{
                    background: 'none',
                    border: '2px solid black',
                    padding: '5px 15px'
                }}ref='xd'
                >Add</button>
            </div>
            </div>);
    }
}

export default ToolBar;