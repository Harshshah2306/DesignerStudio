import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { SignatureHelpTriggerReason } from 'typescript';

export interface elementDefinition{
    elementId: string,
    elementName: string,
    responses: string [],
    elementType: string,
    fields: number []
}

export interface fieldDefinition {
    fieldName: string | number;
    fieldType: string;
}

export interface UIDesignerState {
    processId: string;
    processName: string;
    elements: Record<string, elementDefinition>;
    fieldDefinitions: Record<number, fieldDefinition>;
    sequenceFlows: Record<string, string>;
    processDescription: string;
    bpmn: string;
}

export interface addFieldInterface {
    fieldType : string,
    elementId : string
}

export interface deleteFieldInterface {
    fieldId: number,
    elementId: string
}

export interface editFieldInterface {
    fieldId : number,
    fieldName : string
}

const initialState: UIDesignerState = {
    processId: "INIT",
    processName: "INIT",
    elements: {},
    fieldDefinitions: {},
    sequenceFlows: {},
    processDescription: "INIT",
    bpmn: "INIT"
};

const generateFieldId = (givenState: UIDesignerState): number => {
    if (Object.keys(givenState.fieldDefinitions).length === 0) {
      return 1;
    }
    return (
      Number(
        Object.keys(givenState.fieldDefinitions)[
          Object.keys(givenState.fieldDefinitions).length - 1
        ]
      ) + 1
    );
  };

export const uiDesignerSlice = createSlice({
    name: 'UIDesigner',
    initialState: initialState,
    reducers: {
        loadRedux: ( state, action: PayloadAction<UIDesignerState>) => {
            return action.payload;
        },
        addField: ( state, action: PayloadAction<addFieldInterface>) => {
            return {
                ...state,
                elements: {
                    ...state.elements,
                    [action.payload.elementId]:{
                        ...state.elements[action.payload.elementId],
                        fields : [ ...state.elements[action.payload.elementId].fields, ...[generateFieldId({...state})]]
                    }
                },
                fieldDefinitions : {
                    ...state.fieldDefinitions,
                    [generateFieldId({...state})] : {
                        fieldName: generateFieldId({...state}),
                        fieldType: action.payload.fieldType,
                        DATASET: []
                    }
                }              
              };
        },
        deleteField: ( state, action: PayloadAction<deleteFieldInterface>) => {
            return {
                ...state,
                elements: {
                    ...state.elements,
                    [action.payload.elementId]:{
                        ...state.elements[action.payload.elementId],
                        fields : state.elements[action.payload.elementId].fields.filter( currentFieldId => currentFieldId !== action.payload.fieldId)
                    }
                }
            }
        },
        editField: ( state, action: PayloadAction<editFieldInterface>) => {
            return {
                ...state,
                fieldDefinitions:{
                    ...state.fieldDefinitions,
                    [action.payload.fieldId]:{
                        ...state.fieldDefinitions[action.payload.fieldId],
                        fieldName: action.payload.fieldName
                    }
                }
            }
        },
    }
});

export const { loadRedux } =    uiDesignerSlice.actions;
export const { addField } =     uiDesignerSlice.actions;
export const { deleteField } =  uiDesignerSlice.actions;
export const { editField } =    uiDesignerSlice.actions;

export default uiDesignerSlice.reducer;

export const getRedux = (): ((state: AppState) => UIDesignerState) => {
    return (state: AppState) => state.UIDesigner;
}






