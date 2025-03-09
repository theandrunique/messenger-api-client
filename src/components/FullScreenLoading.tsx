
const FullScreenLoading = () => {
  return (
    <div className="bg-[#0e0e10] fixed h-screen w-screen flex flex-col items-center justify-center z-50">
      <div className="w-12 h-12 animate-spin rounded-full border-4 border-[#efeff1] border-t-[#374151]"></div>
    </div>
  )
}

export default FullScreenLoading;
