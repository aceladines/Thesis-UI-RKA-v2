"use client";

interface TextareaProps {
  name: string;
  id: string;
  placeholder: string;
  value: string;
  classname?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function Textarea(_props: Readonly<TextareaProps>) {
  return (
    <pre className="h-full">
      <textarea
        name={_props.name}
        id={_props.id}
        placeholder={_props.placeholder}
        onChange={_props.onChange}
        value={_props.value}
        className={`resize-none focus:outline-none w-full text-justify overflow-x-hidden dark:bg-slate-950 dark:text-gray-400 overflow-auto h-full scrollbar-hide ${_props.classname}`}
        readOnly
      />
    </pre>
  );
}
