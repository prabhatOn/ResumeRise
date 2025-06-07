"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Sparkles,
  Target,
  BarChart3,
  Clock,
  ArrowRight,
  FileCheck,
  Zap
} from "lucide-react"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  resumeFile: z.instanceof(File, {
    message: "Resume file is required.",
  }),
  jobDescription: z.string().optional(),
})

export default function UploadPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      jobDescription: "",
    },
  })

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const file = files[0]
    
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.doc') || file.name.endsWith('.docx'))) {
      setSelectedFile(file)
      form.setValue('resumeFile', file)
      
      // Auto-generate title from filename
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "")
      if (!form.getValues('title')) {
        form.setValue('title', nameWithoutExtension)
      }
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file",
        variant: "destructive",
      })
    }
  }, [form, toast])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      form.setValue('resumeFile', file)
      
      // Auto-generate title from filename
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "")
      if (!form.getValues('title')) {
        form.setValue('title', nameWithoutExtension)
      }
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    form.setValue('resumeFile', undefined as any)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("title", values.title)
      formData.append("resumeFile", values.resumeFile)

      if (values.jobDescription) {
        formData.append("jobDescription", values.jobDescription)
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + Math.random() * 15
        })
      }, 200)

      const response = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      })

      setUploadProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to upload resume")
      }

      const data = await response.json()

      toast({
        title: "Upload successful",
        description: "Your resume has been uploaded and is being analyzed",
      })

      router.push(`/dashboard/resumes/${data.resumeId}`)
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
          Upload Your Resume
        </h1>
        <p className="text-lg text-muted-foreground">
          Get instant ATS analysis and optimization suggestions
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="glass rounded-2xl p-8 border border-border/50">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* File Upload Area */}
                <div className="space-y-4">
                  <FormLabel className="text-lg font-semibold">Resume File</FormLabel>
                  
                  {!selectedFile ? (
                    <motion.div
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
                        isDragOver
                          ? "border-primary bg-primary/5 scale-105"
                          : "border-border/50 hover:border-primary/50 hover:bg-muted/30"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex flex-col items-center space-y-4">
                        <motion.div
                          className="p-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5"
                          animate={{ 
                            scale: isDragOver ? 1.1 : 1,
                            rotate: isDragOver ? 5 : 0
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Upload className="w-8 h-8 text-primary" />
                        </motion.div>
                        
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {isDragOver ? "Drop your file here" : "Drag & drop your resume"}
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            or <span className="text-primary font-medium">browse files</span>
                          </p>
                          <div className="flex justify-center space-x-2">
                            <Badge variant="secondary">PDF</Badge>
                            <Badge variant="secondary">DOC</Badge>
                            <Badge variant="secondary">DOCX</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-2xl border border-border/50 p-6 bg-muted/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5">
                            <FileCheck className="w-6 h-6 text-green-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{selectedFile.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(selectedFile.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeFile}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Resume Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Resume Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="My Software Engineer Resume" 
                          className="h-12 text-lg rounded-xl"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Job Description */}
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Job Description (Optional)
                        <Badge variant="secondary" className="ml-2">Better Analysis</Badge>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste the job description here for better keyword matching and relevance scoring..."
                          className="min-h-[150px] rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        Including the job description helps us provide more targeted feedback and keyword optimization.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Upload Progress */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Uploading and analyzing...</span>
                        <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold group relative overflow-hidden" 
                  disabled={isLoading || !selectedFile}
                  size="lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 transition-transform group-hover:scale-105" />
                  <div className="relative flex items-center space-x-2">
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                        <span>Analyzing Resume...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>Upload & Analyze</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </div>
                </Button>
              </form>
            </Form>
          </div>
        </motion.div>

        {/* Tips and Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Analysis Features */}
          <div className="glass rounded-2xl p-6 border border-border/50">
            <h3 className="text-xl font-semibold mb-6">What You'll Get</h3>
            <div className="space-y-4">
              {[
                {
                  icon: Target,
                  title: "ATS Score",
                  description: "See how well your resume passes applicant tracking systems"
                },
                {
                  icon: BarChart3,
                  title: "Keyword Analysis",
                  description: "Identify missing keywords and optimization opportunities"
                },
                {
                  icon: FileText,
                  title: "Format Check",
                  description: "Ensure your resume format is ATS-compatible"
                },
                {
                  icon: Sparkles,
                  title: "AI Suggestions",
                  description: "Get personalized recommendations to improve your resume"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upload Tips */}
          <div className="glass rounded-2xl p-6 border border-border/50">
            <h3 className="text-xl font-semibold mb-6">Tips for Best Results</h3>
            <div className="space-y-4">
              {[
                {
                  icon: FileCheck,
                  title: "File Format",
                  description: "Use PDF or DOCX format for accurate text extraction"
                },
                {
                  icon: Target,
                  title: "Clean Layout",
                  description: "Avoid complex tables, images, or unusual fonts"
                },
                {
                  icon: Clock,
                  title: "Recent Experience",
                  description: "Keep your resume updated with recent accomplishments"
                },
                {
                  icon: BarChart3,
                  title: "Quantify Results",
                  description: "Include numbers and metrics wherever possible"
                }
              ].map((tip, index) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/5">
                    <tip.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tip.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
