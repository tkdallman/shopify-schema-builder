import { createStore, combineReducers } from 'redux'
const arrayMove = require("array-move");

function fields (state = { store: {} }, { type, id = 'store', field, value }) {
  const defaultState = { ...state };

  switch (type) {
    case 'ADD_FIELDS':
      defaultState[id] = {}
      return defaultState
    case 'DELETE_ALL_FIELDS':
      delete defaultState[id]
      return defaultState      
    case 'UPDATE_FIELD':
      if (!defaultState[id]) defaultState[id] = {}
      defaultState[id][field] = value
      return defaultState
    default:
      return state
  }
}

function settings (state = { store: [] }, { type, setting, id = 'store', index, destination }) {
  const defaultState = { ...state };

  switch (type) {
    case 'ADD_SETTING':
      setting && defaultState[id]
        ? defaultState[id].push(setting)
        : defaultState[id] = []
      return defaultState
    case 'UPDATE_SETTING':
      defaultState[id][index] = setting
      return defaultState
    case 'DELETE_SETTING':
      defaultState[id].splice(index, 1)
      return defaultState
    case 'DELETE_ALL_SETTINGS':
      delete defaultState[id]
      return defaultState
    case 'MOVE_SETTING':
      const movedSettings = arrayMove(defaultState[id], index, destination)
      defaultState[id] = movedSettings
      return defaultState

    default: return state
  }
}

function modal (state = { modalActive: false }, action) {
  switch (action.type) {
    case 'MODAL_ACTIVE':
      return {
        modalActive: action.modalActive,
        modalType: action.modalType,
        item: action.item,
        index: action.index,
        id: action.id,
        blockIndex: action.blockIndex
      }
    default: return state
  }
}

function blocks (state = [], action) {
  const updatedState = [ ...state ]
  switch (action.type) {
    case 'ADD_BLOCK': 
      updatedState.push({ id: `block_${Date.now()}`, isOpen: true })
      return updatedState
    case 'TOGGLE_BLOCK':
      updatedState[action.index].isOpen = action.setting
      return updatedState
    case 'DELETE_BLOCK':
      updatedState.splice(action.index, 1)
      return updatedState
    default: return state    
  }
}

function error (state = { errorState: false }, action) {
  switch (action.type) {
    case 'SET_ERROR_STATE':
      return {
        errorState: action.errorState
      }
    default: return state
  }
}

const reducer = combineReducers({ settings, modal, error, blocks, fields })
const store = createStore(
  reducer, {}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default store