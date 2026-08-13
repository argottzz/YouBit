"use client"

import { useState } from "react";

export default function FoodPage() {
    const [foods, setFoods] = useState()

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Kategori</th>
                        <th>Harga</th>
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
            </table>
        </div>
    );
}