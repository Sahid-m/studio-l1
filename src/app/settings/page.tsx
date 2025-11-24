
'use client';

import { useContext } from 'react';
import { AppStateContext } from '@/context/app-state-context';
import { AuthContext } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { FileText, Video, Blend, Bell, Mail, LogOut, Settings as SettingsIcon, ListTodo } from 'lucide-react';
import { therapeuticAreas } from '@/lib/constants';

export default function SettingsPage() {
  const appContext = useContext(AppStateContext);
  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!appContext || !authContext) {
    return null; // Or a loading spinner
  }

  const {
    contentPreference,
    setContentPreference,
    therapeuticInterests,
    toggleTherapeuticInterest,
  } = appContext;

  const { user, logout } = authContext;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <SettingsIcon className="h-10 w-10 text-primary" />
        <div>
            <h1 className="font-headline text-4xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your preferences for MedLens.</p>
        </div>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Content Preferences</CardTitle>
            <CardDescription>Choose the type of content you want to see in your feed.</CardDescription>
          </CardHeader>
          <CardContent>
            <ToggleGroup
              type="single"
              defaultValue={contentPreference}
              onValueChange={(value) => value && setContentPreference(value as any)}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              aria-label="Content preference"
            >
              <ToggleGroupItem value="article" aria-label="Articles only">
                <FileText className="mr-2 h-5 w-5" />
                Articles
              </ToggleGroupItem>
              <ToggleGroupItem value="video" aria-label="Videos only">
                <Video className="mr-2 h-5 w-5" />
                Videos
              </ToggleGroupItem>
              <ToggleGroupItem value="both" aria-label="Both articles and videos">
                <Blend className="mr-2 h-5 w-5" />
                Both
              </ToggleGroupItem>
            </ToggleGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Therapeutic Areas of Interest</CardTitle>
            <CardDescription>Select the areas most relevant to your practice. This tailors your feed.</CardDescription>
          </CardHeader>
          <CardContent>
            <div role="group" aria-label="Therapeutic Areas of Interest" className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {therapeuticAreas.map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={`interest-${area}`}
                    checked={therapeuticInterests.includes(area)}
                    onCheckedChange={() => toggleTherapeuticInterest(area)}
                    aria-labelledby={`label-interest-${area}`}
                  />
                  <Label htmlFor={`interest-${area}`} id={`label-interest-${area}`} className="cursor-pointer">
                    {area}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how you want to be notified about new, relevant papers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center space-x-3">
                <Checkbox id="push-notifications" aria-labelledby="label-push-notifications" />
                <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="push-notifications" id="label-push-notifications" className="font-medium cursor-pointer">
                        Push Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">
                        Receive alerts on your device for breaking news.
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <Checkbox id="email-digest" aria-labelledby="label-email-digest" />
                <div className="grid gap-1.5 leading-none">
                     <Label htmlFor="email-digest" id="label-email-digest" className="font-medium cursor-pointer">
                        Email Digests
                    </Label>
                    <p className="text-xs text-muted-foreground">
                        Get a weekly summary of top papers in your inbox.
                    </p>
                </div>
            </div>
          </CardContent>
        </Card>

        <Separator />
        
        <Card>
            <CardHeader>
                <CardTitle>Admin</CardTitle>
                <CardDescription>Manage application content and settings.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Link href="/dashboard" passHref>
                    <Button variant="outline" className="w-full sm:w-auto">
                        <ListTodo className="mr-2 h-4 w-4" />
                        Go to Dashboard
                    </Button>
                </Link>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Manage your account settings.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5 mb-4 sm:mb-0">
                        <p className="font-medium">
                            {user?.name || 'MedLens User'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            You are currently signed in.
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleLogout} aria-label="Log out of your account">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                    </Button>
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}