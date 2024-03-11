'use server';
import { Connection } from "mysql2";
import { RowDataPacket, createConnection, createPool } from "mysql2/promise";
import { getIPAddress } from "./getIP";
import { revalidatePath } from "next/cache";

export default async function CreateMessage(formData: FormData) {
    // Create connection
    const conn = await createPool({ 
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME 
    });

    // Validate input
    const message = formData.get("message");

    if (!message) {
        return {
            error: "Message cannot be empty",
        }
    }

    if (message.toString().trim().length > 100) {
        return {
            error: "Message cannot be longer than 100 characters",
        }
    }

    // Checek if message contains any letters
    if (!message.toString().match(/[a-z]/i)) {
        return {
            error: "Message must contain letters",
        }
    }

    // Check if color is valid
    const messageColor = formData.get("messageColor");

    if (!messageColor) {
        return {
            error: "Message color cannot be empty",
        }
    }

    if (!/^#[0-9A-F]{6}$/i.test(messageColor.toString())) {
        return {
            error: "Message color must be a valid hex color",
        }
    }

    try {
        const ip = await getIPAddress();

        // check lastposts table for last post from ip
        const [rows, fields]: [RowDataPacket[], any] = await conn.query(
            "SELECT * FROM lastposts WHERE ip = ? AND last_post_time > DATE_SUB(NOW(), INTERVAL 10 SECOND)",
            [ip]
        );

        if (rows.length > 0) {
            return {
                error: "You can only send one message every 10 seconds",
            }
        }

        // insert into lastposts
        await conn.query(
            "INSERT INTO lastposts (ip, last_post_time) VALUES (?, NOW())",
            [ip]
        );

        const [insertResult] = await conn.query(
            "INSERT INTO message (msg_text, sender_ip, date_created, color) VALUES (?, ?,  NOW(), ?)",
            [formData.get("message")?.toString().trim(), ip, formData.get("messageColor")?.slice(1)]
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