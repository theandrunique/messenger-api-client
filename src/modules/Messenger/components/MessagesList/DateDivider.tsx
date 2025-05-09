interface DateDividerProps {
  timestamp: string;
}

const getDateString = (timestamp: string): string => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const DateDivider = ({ timestamp: date }: DateDividerProps) => {
  return (
    <div className="flex w-auto items-center justify-center rounded-full sticky top-2 z-10 pointer-events-none">
      <div className="px-3 mb-2 py-1 bg-[#1f1f23]/80 rounded-full text-white text-xs font-semibold shadow-lg">
        {getDateString(date)}
      </div>
    </div>
  );
};

export default DateDivider;
