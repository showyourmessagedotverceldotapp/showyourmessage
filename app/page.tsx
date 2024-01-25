import Form from "./Form";
import Messages from "./messsages";

export default async function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <div className="flex w-full h-full md:flex-row flex-col">
                <div className="md:max-w-[10vw] h-fit border-b-2 md:border-r-2 border-gray-500/30 shadow-md md:h-screen">
                    <Form />
                </div>
                <div className="w-full bg-gray-100 min-h-screen">
                  <Messages />
                </div>
            </div>
        </main>
    );
}
