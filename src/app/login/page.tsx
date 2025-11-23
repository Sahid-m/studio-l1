
'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthContext } from '@/context/auth-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (authContext) {
        // In a real app, you'd get user data from an API
        authContext.login({ email: data.email, name: 'Dr. Smith' });
        toast({
            title: 'Login Successful',
            description: 'Welcome back!',
        });
        router.push('/');
    } else {
         toast({
            variant: 'destructive',
            title: 'Login failed',
            description: 'Authentication service is not available.',
        });
    }

    setIsLoading(false);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 bg-background">
      <div className="max-w-sm w-full">
         <div className="flex flex-col items-center text-center mb-8">
            <BrainCircuit className="h-12 w-12 text-primary" />
            <h1 className="font-headline text-4xl font-bold mt-4">MedLens</h1>
            <p className="text-muted-foreground mt-2">
            AI-powered insights for clinical trials.
            </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back, Doctor</CardTitle>
            <CardDescription>Sign in to access your personalized feed.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@hospital.org" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <p className="px-8 text-center text-sm text-muted-foreground mt-6">
            This is a simulated login. Any email/password will work.
        </p>
      </div>
    </div>
  );
}
