import Form from "./Form";
import Messages from "./messsages";

export default async function Home() {
    return (
        <main className="flex flex-col items-center justify-between min-h-screen">
            <div className="flex flex-col w-full h-full md:flex-row">
                <div className="md:max-w-[10vw] h-fit border-b-2 md:border-r-2 border-gray-500/30 shadow-md md:h-screen">
                    <Form />
                </div>
                <div className="w-full min-h-screen bg-gray-100">
                  <Messages />
                </div>
            </div>
        </main>
    );
}
