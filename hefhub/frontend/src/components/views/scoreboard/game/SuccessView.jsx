import { motion } from 'framer-motion';

export default function SuccessView({ votedOption }) {
  return (
    <motion.div 
      key="success" 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }} 
      className="flex h-full flex-1 flex-col items-center justify-center p-8 text-center"
    >
      <div className="mt-12">
        <h1 className="mb-2 bg-linear-to-r from-orange-500 to-yellow-400 bg-clip-text text-4xl font-black text-transparent drop-shadow-sm md:text-5xl">
          ISSO AÍ!
        </h1>
        <p className="text-lg font-medium text-gray-400">
          As portas do labirinto se abrirão.
        </p>
      </div>
      
      <div className="mx-auto mb-10 w-full max-w-xs mt-auto">
        <p className="mb-2 text-sm uppercase tracking-wide text-white/60">
          Você escolheu:
        </p>
        <p className="mb-6 truncate px-4 text-2xl font-bold text-orange-400 drop-shadow-md">
          "{votedOption}"
        </p>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div 
            initial={{ width: '100%' }} 
            animate={{ width: '0%' }} 
            transition={{ duration: 5, ease: "linear" }} 
            className="h-full origin-left bg-linear-to-r from-orange-500 to-yellow-500" 
          />
        </div>
        <p className="mt-6 text-xl font-bold italic text-white/90">
          Você está no controle. Boa diversão!
        </p>
      </div>
    </motion.div>
  );
}