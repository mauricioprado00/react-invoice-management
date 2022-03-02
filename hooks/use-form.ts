import { InputChangeEvent } from "components/ui/forms/InputText";
import produce from "immer";
import { MapType, MapTypeFill, MapTypeSome } from "models/UtilityModels";
import { useCallback, useState } from "react";

type FormState = {
  valid: MapType<boolean>;
  values: MapType<string>;
  reset: number;
  showErrors: boolean;
};

const createInitialFormState = (elements: string[]): FormState => ({
  valid: MapTypeFill(elements, false),
  values: MapTypeFill(elements, ""),
  reset: 0,
  showErrors: false,
});

type useFormProps = {
  elements: string[];
  disabled: boolean;
};

const useForm = ({ elements, disabled }: useFormProps) => {
  const [state, setState] = useState(createInitialFormState(elements));
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

  return {
    state,
    inputProps: {
      reset: state.reset,
      onValid: validHandler,
      onChange: changeHandler,
      showErrors: state.showErrors,
      disabled,
    },
    setShowErrors: (show: boolean) => {
      setState(prev => ({ ...prev, showErrors: show }));
    },
    allValid: (): boolean => !MapTypeSome(state.valid, value => value !== true),
    reset: () => {
      setState(prev => ({
        ...createInitialFormState(elements),
        reset: prev.reset + 1,
      }));
    },
  };
};

export default useForm;
