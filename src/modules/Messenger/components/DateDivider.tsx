interface DateDividerProps {
  date: Date;
}

const getDateString = (timestamp: Date): string => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const DateDivider = ({ date }: DateDividerProps) => {
  return (
    <div className="flex w-auto items-center justify-center rounded-full sticky top-0 z-10">
      <div className="px-4 mb-1 py-0.5 bg-[#374151]/70 rounded-full text-white text-sm font-semibold">
        {getDateString(date)}
      </div>
    </div>
  );
};

export default DateDivider;
