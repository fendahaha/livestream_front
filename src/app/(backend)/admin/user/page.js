'use client'
import {useState} from "react";

export default function Component() {
    const [n, setN] = useState(0);
    return (
        <div>
            user{n}
            <button onClick={() => {
                setN(n + 1);
            }}>click
            </button>
        </div>
    );
}