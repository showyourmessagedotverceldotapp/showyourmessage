import { createConnection, RowDataPacket, FieldPacket } from "mysql2";

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
            "SELECT * FROM message ORDER BY date_created DESC"
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
        <div className="flex flex-row flex-wrap">
            {messages.map((message, index) => {
                return (
                    <div key={index} className="flex flex-col bg-white p-2 border-2 min-w-[10vw] h-fit flex-grow" style={{borderColor: `#${message.color}` }}>
                        <p className="text-xl font-bold">{message.msg_text}</p>
                        {/* <p className="text-sm font-bold">{message.date_created.toString()}</p> */}
                        {/* Render as shortened date xx-xx-xxxx */}
                        <p className="text-sm font-bold">{message.date_created.toString().slice(0, 10)}</p>
                        <p>- Anonymous</p>
                    </div>
                )
            })}
        </div>
    ) 
}