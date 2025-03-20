import { FileUp } from "lucide-react";

const DropFilesHereMessage = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full text-[#efeff1] p-11">
      <div className="flex flex-col justify-center items-center border-4 border-dashed rounded-xl w-full h-full max-w-[65%] max-h-[75%]">
        <FileUp className="w-12 h-12 " />
        <div className="font-semibold text-2xl">Drop Files Here</div>
      </div>
    </div>
  );
};

export default DropFilesHereMessage;
