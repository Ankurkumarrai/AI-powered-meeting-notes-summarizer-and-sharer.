import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";

const MeetingSummarizer = () => {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("Summarize in bullet points for executives");
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const { toast } = useToast();

  const generateSummary = async () => {
    if (!transcript.trim()) {
      toast({
        title: "Error",
        description: "Please enter a transcript to summarize",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/functions/v1/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: transcript.trim(),
          prompt: prompt.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);
      toast({
        title: "Success",
        description: "Summary generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const sendEmail = async () => {
    if (!summary.trim()) {
      toast({
        title: "Error",
        description: "Please generate a summary first",
        variant: "destructive",
      });
      return;
    }

    if (!recipientEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter recipient email address",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/functions/v1/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: recipientEmail.trim(),
          summary: summary.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      toast({
        title: "Success",
        description: "Summary sent successfully",
      });
      setRecipientEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Meeting Notes Summarizer
        </h1>
        <p className="text-muted-foreground">
          Upload transcripts, customize instructions, and share AI-generated summaries
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="transcript">Meeting Transcript</Label>
              <Textarea
                id="transcript"
                placeholder="Paste your meeting transcript here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="min-h-[200px] mt-2"
              />
            </div>

            <div>
              <Label htmlFor="prompt">Custom Instructions</Label>
              <Input
                id="prompt"
                placeholder="e.g., Summarize in bullet points for executives"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-2"
              />
            </div>

            <Button 
              onClick={generateSummary} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Summary"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="summary">Summary (Editable)</Label>
              <Textarea
                id="summary"
                placeholder="Generated summary will appear here..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="min-h-[200px] mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email">Recipient Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address to share summary"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="mt-2"
              />
            </div>

            <Button 
              onClick={sendEmail} 
              disabled={isSending || !summary}
              className="w-full"
              variant="secondary"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Summary
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MeetingSummarizer;