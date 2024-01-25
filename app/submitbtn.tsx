"use client"

import { useFormStatus } from "react-dom";

export default function SubmitBtn() {
    const { pending } = useFormStatus();
    
    return (
        <button type="submit" disabled={pending} className="px-2 py-3 bg-blue-500 shadow-sm rounded-xl text-white font-bold">
            {pending ? "Sending..." : "Send"}
        </button>
    );
}