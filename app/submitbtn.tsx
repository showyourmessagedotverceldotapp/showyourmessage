"use client"

import { useEffect } from "react";
import { useFormStatus } from "react-dom";

export default function SubmitBtn() {
    const { pending } = useFormStatus();

    useEffect(() => {
        console.clear();
    }, [pending])
    
    return (
        <button type="submit" disabled={pending} className="px-2 py-3 font-bold text-white bg-blue-500 shadow-sm rounded-xl">
            {pending ? "Sending..." : "Send"}
        </button>
    );
}