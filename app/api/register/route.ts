import prisma from "@/lib/database";
import { z } from "zod"
import bcrypt from "bcrypt"

const schema = z.object({
    name: z.string().min(2).max(100).regex(/^[a-zA-ZÀ-ÿ\s-]+$/, "Le nom complet ne doit contenir que des lettres, espaces et traits d'union"),
    email: z.string().email("Invalid email address").max(255),
    password: z.string()
        .min(12, "Password must be at least 12 characters long")
        .max(100, "Password must not exceed 100 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).*$/,
            "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character")
})

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = schema.parse(body.data);

        const exist = await prisma.user.findUnique({ where: { email: validatedData.email } });
        if (exist) return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        const user = await prisma.user.create({ 
            data: { 
                name: validatedData.name, 
                email: validatedData.email, 
                hashedPassword 
            } 
        });
        return new Response(JSON.stringify({ message: "User created", user }), { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify({ message: "Invalid data", errors: error.errors }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({ message: "An error occurred during data validation" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}