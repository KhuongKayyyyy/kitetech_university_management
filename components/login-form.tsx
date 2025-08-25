import { useState } from "react";

import { authService } from "@/app/api/services/authService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_LOGO } from "@/constants/AppImage";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [username, setUsername] = useState("52100973");
  const [password, setPassword] = useState("52100973");
  const handleLogin = async () => {
    try {
      const { userInfo } = await authService.login({ username, password });
      router.push(APP_ROUTES.ACCOUNT);
      toast.success("Welcome back " + userInfo.full_name);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="w-full max-w-4xl overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="bg-muted relative hidden md:block">
            <img
              src={APP_LOGO}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
          <form
            className="p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold ">Welcome to</h1>
                <p className=" text-balance text-3xl text-primary font-extrabold">Technology School</p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Account</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="52100973"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Toaster></Toaster>
    </div>
  );
}
