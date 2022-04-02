import React from 'react'

/* Otra boludez, no? pero a los Dummy Components les podes quitar el return statement.
 * Y un detalle: vscode tiene problemas para hacer el import cuando haces export default,
 * asique se suele hacer un export tambien del const.
 * Pero CUIDADO! por que cuando hacer un HOC, o sea, un componente Wrapper que espera otro
 * como parametro (Ex. withRoute(Componente)) o cuando hagas un export default React.memo(Componente).
 * Deberas quizas utilizar una variable intermedia más, o bien, ignorar lo anterior acerca del export.
 */
export const LoadingMask = () => (
  <div
    data-testid="loading-mask"
    style={{ height: 400 }}
    className="flex flex-col items-center justify-center"
  >
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-black text-center"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
);

export default LoadingMask
