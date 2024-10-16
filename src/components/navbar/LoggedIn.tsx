"use client";

import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { signOut } from "next-auth/react";

export default function LoggedIn() {
    const { data: session, status } = useSession();

    if (status === "loading") return <div>Chargement...</div>;

    if (status === "unauthenticated") {
        return (
            <div className="flex items-center gap-4">
                <Button size="sm" asChild>
                    <Link href="/login">
                        Login
                    </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/register">
                        Register
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={session?.user?.image || undefined} />
                    <AvatarFallback>
                        {session?.user?.name
                            ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                            : 'U'
                        }
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => signOut()}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}