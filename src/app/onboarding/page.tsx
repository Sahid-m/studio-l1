
'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { AppStateContext } from '@/context/app-state-context';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import { FileText, Video, Blend, ChevronRight, CheckCircle, BrainCircuit, Bell, Mail } from 'lucide-react';
import { therapeuticAreas } from '@/lib/constants';

const OnboardingStep = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 300 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -300 }}
    transition={{ duration: 0.5, ease: 'easeInOut' }}
    className="absolute w-full h-full p-6 flex flex-col"
  >
    {children}
  </motion.div>
);


export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const appContext = useContext(AppStateContext);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleFinish = () => {
    if (appContext) {
      appContext.setHasCompletedOnboarding(true);
    }
    router.replace('/');
  };

  if (!appContext) return null;

  return (
    <div className="h-full w-full bg-background text-foreground flex flex-col">
      <header className="p-4 flex items-center gap-4 border-b">
        <BrainCircuit className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold font-headline">MedLens Setup</h1>
      </header>
      
      <div className="p-4 flex-shrink-0">
        <Progress value={progress} className="h-2" />
      </div>

      <main className="flex-grow relative overflow-hidden">
        <AnimatePresence>
          {step === 1 && (
            <OnboardingStep key="step1">
                <div className='flex flex-col items-center text-center h-full'>
                    <h2 className="text-2xl font-bold font-headline mt-8 mb-4">Welcome, Doctor!</h2>
                    <p className="text-muted-foreground mb-8 max-w-sm">Let's personalize your MedLens experience. First, how do you prefer to consume content?</p>
                    
                    <ToggleGroup 
                        type="single" 
                        defaultValue={appContext.contentPreference}
                        onValueChange={(value) => value && appContext.setContentPreference(value as any)}
                        className="flex-col gap-4 w-full max-w-sm"
                    >
                        <ToggleGroupItem value="article" className="h-20 w-full" variant="outline">
                            <FileText className="mr-4 h-6 w-6" />
                            <div className='text-left'>
                                <p className='font-bold'>Articles</p>
                                <p className='text-xs text-muted-foreground'>In-depth written summaries.</p>
                            </div>
                        </ToggleGroupItem>
                        <ToggleGroupItem value="video" className="h-20 w-full" variant="outline">
                             <Video className="mr-4 h-6 w-6" />
                             <div className='text-left'>
                                <p className='font-bold'>Videos</p>
                                <p className='text-xs text-muted-foreground'>Quick animated explainers.</p>
                            </div>
                        </ToggleGroupItem>
                        <ToggleGroupItem value="both" className="h-20 w-full" variant="outline">
                             <Blend className="mr-4 h-6 w-6" />
                             <div className='text-left'>
                                <p className='font-bold'>Both</p>
                                <p className='text-xs text-muted-foreground'>Show me everything.</p>
                            </div>
                        </ToggleGroupItem>
                    </ToggleGroup>
                    
                    <div className="mt-auto w-full pt-4">
                        <Button onClick={() => setStep(2)} className="w-full" size="lg">
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </OnboardingStep>
          )}

          {step === 2 && (
             <OnboardingStep key="step2">
                 <div className='flex flex-col h-full'>
                    <div className='text-center'>
                        <h2 className="text-2xl font-bold font-headline mt-8 mb-4">Areas of Interest</h2>
                        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Select the therapeutic areas that are most relevant to your practice.</p>
                    </div>

                    <div className='flex-grow overflow-y-auto space-y-4 pr-2'>
                        {therapeuticAreas.map((area) => (
                             <Card 
                                key={area}
                                className='p-0'
                             >
                                <Label className="flex items-center p-4 cursor-pointer">
                                    <Checkbox 
                                        id={area}
                                        checked={appContext.therapeuticInterests.includes(area)}
                                        onCheckedChange={() => appContext.toggleTherapeuticInterest(area)}
                                        className="mr-4 h-5 w-5"
                                    />
                                    <span className='font-medium'>{area}</span>
                                </Label>
                             </Card>
                        ))}
                    </div>

                    <div className="mt-auto flex-shrink-0 pt-4">
                        <Button onClick={() => setStep(3)} className="w-full" size="lg" disabled={appContext.therapeuticInterests.length === 0}>
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                 </div>
            </OnboardingStep>
          )}

          {step === 3 && (
            <OnboardingStep key="step3">
                <div className='flex flex-col items-center text-center h-full'>
                    <h2 className="text-2xl font-bold font-headline mt-8 mb-4">Notification Preferences</h2>
                    <p className="text-muted-foreground mb-8 max-w-sm">How would you like to be notified about new, relevant papers?</p>
                    
                    <div className="space-y-4 w-full max-w-sm">
                        <Card className='p-0'>
                            <Label className="flex items-center p-4 cursor-pointer">
                                <Checkbox id="push" className="mr-4 h-5 w-5" />
                                <Bell className="mr-4 h-6 w-6 text-primary" />
                                <div className='text-left'>
                                    <p className='font-bold'>Push Notifications</p>
                                    <p className='text-xs text-muted-foreground'>Receive alerts on your device.</p>
                                </div>
                            </Label>
                        </Card>
                         <Card className='p-0'>
                            <Label className="flex items-center p-4 cursor-pointer">
                                <Checkbox id="email" className="mr-4 h-5 w-5" />
                                <Mail className="mr-4 h-6 w-6 text-primary" />
                                <div className='text-left'>
                                    <p className='font-bold'>Email Digests</p>
                                    <p className='text-xs text-muted-foreground'>Weekly summaries to your inbox.</p>
                                </div>
                            </Label>
                        </Card>
                    </div>
                    
                    <div className="mt-auto w-full pt-4">
                        <Button onClick={() => setStep(4)} className="w-full" size="lg">
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </OnboardingStep>
          )}

           {step === 4 && (
             <OnboardingStep key="step4">
                <div className='flex flex-col items-center justify-center text-center h-full'>
                    <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
                    <h2 className="text-3xl font-bold font-headline mb-4">All Set!</h2>
                    <p className="text-muted-foreground mb-8 max-w-sm">Your MedLens feed is now tailored to your preferences. You can change these settings later.</p>
                    
                    <div className="mt-auto w-full">
                        <Button onClick={handleFinish} className="w-full" size="lg">
                            Go to My Feed
                        </Button>
                    </div>
                </div>
            </OnboardingStep>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
