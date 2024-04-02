type LabelProps = {
  htmlFor: string;
  styles?: string;
  children: React.ReactNode;
};

export default function Label(_props: Readonly<LabelProps>) {
  return (
    <label
      className={`font-semibold ${_props.styles}`}
      htmlFor={_props.htmlFor}
    >
      {_props.children}
    </label>
  );
}
