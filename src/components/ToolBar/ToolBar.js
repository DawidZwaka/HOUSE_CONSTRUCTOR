import React from 'react';
import DraggableRect from '../DraggableRect/DraggableRect';
import Styled from 'styled-components';

const ToolBarHeader = Styled.h3`
    position: absolute
    left: 0
    top: 50%
    margin: 0
    transform-origin: center center
    transform: translate(-70%, -50%) rotateZ(-90deg)
    
`,
    PosSelect = Styled.select`
    
`,
    ObjDepth = Styled.input`
    
`,
    AddBtn = Styled.button`
    height: auto
    padding: 5px 15px
`,
    ToolBarCnt = Styled.div`
    border: 2px solid black
    width: 103%
    padding: 10px
    position: relative
    display: flex
    justify-content: space-around
    height: 200px
`

class ToolBar extends React.Component{

    render(){

        const width = 100*this.props.areaRatio,
            height = 100;

        return(
            <ToolBarCnt>
                <ToolBarHeader>ToolBar</ToolBarHeader>
                <form>
                    <PosSelect onChange={this.props.pos}>
                        <option value='top'>TOP</option>
                        <option value='right'>RIGHT</option>
                        <option value='left'>LEFT</option>
                        <option value='front'>FRONT</option>
                        <option value='back'>BACK</option>
                    </PosSelect>
                    <ObjDepth type='number' step='0.1' min='0.1' max='10'>
                    </ObjDepth>
                </form>

                <DraggableRect
                        width={width}
                        height={height}
                        updateProps={this.props.updateProps}
                />
                <AddBtn>Add</AddBtn>

            </ToolBarCnt>);
    }
}

export default ToolBar;