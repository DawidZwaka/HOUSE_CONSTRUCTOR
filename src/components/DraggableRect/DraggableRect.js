import React from 'react';
import Styled from 'styled-components';
import interact from 'interactjs';

const RectArea = Styled.div`
    display: inline-block
    width: ${props=>props.width}px
    height: ${props=>props.height}px
    background: black
    position: relative
`
const Rct = Styled.div`
    background-color: #29e
    color: white
    font-size: 20px
    padding: 20px
    touch-action: none
    width: 100px
    position: absolute
    box-sizing: border-box
    `

class DraggableRect extends React.Component{

      componentDidMount(){
        console.log(this.props.width);
        const position = {x: 0, y:0},
          size = {width: 40,height: 40};

        interact('.draggable')
            .draggable({
                inertia: true,
                modifiers: [
                  interact.modifiers.restrict({
                    restriction: 'parent',
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                  })
                ],
                onmove: function (event) {
                  var rectangle = event.target;

                  position.x +=event.dx;
                  position.y +=event.dy;

                  rectangle.style.left = position.x+'px';
                  rectangle.style.top = position.y+'px';

                  
                }
              })
              .resizable({
                edges: { left: true, right: true, top: true, bottom: true },
                modifiers: [
                    interact.modifiers.restrictSize({
                        min: { width: 50, height: 50 },
                      }),
                    interact.modifiers.restrictEdges({outer: 'parent'})
                ],
                onmove: function (event) {
                  var rectangle = event.target;
                
                  if(event.edges.top){
                    position.y +=event.dy;
                  }
                  if(event.edges.left){
                    position.x +=event.dx;
                  }

                  size.width = event.rect.width;
                  size.height = event.rect.height;
                  rectangle.style.left = position.x+'px';
                  rectangle.style.top = position.y+'px';
                  rectangle.style.width = event.rect.width+'px';
                  rectangle.style.height = event.rect.height+'px';
                  
                  //props.updateProps(position.x, position.y, event.rect.width, event.rect.height);
                }
              }).on('dragend resizeend', ()=> {
                this.props.updateProps(100*position.x/this.props.width, 100*position.y/this.props.height, 100*size.width/this.props.width, 100*size.height/this.props.height)
                console.log('wow');
                return;
              });
  
        }

        render(){
        return(
            <RectArea 
              height={this.props.height}
              width={this.props.width}>
            <Rct className='draggable'/>
            </RectArea>
            
        );
        }
}

export default DraggableRect;