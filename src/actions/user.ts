"use server"

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/database"
import { z } from "zod";
import { Session } from "next-auth";

export const getUser = async () => {
    const session = await auth()
    if (!session || !session.user || !session.user.id) return redirect("../")

    const id = session?.user?.id as string
    const user = await prisma.user.findUnique({ where: { id } })
    return user
}


export const updateUser = async (session: Session) => {
    const user = await prisma.user.update({
        where: { id: session.user.id },
        data: { name: session.user.name }
    })

    return user
};