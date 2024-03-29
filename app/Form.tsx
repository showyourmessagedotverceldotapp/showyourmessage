"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubmitBtn from "./submitbtn";
import CreateMessage from "./CreateMessage";
import { useEffect } from "react";

export default function Form() {
    useEffect(() => {
        // Get random hex color
        const randomColor = Math.floor(Math.random()*16777215).toString(16);

        // Set color input to random color
        const colorInput = document.querySelector("#messageColor") as HTMLInputElement;

        if (colorInput) {
            colorInput.value = `#${randomColor}`;
        }

    }, [])
    async function handleMessage(formData: FormData) {
        // check if lastMessageTime in localStorage is more than 10 seconds ago
        const lastMessageTime = localStorage.getItem("lastMessageTime");

        if (lastMessageTime) {
            const timeDiff = Date.now() - parseInt(lastMessageTime);

            if (timeDiff < 10000) {
                toast.error("You can only send one message every 10 seconds");
                return;
            }
        }
        // Reset form
        const form = document.querySelector("form");
        form?.reset();

        const message = formData.get("message");

        if (!message) {
            toast.error("Message cannot be empty");
            return;
        }

        if (message.toString().trim().length > 200) {
            toast.error("Message cannot be longer than 100 characters");
            return;
        }

        // Checek if message contains any letters
        if (!message.toString().match(/[a-z]/i)) {
            toast.error("Message must contain letters");
            return;
        }

        // Check if color is valid
        const messageColor = formData.get("messageColor");

        if (!messageColor) {
            toast.error("Message color cannot be empty");
            return;
        }

        if (!/^#[0-9A-F]{6}$/i.test(messageColor.toString())) {
            toast.error("Message color must be a valid hex color");
            return;
        }

        const res = await CreateMessage(formData);

        if (res?.error) {
            toast.error(res.error);
            return;
        }

        toast.success(res.message);

        localStorage.setItem("lastMessageTime", Date.now().toString());
    }

    return (
        <form action={handleMessage} className="flex flex-col gap-2 p-2">
            <h1 className="text-xl font-bold">Send a message</h1>
            <ToastContainer />
            <textarea
                rows={3}
                name="message"
                id="message"
                required
                className="transition-all duration-75 border-2 border-gray-300 rounded-md shadow-sm outline-none focus:border-blue-300"
            />
            <label htmlFor="messageColor">Pick a color for your message!</label>
            <input
                type="color"
                name="messageColor"
                id="messageColor"
                required
                className="w-full h-10 transition-all duration-75 border-gray-300 border-none rounded-md shadow-sm outline-none focus:border-blue-300"
            />
            <SubmitBtn />
            <p>You will remain fully anonymous to other users</p>
            <p>
                By cliking the 'Send' button you agree to us storing your
                message and a small amount of data.
            </p>
            <p>
                We retract all responsibility for harm caused by messages
                submitted by other users, if you have a problem with any
                message, we suggest taking that up with god.
            </p>
            <p>
                Check out the code: 
                <a className="text-blue-500 hover:underline" href="https://github.com/showyourmessagedotverceldotapp/showyourmessage" target="_blank">Our GitHub Repo</a>
            </p>
        </form>
    );
}
