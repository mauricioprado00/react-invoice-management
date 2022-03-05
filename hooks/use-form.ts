import { InputChangeEvent } from "components/ui/forms/InputText";
import produce from "immer";
import { MapType, MapTypeFill, MapTypeSome } from "models/UtilityModels";
import { useCallback, useMemo, useState } from "react";

type FormState = {
  valid: MapType<boolean>;
  values: MapType<string>;
  disabled: MapType<boolean>;
  reset: number;
  showErrors: boolean;
};

const createInitialFormState = (elements: string[], disabledFields: string[]): FormState => {
  const state = {
    valid: MapTypeFill(elements, false),
    values: MapTypeFill(elements, ""),
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
};

const useForm = ({ elements, disabled, disabledFields }: useFormProps) => {
  const disFields = useMemo(() => disabledFields || [], [disabledFields]);
  const [state, setState] = useState(createInitialFormState(elements, disFields));
  const validHandler = useCallback((name: string, valid: boolean) => {
    setState(prev =>
      produce(prev, draft => {
        draft.valid[name] = valid;
      })
    );
  }, []);
  const changeHandler = useCallback((e: InputChangeEvent) => {
    setState(prev =>
      produce(prev, draft => {
        draft.values[e.fieldName] = e.target.value;
      })
    );
  }, []);

  const inputProps = {
    reset: state.reset,
    onValid: validHandler,
    onChange: changeHandler,
    showErrors: state.showErrors,
    disabled,
  };

  const disabledInputProps = {
    disabled: true,
    reset: state.reset,
    onValid: validHandler,
  };

  return {
    state,
    inputProps,
    resolveProps: (name: string) =>
      state.disabled[name] === true ? disabledInputProps : inputProps,
    setShowErrors: (show: boolean) => {
      setState(prev => ({ ...prev, showErrors: show }));
    },
    allValid: (): boolean => !MapTypeSome(state.valid, value => value !== true),
    reset: useCallback(() => {
      setState(prev => ({
        ...createInitialFormState(elements, disFields),
        reset: prev.reset + 1,
      }));
    }, [elements, disFields]),
    setState,
  };
};

export default useForm;
