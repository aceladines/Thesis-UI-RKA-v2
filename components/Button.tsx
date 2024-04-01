interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style: "circle" | "square";
  color: "info" | "warn" | "danger" | "dark";
  children: React.ReactNode;
  classname?: string;
  type: "button" | "submit" | "reset";
}

export default function Button({
  onClick,
  style,
  color,
  children,
  classname,
  type,
}: Readonly<ButtonProps>) {
  const colorClasses = {
    info: "bg-blue-500 hover:bg-blue-300",
    warn: "bg-orange-500 hover:bg-orange-300",
    danger: "bg-red-500 hover:bg-red-300",
    dark: "bg-black hover:bg-gray-800",
  };

  const colorClass = colorClasses[color];

  const styleClasses = {
    circle: "rounded-full aspect-square",
    square: "rounded-xl",
  };

  const styleClass = styleClasses[style];

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${colorClass} ${styleClass} font-semibold flex-nonetext-white transition duration-300 ease-in-out delay-100 ${classname}`}
    >
      {children}
    </button>
  );
}
