export default function Label(
  _props: Readonly<{ htmlFor: string; children: React.ReactNode }>
) {
  return (
    <label className="lg:text-lg font-semibold " htmlFor={_props.htmlFor}>
      {_props.children}
    </label>
  );
}
