import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { STORAGE_KEY } from '../data/sections';

const FormContext = createContext();

const initialState = {
  formData: {},
  analysisData: {},
  toastVisible: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FORM_DATA':
      return { ...state, formData: action.payload };
    case 'UPDATE_FIELD':
      return { ...state, formData: { ...state.formData, [action.key]: action.value } };
    case 'RESET_FORM':
      return { ...state, formData: {} };
    case 'LOAD_ANALYSIS':
      return { ...state, analysisData: action.payload };
    case 'MERGE_ANALYSIS': {
      const merged = { ...state.formData };
      Object.entries(action.payload).forEach(([key, val]) => {
        if (val && !merged[key]) merged[key] = val;
      });
      return { ...state, formData: merged };
    }
    case 'SHOW_TOAST':
      return { ...state, toastVisible: true };
    case 'HIDE_TOAST':
      return { ...state, toastVisible: false };
    default:
      return state;
  }
}

export function FormProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const saveTimer = useRef(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'SET_FORM_DATA', payload: JSON.parse(raw) });
    } catch (e) { /* ignore */ }
  }, []);

  const save = useCallback((data) => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        dispatch({ type: 'SHOW_TOAST' });
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 2000);
      } catch (e) { /* ignore */ }
    }, 300);
  }, []);

  const updateField = useCallback((key, value) => {
    dispatch({ type: 'UPDATE_FIELD', key, value });
  }, []);

  useEffect(() => {
    if (Object.keys(state.formData).length > 0) {
      save(state.formData);
    }
  }, [state.formData, save]);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <FormContext.Provider value={{
      formData: state.formData,
      analysisData: state.analysisData,
      toastVisible: state.toastVisible,
      updateField,
      resetForm,
      dispatch,
    }}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  return useContext(FormContext);
}
