"use client";

import { useState } from "react";


export default function Halaman() {

    const [theme, setTheme] = useState("gelap");



    return (
        <div className={`${theme == "gelap" ? "bg-black text-white" : "bg-white text-black" } flex flex-col justify-center items-center h-screen`}>
            <button onClick={() => {theme == "gelap" ? setTheme("terang") : setTheme("gelap")}}>
                HAI  
            </button>
        </div>
    )
}