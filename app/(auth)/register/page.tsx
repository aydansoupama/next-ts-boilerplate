"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
    const router = useRouter()
    const [data, setData] = useState<{
        name: string,
        email: string,
        password: string,
        confirmPassword: string
    }>({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (data.password !== data.confirmPassword) return toast({ variant: "destructive", title: "Error", description: "The passwords do not match." });

        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data })
        })

        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.errors && Array.isArray(errorData.errors)) {
                errorData.errors.forEach((error: any) => {
                    toast({ variant: "destructive", title: "Validation error", description: error.message });
                });
            } else {
                toast({ variant: "destructive", title: "Error", description: errorData.message || "An error occurred during registration." });
            }
            return;
        }

        toast({ title: "Registration successful", description: "You can now sign in." })
        router.push("/login")
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={registerUser}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                placeholder="Votre nom"
                                value={data.name}
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="email-address">Email address</Label>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="votre@email.com"
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                placeholder="Votre mot de passe"
                                value={data.password}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="confirm-password">Confirm the password</Label>
                            <Input
                                id="confirm-password"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                placeholder="Confirmez votre mot de passe"
                                value={data.confirmPassword}
                                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full">
                        Register
                    </Button>
                </form>
            </div>
        </div>
    )
}