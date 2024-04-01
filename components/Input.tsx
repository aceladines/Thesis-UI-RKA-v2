import { forwardRef } from "react";

interface InputProps {
  type: string;
  accept: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, accept, onChange }, ref) => {
    return (
      <input
        type={type}
        accept={accept}
        onChange={onChange}
        className={`w-52 cursor-pointer text-xs text-slate-500 file:mr-2 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-violet-700 hover:file:bg-violet-100`}
        ref={ref}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
