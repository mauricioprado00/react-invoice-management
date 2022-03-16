import PropTypes from 'prop-types'
import { InputChangeEvent } from "components/ui/forms/InputText";
import produce from "immer";
import { MapType, MapTypeFill, MapTypeSome } from "models/UtilityModels";
import { useCallback, useMemo, useState } from "react";

type FormElementChangeEvent = {
  target: {
    value: string,
  }
  fieldName: string,
}
export type FormElementProps = {
  reset?: number;
  onValid?: (name: string, valid: boolean) => void;
  onChange?: (e: FormElementChangeEvent) => void;
  showErrors?: boolean;
  disabled?: boolean;
}

export const FormElementPropTypes = {
  reset: PropTypes.number,
  onValid: PropTypes.func,
  onChange: PropTypes.func,
  showErrors: PropTypes.bool,
  disabled: PropTypes.bool,
}

type FormState = {
  valid: MapType<boolean>;
  values: MapType<string>;
  disabled: MapType<boolean>;
  reset: number;
  showErrors: boolean;
};

const createInitialFormState = (elements: string[], disabledFields: string[], values:MapType<string>|undefined): FormState => {
  const state = {
    valid: MapTypeFill(elements, false),
    values: values || MapTypeFill(elements, ""),
    disabled: MapTypeFill(disabledFields, true),
    reset: 0,
    showErrors: false,
  };

  disabledFields.forEach(field => state.valid[field] = true);

  return state;
};

type useFormProps = {
  elements: string[];
  disabled: boolean;
  disabledFields?: string[];
  initialValues?: MapType<string>
};

const useForm = ({ elements, disabled, disabledFields, initialValues }: useFormProps) => {
  const disFields = useMemo(() => disabledFields || [], [disabledFields]);
  const [state, setState] = useState(createInitialFormState(elements, disFields, initialValues));
  const validHandler = useCallback((name: string, valid: boolean) => {
    setState(prev =>
      produce(prev, draft => {
        draft.valid[name] = valid;
      })
    );
  }, []);
  const changeHandler = useCallback((e: FormElementChangeEvent) => {
    setState(prev =>
      produce(prev, draft => {
        draft.values[e.fieldName] = e.target.value;
      })
    );
  }, []);

  const inputProps:FormElementProps = useMemo(() => ({
    reset: state.reset,
    onValid: validHandler,
    onChange: changeHandler,
    showErrors: state.showErrors,
    disabled,
  }), [state, changeHandler, validHandler, disabled]);

  const disabledInputProps = useMemo(() => ({
    disabled: true,
    reset: state.reset,
    onValid: validHandler,
  }), [validHandler, state]);

  return {
    state,
    inputProps,
    resolveProps: useCallback((name: string) =>
      state.disabled[name] === true ? disabledInputProps : inputProps, [state, disabledInputProps, inputProps]),
    setShowErrors: useCallback((show: boolean) => {
      setState(prev => ({ ...prev, showErrors: show }));
    }, []),
    allValid: (): boolean => !MapTypeSome(state.valid, value => value !== true),
    reset: useCallback(() => {
      setState(prev => ({
        ...createInitialFormState(elements, disFields, initialValues),
        reset: prev.reset + 1,
      }));
    }, [elements, disFields, initialValues]),
    setState,
  };
};

export default useForm;
