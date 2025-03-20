const Tooltip = ({
  content,
  children,
}: {
  content?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative group">
      {children}
      {content && (
        <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#ffffff] text-[#0e0e10] font-bold px-1.5 py-1 rounded-md text-xs shadow-lg z-50 text-center whitespace-nowrap">
          {content}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-4 border-transparent border-t-[#ffffff]" />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
