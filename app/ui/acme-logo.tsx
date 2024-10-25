import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { bizFont } from '@/app/ui/fonts';
import { Acme } from 'next/font/google';

// Inicializar la fuente Acme
const acme = Acme({
  subsets: ['latin'],
  weight: ['400'],
});

export default function AcmeLogo() {
  return (
    <div
      className={`${acme.className} flex flex-row items-center leading-none text-white`}
    >
      <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[44px]">Acme</p>
    </div>
  );
}
