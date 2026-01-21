import { X, Bell } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../app/features/user/userSlice.js';
import { motion, AnimatePresence } from 'framer-motion';

const ToastNotification = () => {
  const dispatch = useDispatch();
  const { notification } = useSelector(state => state.user);

  return (
    <div className="fixed top-16 lg:top-18 right-4 z-100 flex flex-col gap-3 w-full lg:max-w-[320px] max-w-[260px]">
      <AnimatePresence>
        {notification?.map((note) => (
          <motion.div
            key={note._id}
            // Animation States
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            layout // Ensures other notifications slide smoothly when one is removed
            className="pointer-events-auto bg-black/90 border-l-4 border-gray-500 shadow-2xl rounded-xl p-2 lg:p-4 flex gap-3"
          >
            <div className="bg-black/90 p-2 h-fit rounded-full text-white">
              <Bell size={18} />
            </div>
            
            <div className="flex-1">
              <h4 className="text-[10px] font-bold uppercase text-white tracking-wider">
                From: {note.from}
              </h4>
              <p className="text-[10px] lg:text-[12px] text-gray-200 font-semibold mt-0.5">
                {note.message}
              </p>
            </div>

            <button 
              onClick={() => dispatch(removeNotification(note._id))}
              className="text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotification;