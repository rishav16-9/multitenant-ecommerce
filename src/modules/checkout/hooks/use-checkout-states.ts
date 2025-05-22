import { parseAsBoolean, useQueryStates } from "nuqs";

export const useCheckoutStates = () => {
  const [state, setState] = useQueryStates({
    success: parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
    }),
    cancel: parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
    }),
  });

  return { state, setState };
};
