import { Slide, toast, ToastOptions } from "react-toastify";

const config: ToastOptions = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: true,
  theme: "dark",
  transition: Slide,
};

const notifications = {
  info: (message: string) => toast.info(message, config),
  success: (message: string) => toast.success(message, config),
  error: (message: string) => toast.error(message, config),
};

export default notifications;
