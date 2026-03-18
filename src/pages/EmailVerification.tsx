
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";

const EmailVerification = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Mail className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="mt-4">Verify Your Email</CardTitle>
              <CardDescription>We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground text-sm">Didn't receive an email? <a href="#" className="text-primary hover:underline">Resend verification link</a></p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
