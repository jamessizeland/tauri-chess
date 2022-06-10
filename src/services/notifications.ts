import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastConfig: ToastOptions = {
  position: 'bottom-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
};

export const notify = (
  message: string,
  id?: string,
  timeout = 3000,
): string => {
  toastConfig.autoClose = timeout;
  toastConfig.toastId = id ? id : Date.now().toString(16);
  toast.info(message, toastConfig);
  return toastConfig.toastId;
};
