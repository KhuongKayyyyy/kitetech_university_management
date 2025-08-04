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
      router.push(APP_ROUTES.USER);
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
                <h1 className="text-xl text-gray-500 ">Student portal</h1>
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
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Button variant="outline" type="button" className="w-full flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-primary">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>Google using student mail</span>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <Toaster></Toaster>
    </div>
  );
}
