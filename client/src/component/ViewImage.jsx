import { IoClose } from "react-icons/io5";

const ViewImage = ({ url, close }) => {
  return (
    <div className="fixed inset-0  bg-neutral-900 bg-opacity-70 flex justify-center items-center z-50">
      <div className="w-92 max-w-4xl p-4 bg-white rounded-md overflow-hidden">
        <button
          onClick={close}
          className="w-fit ml-auto block p-2 text-gray-600 hover:text-gray-900"
        >
          <IoClose size={25} />
        </button>
        <div className="max-h-[80vh] flex justify-center items-center overflow-auto">
          <img
            src={url}
            alt="Full Screen"
            className="w-96 h-96 max-h-[80vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ViewImage;
