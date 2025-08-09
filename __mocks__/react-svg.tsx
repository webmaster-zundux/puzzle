export const ReactSVG = (args: { [key: string]: unknown }) => {
  const { src, className } = args;
  return (
    <div className={className as string} data-src={src}>
      inline-svg-icon-mock
    </div>
  );
};
