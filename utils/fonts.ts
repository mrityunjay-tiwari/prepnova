import { Edu_AU_VIC_WA_NT_Hand, Edu_NSW_ACT_Cursive, Instrument_Serif } from "next/font/google";

export const instrumentSerif = Instrument_Serif({
  variable: "--font-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ['400']
})

export const handwriting_font = Edu_NSW_ACT_Cursive({
    variable: "--font-handwriting",
    subsets: ["latin"],
    style: ["normal"],
    weight: ['400']
})