"use client"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { updateUser } from "@/actions/user";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { Session } from "next-auth";

export default function SettingsPage() {
    const { data: session, update } = useSession()
    const user = session?.user

    const updateSettings = async (e: React.FormEvent<HTMLFormElement>) => {
        try {

            e.preventDefault()
            const formData = new FormData(e.target as HTMLFormElement)

            const userUpdateSchema = z.object({
                name: z.string().min(2).max(100).regex(/^[a-zA-ZÀ-ÿ\s-]+$/, "Le nom complet ne doit contenir que des lettres, espaces et traits d'union").optional(),
            });

            const data = userUpdateSchema.parse({
                name: formData.get("userName"),
            });

            const updatedSession = await update({ name: data.name });

            await updateUser(updatedSession as Session);

            toast({
                title: "Succès",
                description: "Votre nom a été mis à jour. Nouvelle session : " + JSON.stringify(updatedSession)
            });

            // const result = await updateUser(data)
            // if ('error' in result) {
            //     return toast({ title: "Error", description: result.error, variant: "destructive" })
            // }

            toast({ title: "Success", description: "Your settings have been updated" })
        } catch (error) {
            console.log(error)
            return toast({ title: "Error", description: "An error occurred while updating your settings", variant: "destructive" })
        }
    }

    return (
        <>
            <section className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
                <h3 className="text-2xl font-bold">Settings</h3>

                <form onSubmit={updateSettings}>
                    <Input type="hidden" name="id" value={user?.id ?? ""} />
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-xl sm:text-2xl">Global Settings</CardTitle>
                            <CardDescription className="text-sm sm:text-base">Modify your information then click save.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 sm:space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center">
                                    <Label htmlFor="userId" className="mb-1 sm:mb-0 sm:w-1/4">ID</Label>
                                    <Input type="text" name="userId" id="userId" defaultValue={user?.id ?? ""} disabled className="sm:w-3/4" />
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center">
                                    <Label htmlFor="userName" className="mb-1 sm:mb-0 sm:w-1/4">Name</Label>
                                    <Input type="text" name="userName" id="userName" defaultValue={user?.name ?? ""} className="sm:w-3/4" />
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center">
                                    <Label htmlFor="userEmail" className="mb-1 sm:mb-0 sm:w-1/4">Email adress</Label>
                                    <Input type="text" name="userEmail" id="userEmail" defaultValue={user?.email ?? ""} disabled className="sm:w-3/4" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button type="submit">Save</Button>
                        </CardFooter>
                    </Card>
                </form>
            </section>
            <section className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 mt-8">
                <Card className="w-full bg-red-50 border-destructive">
                    <CardHeader>
                        <CardTitle className="text-xl sm:text-2xl text-destructive">Delete Account</CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                            Deleting your account will result in the permanent loss of all your associated data and information.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-end">
                        <Button variant="destructive">Delete My Account</Button>
                    </CardFooter>
                </Card>
            </section>
        </>
    )
}