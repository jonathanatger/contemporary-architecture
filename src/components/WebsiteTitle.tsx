interface MyTitleProps {
  title: string;
  subtitle: string;
  disabled: boolean;
}

export const WebsiteTitle = function ({
  title,
  subtitle,
  disabled,
}: MyTitleProps) {
  return (
    !disabled && (
      <div className="flex flex-col h-32 justify-center items-center">
        <h1 className="text-3xl text-red-600">{title}</h1>
        <h2 className="text-red-600 text-xl px-4 text-center">{subtitle}</h2>
      </div>
    )
  );
};

/* 
export const functionalComponent = ({
  message,
  disabled,
}: {
  message: string;
  disabled: boolean;
}) => {
  return !disabled && <h1 className="text-2xl text-green-300">{message}</h1>;
};
*/