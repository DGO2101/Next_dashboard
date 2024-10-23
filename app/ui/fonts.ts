import {Acme } from 'next/font/google'

export const bizFont = Acme({
    weight: '400',  // Añadimos esta línea
    subsets: ['latin']
})