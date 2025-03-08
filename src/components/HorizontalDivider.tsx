interface HorizontalDividerProps {
  date: Date;
}

const getDateString = (timestamp: Date): string => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const HorizontalDivider = ({ date }: HorizontalDividerProps) => {
  return (
    <div className="flex w-auto items-center justify-center rounded-full sticky top-0 z-10">
      <div className="px-4 mb-1 opacity-90 p-0.5 bg-[#374151] rounded-full text-white text-sm font-semibold">
        {getDateString(date)}
      </div>
    </div>
  );
};

export default HorizontalDivider;
