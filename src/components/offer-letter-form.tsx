'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { useOfferLetterStore } from '@/store/useOfferLetterStore';
import { useToast } from '@/hooks/use-toast';

interface FormValues {
  candidateName: string;
  position: string;
  startDate: string;
  salary: string;
  companyName: string;
  location: string;
}

const validationSchema = Yup.object({
  candidateName: Yup.string().required('Required'),
  position: Yup.string().required('Required'),
  startDate: Yup.date().required('Required'),
  salary: Yup.number().required('Required').positive('Must be a positive number'),
  companyName: Yup.string().required('Required'),
  location: Yup.string().required('Required'),
});

const formFields = [
  { id: 'candidateName' as keyof FormValues, label: 'Candidate Name', type: 'text' },
  { id: 'position' as keyof FormValues, label: 'Position', type: 'text' },
  { id: 'startDate' as keyof FormValues, label: 'Start Date', type: 'date' },
  { id: 'salary' as keyof FormValues, label: 'Annual Salary', type: 'number' },
  { id: 'companyName' as keyof FormValues, label: 'Company Name', type: 'text' },
  { id: 'location' as keyof FormValues, label: 'Location', type: 'text' },
] as const;

export function OfferLetterForm() {
  const { toast } = useToast();
  const { setOfferLetterData, offerLetterData, isGenerating, setIsGenerating, resetStore } =
    useOfferLetterStore();

  const formik = useFormik<FormValues>({
    initialValues: {
      candidateName: '',
      position: '',
      startDate: '',
      salary: '',
      companyName: '',
      location: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsGenerating(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setOfferLetterData(values);
        toast({
          variant: 'default',
          title: 'Success',
          description: 'Offer letter generated successfully!',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to generate offer letter',
        });
      } finally {
        setIsGenerating(false);
      }
    },
  });

  return (
    <Card className="h-fit md:sticky md:top-8">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Offer Letter Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {formFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type={field.type}
                {...formik.getFieldProps(field.id)}
                className={
                  formik.touched[field.id] && formik.errors[field.id] ? 'border-red-500' : ''
                }
              />
              {formik.touched[field.id] && formik.errors[field.id] && (
                <p className="text-sm text-red-500">{formik.errors[field.id]}</p>
              )}
            </div>
          ))}

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={isGenerating}>
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Offer Letter
            </Button>

            {offerLetterData && (
              <Button type="button" variant="outline" onClick={resetStore} disabled={isGenerating}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
