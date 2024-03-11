import { createConnection, RowDataPacket, FieldPacket } from "mysql2";
import { format } from "date-fns";
import Image from "next/image";

interface Message {
    msg_text: string;
    sender_ip: string;
    date_created: string;
    color: string;
}

export default async function Messages() {
    const conn = createConnection({ 
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME 
    });
    let messages: Message[] = [];
    try {
        conn.connect();
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await conn.promise().query(
            "SELECT * FROM message ORDER BY date_created DESC LIMIT 500"
        );
        messages = rows as Message[];
    }
    catch (err) {
        console.error(err);
    }
    finally {
        conn.end();
    }

    return (
        <div className="flex flex-row flex-wrap justify-stretch items-stretch">
            {messages.map((message, index) => {
                return (
                    <Message message={message} index={index} />
                )
            })}
        </div>
    ) 
}

function Message({message, index}: {message: Message, index: number}) {
    const hasURL = (text: string) => {
        return text.match(/https?:\/\/[^\s]+/g);
    }

    const splitUrl = (text: string) => { 
        const startIndex: number = text.indexOf("http");

        const endIndex: number = text.indexOf(" ", startIndex);

        if (endIndex === -1) {
            return text.substring(startIndex);
        }
    }


    return (
        <div key={index} className="flex flex-col bg-white p-2 border-2 min-w-[10vw] max-w-[50%] text-ellipsis overflow-hidden w-fit flex-grow h-[100%]" style={{borderColor: `#${message.color}` }}>
            <p className="text-xl font-bold text-ellipsis">{message.msg_text}</p>
            {hasURL(message.msg_text) && (
                <Image src={splitUrl(message.msg_text)!}
                loading="lazy"
                height={100}
                width={100} alt={message.msg_text}                />
            )}
            {!hasURL(message.msg_text) && (
                <p className="text-sm text-ellipsis h-[100px] w-[100px]">{message.msg_text}</p>
            )}

            <p className="text-sm font-bold">{format(new Date(message.date_created), 'MM-dd-yyyy HH:mm')}</p>
            <p>- Anonymous</p>
        </div>
    )
} 