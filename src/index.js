import React, { useState } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const tureResult = [{
    id:'item-1',
    content:'item 1',
    val:0
},{
    id:'item-2',
    content:'item 2',
    val:1
},{
    id:'item-3',
    content:'item 3',
    val:2
},{
    id:'item-4',
    content:'item 4',
    val:3
},{
    id:'item-5',
    content:'item 5',
    val:4
},{
    id:'item-6',
    content:'item 6',
    val:5
},{
    id:'item-7',
    content:'item 7',
    val:6
},{
    id:'item-8',
    content:'item 8',
    val:7
},{
    id:'item-9',
    content:'item 9',
    val:8
},{
    id:'item-10',
    content:'item 10',
    val:9
}
]
let difference = null

// fake data generator
const getItems = (count, offset = 1) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`,
        val : k
    }));

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    if(startIndex === endIndex ){
        result[startIndex].val = startIndex;
        result[endIndex].val = endIndex;
    }
    return result;
};
/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);

    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    return result;
};
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
});
const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250
});

function QuoteApp() {
    const [state, setState] = useState([getItems(10)]);
    const [show , setshow ] = useState(false)
    function onDragEnd(result) {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            const items = reorder(state[sInd], source.index, destination.index);
            const newState = [...state];

            newState[sInd] = items;
            setState(newState);
        } else {
            const result = move(state[sInd], state[dInd], source, destination);
            const newState = [...state];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];

            setState(newState.filter(group => group.length));
        }
    }
    function compare(item1,item2,status){
        difference = []
        for (let i = 0; i < 10; i++) {
            item1[0][i].val <= item2[i].val ? difference.push(item2[i].val - item1[0][i].val) : difference.push(item1[0][i].val - item2[i].val)
        }
        setshow(status)
    }
    return (
            <div style={{ display: "flex" }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    {state.map((el, ind) => (
                        <Droppable key={ind} droppableId={`${ind}`}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                    {...provided.droppableProps}
                                >
                                    {el.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-around"
                                                        }}
                                                    >
                                                        {item.content}
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </DragDropContext>
                <div style={getListStyle()}>
                {show ? tureResult.map((el)=> (
                    <div style={getItemStyle()} key={el.id}>
                        {el.content}
                    </div>
                    )) : null}
            </div>
                <div style={getListStyle()}>
                    {show ? difference.map((el)=> (
                        <div style={getItemStyle()} key={`${el} - ${Math.floor(Math.random() * 100)}` }>
                            {el}
                        </div>
                    )) : null}
                </div>
                <button onClick={() => compare(state,tureResult,true)}>Compare it!</button>
            </div>



    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<QuoteApp />, rootElement);
