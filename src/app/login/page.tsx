
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

const signUpSchema = z.object({
  name: z.string().min(2, { message: 'Please enter a name.' }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const { toast } = useToast();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (authContext) {
        authContext.login({ name: data.name });
        toast({
            title: 'Account Created!',
            description: `Welcome to MedLens, ${data.name}!`,
        });
        router.push('/onboarding');
    } else {
         toast({
            variant: 'destructive',
            title: 'Sign-up failed',
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
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>Join the future of clinical trial analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Creating Account...' : 'Sign Up & Continue'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
         <p className="px-8 text-center text-sm text-muted-foreground mt-6">
            By signing up, you begin your personalized journey with MedLens.
        </p>
      </div>
    </div>
  );
}
