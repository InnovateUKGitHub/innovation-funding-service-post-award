import React from "react";

import { ContainerBase, ReduxContainer } from '../containerBase';
import { RootState } from "../../redux/reducers/rootReducer";
import { Dispatch } from "redux";

export interface ProjectDetailsDto {
    id: string;
    name: string;
}

export interface Data {
    projectDetails: ProjectDetailsDto
}

export interface Callbacks {
    loadDetails: (id: string) => void;
}

class ProjectDetails extends ContainerBase<Data, Callbacks>{
    render(){
        return (
            <div>The details</div>
        );
    }
}

function mapData(store: RootState) {
    return {
        projectDetails: {
            id: "test id", 
            name: "test name"
        }
    };
}

function mapCallbacks (dispach: Dispatch){
    return {
        loadDetails: (id: string) => dispach({type : "TEST LOAD", payload: id})
    }
}

export default ReduxContainer.for<Data, Callbacks>(ProjectDetails)
    .withData(mapData)
    .withCallbacks(mapCallbacks)
    .connect();

