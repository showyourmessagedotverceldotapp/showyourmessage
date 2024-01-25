'use server';
import { Connection } from "mysql2";
import { createConnection } from "mysql2/promise";
import { getIPAddress } from "./getIP";
import { revalidatePath } from "next/cache";

export default async function CreateMessage(formData: FormData) {


    // Create connection
    const conn = await createConnection({ 
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME 
    });

    try {
        conn.connect();
        const ip = await getIPAddress();
        const [rows, fields] = await conn.query(
            "INSERT INTO message (msg_text, sender_ip, date_created, color) VALUES (?, ?,  NOW(), ?)",
            [formData.get("message"), ip, formData.get("messageColor")?.slice(1)]
        );

        revalidatePath('/')


        if (!rows) {
            return {
                error: "Could not create message",
            }
        }

        return {
            message: "Message created",
        }
    }
    catch (err) {
        console.error(err);
        return {
            error: "Could not connect to database",
        }
    }
    finally {
        conn.end();
    }
  }