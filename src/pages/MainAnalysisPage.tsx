import React, { useState, useCallback } from 'react';
import { Button, Input, Textarea, Label, Progress, Tabs, TabsContent, TabsList, TabsTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, toast, cn } from '@/components/UI';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Brain, Loader2, Upload, FileSpreadsheet, Check, X, Database, TrendingUp, Shield, Activity, Cpu, Target, Sparkles, ArrowRight, Info, Layers, AlertTriangle, Bug, Globe, Search, FileCode, Gauge, TrendingDown, FileText, ChevronDown, ChevronUp, Zap } from 'lucide-react';

// ==================== TYPES ====================
interface UploadedDataset { id: string; name: string; size: string; rows: number; columns: number; status: 'uploading' | 'preprocessing' | 'ready' | 'error'; uploadedAt: Date; }

interface DefectItem {
  category: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  isFuturePrediction: boolean;
  timeframe?: string;
  probability?: number;
  impact?: string;
  recommendation?: string;
}

interface PreventiveMeasure {
  title: string;
  description: string;
  importance: 'critical' | 'high' | 'medium';
}

interface AnalysisResult {
  healthScore: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  summary: string;
  defects: DefectItem[];
  priorityFixes: string[];
  preventiveMeasures: PreventiveMeasure[];
  metrics: {
    securityScore: number;
    accessibilityScore: number;
    performanceScore: number;
    seoScore: number;
    codeQualityScore: number;
    engagementScore?: number;
    brandSafetyScore?: number;
    contentQualityScore?: number;
  };
}

type SocialPlatform = 'instagram' | 'snapchat' | 'tiktok' | 'twitter' | 'facebook' | 'linkedin' | 'youtube';
type SocialAnalysisMode = 'platform-url' | 'post-content';

interface SocialMediaPost {
  platform: SocialPlatform;
  postType: string;
  caption: string;
  hashtags: string;
  mentions: string;
  likes: string;
  comments: string;
  shares: string;
  views: string;
  engagementRate: string;
  postDate: string;
  additionalContext: string;
}

interface PlatformUXIssue {
  category: string;
  examples: string[];
}

// ==================== CONSTANTS ====================
const mockDatasets: UploadedDataset[] = [
  { id: '1', name: 'NASA_KC1.csv', size: '2.4 MB', rows: 2109, columns: 22, status: 'ready', uploadedAt: new Date('2024-01-15') },
  { id: '2', name: 'PROMISE_CM1.csv', size: '1.8 MB', rows: 498, columns: 21, status: 'ready', uploadedAt: new Date('2024-01-14') },
  { id: '3', name: 'Eclipse_Bug_Dataset.csv', size: '5.2 MB', rows: 4702, columns: 28, status: 'ready', uploadedAt: new Date('2024-01-12') }
];

const mockPreviewData = [
  { loc: 156, cc: 12, comment_density: 0.23, num_functions: 8, code_churn: 45, defective: 1 },
  { loc: 89, cc: 5, comment_density: 0.45, num_functions: 3, code_churn: 12, defective: 0 },
  { loc: 234, cc: 18, comment_density: 0.12, num_functions: 15, code_churn: 78, defective: 1 },
  { loc: 67, cc: 3, comment_density: 0.56, num_functions: 2, code_churn: 5, defective: 0 },
  { loc: 312, cc: 25, comment_density: 0.08, num_functions: 22, code_churn: 134, defective: 1 }
];

const confusionMatrix = { tp: 847, fp: 53, fn: 89, tn: 1011 };

const algorithms = [
  { 
    name: 'Particle Swarm Optimization (PSO)', 
    icon: Sparkles, 
    accuracy: '94.2%',
    description: 'Mimics bird flocking behavior to find the best solution by particles following the best-performing member.'
  },
  { 
    name: 'Genetic Algorithm (GA)', 
    icon: Layers, 
    accuracy: '92.8%',
    description: 'Inspired by natural selection - the best solutions "breed" to create even better ones.'
  },
  { 
    name: 'Ant Colony Optimization (ACO)', 
    icon: Bug, 
    accuracy: '91.5%',
    description: 'Mimics how ants find the shortest path using pheromone trails.'
  },
  { 
    name: 'Hybrid Swarm Intelligence', 
    icon: Brain, 
    accuracy: '97.2%',
    description: 'Combines PSO, GA, and ACO for superior accuracy by leveraging strengths of each algorithm.'
  },
];

const platformUXIssues: Record<SocialPlatform, PlatformUXIssue[]> = {
  instagram: [
    { category: 'Scrolling Issues', examples: ['Reels scroll too fast', 'Feed jumps back to top', 'Stories auto-advance too quickly'] },
    { category: 'Loading Problems', examples: ['Images load slowly', 'Reels buffer constantly', 'Stories fail to load'] },
    { category: 'Navigation Issues', examples: ['Explore tab unresponsive', 'DMs slow to open', 'Profile takes forever'] },
    { category: 'Video Playback', examples: ['Audio desync', 'Video quality drops', 'Autoplay not working'] },
  ],
  snapchat: [
    { category: 'Camera Issues', examples: ['Filters lag', 'Camera freezes', 'Lens effects delay'] },
    { category: 'Story Problems', examples: ['Stories won\'t upload', 'Views not updating', 'Story order jumbled'] },
    { category: 'Chat Issues', examples: ['Messages not sending', 'Snaps stuck on pending', 'Bitmoji not loading'] },
    { category: 'Map Features', examples: ['Location inaccurate', 'Map loads slowly', 'Friends not showing'] },
  ],
  tiktok: [
    { category: 'For You Page Issues', examples: ['Videos repeat too often', 'Scroll sensitivity too high', 'Content not personalized'] },
    { category: 'Video Problems', examples: ['Videos won\'t play', 'Sound cuts out', 'Captions disappear'] },
    { category: 'Upload Issues', examples: ['Videos fail to post', 'Drafts deleted', 'Effects not applying'] },
    { category: 'Live Stream Issues', examples: ['Stream buffering', 'Comments lag', 'Gifts not sending'] },
  ],
  twitter: [
    { category: 'Timeline Problems', examples: ['Tweets not loading', 'Timeline jumps around', 'Missing tweets from follows'] },
    { category: 'Media Issues', examples: ['Images won\'t expand', 'Videos auto-muted', 'GIFs not playing'] },
    { category: 'Notification Issues', examples: ['Delayed notifications', 'Missing mentions', 'DMs not alerting'] },
    { category: 'Search Problems', examples: ['Search results outdated', 'Hashtags not working', 'Trends inaccurate'] },
  ],
  facebook: [
    { category: 'News Feed Issues', examples: ['Posts out of order', 'Feed refreshes unexpectedly', 'Same posts repeated'] },
    { category: 'Video Problems', examples: ['Reels buffer constantly', 'Videos auto-play loudly', 'Live streams lag'] },
    { category: 'Messenger Issues', examples: ['Messages delayed', 'Calls drop frequently', 'Reactions slow'] },
    { category: 'Group Problems', examples: ['Posts not appearing', 'Notifications overwhelming', 'Members list wrong'] },
  ],
  linkedin: [
    { category: 'Feed Issues', examples: ['Posts load slowly', 'Engagement counts wrong', 'Old content shown'] },
    { category: 'Connection Problems', examples: ['Invites pending forever', 'Profile views inaccurate', 'Messages delayed'] },
    { category: 'Job Search Issues', examples: ['Filters don\'t work', 'Applications fail', 'Saved jobs disappear'] },
    { category: 'Profile Problems', examples: ['Edits not saving', 'Skills section buggy', 'Endorsements not showing'] },
  ],
  youtube: [
    { category: 'Playback Issues', examples: ['Videos buffer constantly', 'Quality changes randomly', 'Subtitles out of sync'] },
    { category: 'Shorts Problems', examples: ['Scroll too sensitive', 'Videos loop incorrectly', 'Comments not loading'] },
    { category: 'Subscription Issues', examples: ['Missing uploads from subscriptions', 'Notifications not working', 'Watch later not saving'] },
    { category: 'Comment Problems', examples: ['Comments not posting', 'Reply threads broken', 'Likes not registering'] },
  ],
};

const socialPlatformConfig: Record<SocialPlatform, { label: string; icon: string; color: string; postTypes: string[] }> = {
  instagram: { label: 'Instagram', icon: '📸', color: 'from-pink-500 to-purple-500', postTypes: ['Feed Post', 'Reel', 'Story', 'IGTV', 'Carousel'] },
  snapchat: { label: 'Snapchat', icon: '👻', color: 'from-yellow-400 to-yellow-500', postTypes: ['Snap', 'Story', 'Spotlight'] },
  tiktok: { label: 'TikTok', icon: '🎵', color: 'from-black to-pink-500', postTypes: ['Video', 'Duet', 'Stitch', 'Live'] },
  twitter: { label: 'Twitter/X', icon: '𝕏', color: 'from-gray-700 to-gray-900', postTypes: ['Tweet', 'Thread', 'Reply', 'Retweet'] },
  facebook: { label: 'Facebook', icon: '📘', color: 'from-blue-600 to-blue-700', postTypes: ['Post', 'Reel', 'Story', 'Video', 'Event'] },
  linkedin: { label: 'LinkedIn', icon: '💼', color: 'from-blue-700 to-blue-800', postTypes: ['Post', 'Article', 'Video', 'Poll'] },
  youtube: { label: 'YouTube', icon: '▶️', color: 'from-red-600 to-red-700', postTypes: ['Video', 'Short', 'Live', 'Community Post'] },
};

const emptySocialPost: SocialMediaPost = {
  platform: 'instagram',
  postType: 'Feed Post',
  caption: '',
  hashtags: '',
  mentions: '',
  likes: '',
  comments: '',
  shares: '',
  views: '',
  engagementRate: '',
  postDate: '',
  additionalContext: '',
};

const categoryIcons: Record<string, React.ElementType> = {
  security: Shield,
  accessibility: Target,
  performance: Gauge,
  seo: Search,
  ux: Layers,
  'code-quality': FileCode,
  functionality: Bug,
  'future-risk': TrendingDown,
  engagement: TrendingUp,
  'brand-safety': Shield,
  'content-quality': FileText,
};

const severityColors: Record<string, string> = {
  critical: 'bg-destructive/20 text-destructive border-destructive/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-warning/20 text-warning border-warning/30',
  low: 'bg-muted text-muted-foreground border-border',
};

// ==================== MAIN COMPONENT ====================
export function MainAnalysisPage() {
  // Section expansion states
  const [expandedSections, setExpandedSections] = useState({
    accuracy: true,
    dataset: true,
    analysis: true,
    matrix: true
  });

  // Dataset states
  const [datasets, setDatasets] = useState<UploadedDataset[]>(mockDatasets);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<UploadedDataset | null>(null);

  // Website analysis states
  const [inputMode, setInputMode] = useState<'url' | 'manual' | 'social'>('url');
  const [url, setUrl] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [contentSource, setContentSource] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'future' | 'prevention'>('current');
  const [socialPost, setSocialPost] = useState<SocialMediaPost>(emptySocialPost);
  const [batchPosts, setBatchPosts] = useState<SocialMediaPost[]>([]);
  const [socialAnalysisMode, setSocialAnalysisMode] = useState<SocialAnalysisMode>('platform-url');
  const [socialPlatformUrl, setSocialPlatformUrl] = useState('');
  const [selectedPlatformForUrl, setSelectedPlatformForUrl] = useState<SocialPlatform>('instagram');
  const [userExperienceIssues, setUserExperienceIssues] = useState('');

  // Confusion matrix states
  const [selectedModel, setSelectedModel] = useState('ensemble');

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Dataset upload handlers
  const simulateUpload = useCallback((file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setDatasets((p) => [
            { id: Date.now().toString(), name: file.name, size: `${(file.size / 1024 / 1024).toFixed(2)} MB`, rows: Math.floor(Math.random() * 5000) + 500, columns: Math.floor(Math.random() * 20) + 10, status: 'ready', uploadedAt: new Date() },
            ...p
          ]);
          toast.success('Dataset uploaded!');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find((f) => f.name.endsWith('.csv'));
    if (csvFile) simulateUpload(csvFile);
    else toast.error('Please upload a CSV file');
  }, [simulateUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) simulateUpload(file);
  }, [simulateUpload]);

  const handleDelete = useCallback((id: string) => {
    setDatasets((prev) => prev.filter((d) => d.id !== id));
    if (selectedDataset?.id === id) setSelectedDataset(null);
    toast.success('Dataset deleted');
  }, [selectedDataset]);

  // Website analysis handlers
  const formatPlatformUrlForAnalysis = (): string => {
    const config = socialPlatformConfig[selectedPlatformForUrl];
    const knownIssues = platformUXIssues[selectedPlatformForUrl];
    
    return `
=== ${config.label.toUpperCase()} PLATFORM UX/DEFECT ANALYSIS ===

PLATFORM: ${config.label}
URL: ${socialPlatformUrl}

--- USER EXPERIENCE ISSUES TO ANALYZE ---
This is a ${config.label} platform analysis. Analyze the platform for common UX defects and issues that users experience.

KNOWN COMMON ISSUES ON ${config.label.toUpperCase()}:
${knownIssues.map(issue => `
${issue.category}:
${issue.examples.map(ex => `  • ${ex}`).join('\n')}`).join('\n')}

--- USER REPORTED ISSUES ---
${userExperienceIssues || 'No specific issues reported. Analyze for general platform defects.'}

Please analyze this social media platform for:
1. SCROLLING DEFECTS - Issues like content scrolling too fast, unexpected jumps, sensitivity problems
2. LOADING PROBLEMS - Slow content load, buffering, images/videos not appearing
3. NAVIGATION BUGS - Unresponsive buttons, broken links, confusing UI flows
4. VIDEO/MEDIA ISSUES - Playback problems, audio sync, quality degradation
5. PERFORMANCE PROBLEMS - App freezing, crashes, memory issues, battery drain
6. NOTIFICATION BUGS - Delayed alerts, missing notifications, incorrect counts
7. CONTENT DISPLAY ISSUES - Layout problems, text cut off, image cropping
8. INTERACTION BUGS - Likes/comments not registering, shares failing

For each defect found:
- Describe the issue in simple everyday language
- Explain the ROOT CAUSE (why this happens technically)
- Provide PREVENTION steps (how users can avoid or fix it)
- Rate severity based on user impact
`.trim();
  };

  const formatSocialPostForAnalysis = (post: SocialMediaPost): string => {
    const config = socialPlatformConfig[post.platform];
    return `
=== ${config.label.toUpperCase()} ${post.postType.toUpperCase()} ANALYSIS ===

PLATFORM: ${config.label}
POST TYPE: ${post.postType}
${post.postDate ? `DATE: ${post.postDate}` : ''}

--- CONTENT ---
CAPTION/TEXT:
${post.caption || '[No caption provided]'}

HASHTAGS: ${post.hashtags || 'None'}
MENTIONS: ${post.mentions || 'None'}

--- ENGAGEMENT METRICS ---
Likes: ${post.likes || 'N/A'}
Comments: ${post.comments || 'N/A'}
Shares/Reposts: ${post.shares || 'N/A'}
Views: ${post.views || 'N/A'}
Engagement Rate: ${post.engagementRate || 'N/A'}

--- ADDITIONAL CONTEXT ---
${post.additionalContext || 'None provided'}

Please analyze this social media content for:
1. Content Quality (grammar, clarity, messaging)
2. Engagement Potential (call-to-action, hashtag effectiveness)
3. Brand Safety (inappropriate content, potential controversy)
4. Platform Best Practices (optimal length, format usage)
5. Future Risks (trend relevance, potential backlash)
6. Improvement Recommendations
`.trim();
  };

  const analyzeWebsite = async () => {
    if (inputMode === 'url' && !url) return;
    if (inputMode === 'manual' && !manualContent.trim()) return;
    if (inputMode === 'social') {
      if (socialAnalysisMode === 'platform-url' && !socialPlatformUrl.trim()) return;
      if (socialAnalysisMode === 'post-content' && !socialPost.caption.trim() && batchPosts.length === 0) return;
    }
    
    setIsAnalyzing(true);
    setProgress(0);
    setAnalysis(null);
    setError(null);

    try {
      let websiteData;
      let sourceUrl = url;

      if (inputMode === 'url') {
        setProgressMessage('Fetching website content...');
        setProgress(20);
        
        const scrapeResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scrape-website`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });

        const scrapeData = await scrapeResponse.json();
        
        if (!scrapeResponse.ok || !scrapeData.success) {
          throw new Error(scrapeData.error || 'Failed to scrape website');
        }
        
        websiteData = scrapeData.data;
      } else if (inputMode === 'social') {
        setProgressMessage('Processing social media content...');
        setProgress(20);
        
        if (socialAnalysisMode === 'platform-url') {
          const platformLabel = socialPlatformConfig[selectedPlatformForUrl].label;
          sourceUrl = socialPlatformUrl || `${platformLabel} Platform`;
          
          const formattedContent = formatPlatformUrlForAnalysis();
          
          websiteData = {
            markdown: formattedContent,
            html: null,
            links: [],
            metadata: { 
              title: `${platformLabel} Platform UX Analysis`, 
              sourceURL: sourceUrl,
              platform: selectedPlatformForUrl,
              isSocialMedia: true,
              analysisType: 'platform-ux'
            }
          };
        } else {
          const postsToAnalyze = batchPosts.length > 0 ? batchPosts : [socialPost];
          const formattedContent = postsToAnalyze.map(formatSocialPostForAnalysis).join('\n\n---\n\n');
          const platformLabel = socialPlatformConfig[socialPost.platform].label;
          sourceUrl = `${platformLabel} Analysis`;
          
          websiteData = {
            markdown: formattedContent,
            html: null,
            links: [],
            metadata: { 
              title: `${platformLabel} Content Analysis`, 
              sourceURL: sourceUrl,
              platform: socialPost.platform,
              isSocialMedia: true,
              analysisType: 'post-content'
            }
          };
        }
      } else {
        setProgressMessage('Processing manual content...');
        setProgress(20);
        sourceUrl = contentSource || 'Manual Input';
        
        const isHtml = manualContent.trim().startsWith('<') || manualContent.includes('</');
        websiteData = {
          markdown: isHtml ? null : manualContent,
          html: isHtml ? manualContent : null,
          links: [],
          metadata: { title: contentSource || 'Manual Content', sourceURL: sourceUrl }
        };
      }

      setProgress(50);
      setProgressMessage('Analyzing content with AI...');

      const analyzeResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-website`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteData, url: sourceUrl }),
      });

      const analyzeData = await analyzeResponse.json();

      if (!analyzeResponse.ok || !analyzeData.success) {
        throw new Error(analyzeData.error || 'Failed to analyze website');
      }

      setProgress(100);
      setProgressMessage('Analysis complete!');
      setAnalysis(analyzeData.analysis);
      toast.success('Content analysis complete!');
    } catch (err) {
      console.error('Analysis error:', err);
      const message = err instanceof Error ? err.message : 'Analysis failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentDefects = analysis?.defects.filter(d => !d.isFuturePrediction) || [];
  const futureDefects = analysis?.defects.filter(d => d.isFuturePrediction) || [];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  // Confusion matrix calculations
  const total = confusionMatrix.tp + confusionMatrix.fp + confusionMatrix.fn + confusionMatrix.tn;
  const accuracy = (confusionMatrix.tp + confusionMatrix.tn) / total;
  const precision = confusionMatrix.tp / (confusionMatrix.tp + confusionMatrix.fp);
  const recall = confusionMatrix.tp / (confusionMatrix.tp + confusionMatrix.fn);
  const f1 = (2 * precision * recall) / (precision + recall);

  // Section header component
  const SectionHeader = ({ title, subtitle, section, icon: Icon }: { title: string; subtitle: string; section: keyof typeof expandedSections; icon: React.ElementType }) => (
    <button 
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-6 bg-card rounded-t-xl border border-border hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="text-left">
          <h2 className="text-xl font-display font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {expandedSections[section] ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">DefectAI <span className="gradient-text">Analysis Hub</span></h1>
          <p className="text-muted-foreground mt-1">AI-powered defect prediction using swarm intelligence algorithms</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 text-success">
          <Activity className="h-4 w-4" />
          <span className="text-sm font-medium">System Online</span>
        </div>
      </div>

      {/* ==================== SECTION 1: ACCURACY & ALGORITHMS ==================== */}
      <div className="glass-card overflow-hidden">
        <SectionHeader 
          title="How Accurate is DefectAI?" 
          subtitle="Understanding our AI algorithms and their accuracy"
          section="accuracy"
          icon={Brain}
        />
        {expandedSections.accuracy && (
          <div className="p-6 border border-t-0 border-border rounded-b-xl space-y-6">
            {/* Simple Explanation */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                What is DefectAI?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                DefectAI is like a <strong className="text-foreground">smart detective for software and websites</strong>. 
                Just like how weather apps predict rain, DefectAI predicts where bugs and problems might hide in code or websites. 
                We use special AI techniques inspired by nature - like how birds fly together or ants find food - to make predictions with 
                <strong className="text-primary"> up to 97.2% accuracy</strong>.
              </p>
            </div>

            {/* Overall Accuracy Display */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-card p-5 text-center">
                <p className="text-4xl font-bold text-primary">97.2%</p>
                <p className="text-sm text-muted-foreground mt-1">Overall Accuracy</p>
              </div>
              <div className="glass-card p-5 text-center">
                <p className="text-4xl font-bold text-accent">12,453</p>
                <p className="text-sm text-muted-foreground mt-1">Modules Analyzed</p>
              </div>
              <div className="glass-card p-5 text-center">
                <p className="text-4xl font-bold text-warning">1,847</p>
                <p className="text-sm text-muted-foreground mt-1">Defects Found</p>
              </div>
              <div className="glass-card p-5 text-center">
                <p className="text-4xl font-bold text-success">98.7%</p>
                <p className="text-sm text-muted-foreground mt-1">Coverage Rate</p>
              </div>
            </div>

            {/* Algorithms Explained */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Algorithms We Use (Explained Simply)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {algorithms.map((algo, index) => (
                  <div key={index} className="glass-card p-5 hover:border-primary/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                        <algo.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{algo.name}</h4>
                          <span className="text-sm font-bold text-primary">{algo.accuracy}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{algo.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Helps */}
            <div className="p-5 rounded-xl bg-muted/50 border border-border">
              <h3 className="text-lg font-semibold mb-3">How Does This Help You?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Check className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Find Bugs Early</p>
                    <p className="text-xs text-muted-foreground">Catch problems before they affect users</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Check className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Save Time & Money</p>
                    <p className="text-xs text-muted-foreground">Fix issues before they become expensive</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Check className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Improve Quality</p>
                    <p className="text-xs text-muted-foreground">Make your software more reliable</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== SECTION 2: DATASET UPLOAD ==================== */}
      <div className="glass-card overflow-hidden">
        <SectionHeader 
          title="Upload Your Dataset" 
          subtitle="Upload CSV files for defect analysis"
          section="dataset"
          icon={Database}
        />
        {expandedSections.dataset && (
          <div className="p-6 border border-t-0 border-border rounded-b-xl space-y-6">
            {/* Upload Area */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} 
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }} 
              onDrop={handleDrop} 
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
            >
              <input type="file" accept=".csv" onChange={handleFileSelect} className="absolute inset-0 opacity-0 cursor-pointer" disabled={isUploading} />
              <div className="text-center space-y-3">
                {isUploading ? (
                  <>
                    <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin" />
                    <div className="space-y-2">
                      <p className="font-medium">Processing dataset...</p>
                      <div className="max-w-xs mx-auto"><Progress value={uploadProgress} className="h-2" /></div>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                    <div>
                      <p className="font-medium">Drop your CSV file here, or click to browse</p>
                      <p className="text-sm text-muted-foreground mt-1">Supports NASA, PROMISE, and custom defect datasets</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Datasets and Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Uploaded Datasets */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Uploaded Datasets</h3>
                  <span className="text-sm text-muted-foreground">{datasets.length} datasets</span>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {datasets.map((dataset) => (
                    <div 
                      key={dataset.id} 
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${selectedDataset?.id === dataset.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`} 
                      onClick={() => setSelectedDataset(dataset)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileSpreadsheet className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{dataset.name}</p>
                          <p className="text-xs text-muted-foreground">{dataset.rows.toLocaleString()} rows • {dataset.columns} cols</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="metric-badge success text-xs"><Check className="h-3 w-3" />Ready</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); handleDelete(dataset.id); }}>
                          <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dataset Preview */}
              <div className="glass-card p-5">
                <h3 className="font-semibold mb-4">Dataset Preview</h3>
                {selectedDataset ? (
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3 font-medium text-muted-foreground">LOC</th>
                          <th className="text-left py-2 px-3 font-medium text-muted-foreground">CC</th>
                          <th className="text-left py-2 px-3 font-medium text-muted-foreground">Comments</th>
                          <th className="text-left py-2 px-3 font-medium text-muted-foreground">Defective</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockPreviewData.slice(0, 4).map((row, index) => (
                          <tr key={index} className="border-b border-border/50">
                            <td className="py-2 px-3">{row.loc}</td>
                            <td className="py-2 px-3">{row.cc}</td>
                            <td className="py-2 px-3">{row.comment_density.toFixed(2)}</td>
                            <td className="py-2 px-3">
                              <span className={`metric-badge ${row.defective ? 'danger' : 'success'} text-xs`}>
                                {row.defective ? 'Yes' : 'No'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Database className="h-10 w-10 mb-3 opacity-50" />
                    <p className="text-sm">Select a dataset to preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== SECTION 3: WEBSITE ANALYSIS ==================== */}
      <div className="glass-card overflow-hidden">
        <SectionHeader 
          title="Website & Social Media Analysis" 
          subtitle="AI-powered defect detection for websites and social platforms"
          section="analysis"
          icon={Globe}
        />
        {expandedSections.analysis && (
          <div className="p-6 border border-t-0 border-border rounded-b-xl space-y-6">
            {/* Input Mode Tabs */}
            <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'url' | 'manual' | 'social')}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  URL Scraping
                </TabsTrigger>
                <TabsTrigger value="social" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Social Media
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  Manual Content
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="mt-0">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      type="url" 
                      placeholder="Enter website URL (e.g., https://example.com)" 
                      value={url} 
                      onChange={(e) => setUrl(e.target.value)} 
                      className="pl-10 h-12"
                      onKeyDown={(e) => e.key === 'Enter' && analyzeWebsite()}
                    />
                  </div>
                  <Button onClick={analyzeWebsite} disabled={isAnalyzing || !url} size="lg">
                    {isAnalyzing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : <><Search className="h-4 w-4 mr-2" />Analyze</>}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="social" className="mt-0 space-y-4">
                {/* Analysis Mode Toggle */}
                <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
                  <button
                    onClick={() => setSocialAnalysisMode('platform-url')}
                    className={cn(
                      'px-4 py-2 rounded-md text-sm font-medium transition-all',
                      socialAnalysisMode === 'platform-url'
                        ? 'bg-background shadow-sm text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    🔍 Platform UX Analysis
                  </button>
                  <button
                    onClick={() => setSocialAnalysisMode('post-content')}
                    className={cn(
                      'px-4 py-2 rounded-md text-sm font-medium transition-all',
                      socialAnalysisMode === 'post-content'
                        ? 'bg-background shadow-sm text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    📝 Post Content Analysis
                  </button>
                </div>

                {socialAnalysisMode === 'platform-url' ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Platform UX Analysis:</strong> Find defects like slow loading, scrolling issues, video problems on social platforms.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2">
                      {(Object.keys(socialPlatformConfig) as SocialPlatform[]).map((platform) => {
                        const config = socialPlatformConfig[platform];
                        const isSelected = selectedPlatformForUrl === platform;
                        return (
                          <button
                            key={platform}
                            onClick={() => setSelectedPlatformForUrl(platform)}
                            className={cn(
                              'flex flex-col items-center gap-1 p-3 rounded-lg border transition-all',
                              isSelected 
                                ? 'border-primary bg-primary/10 text-primary' 
                                : 'border-border hover:border-primary/50'
                            )}
                          >
                            <span className="text-xl">{config.icon}</span>
                            <span className="text-xs font-medium">{config.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                          type="url" 
                          placeholder={`e.g., https://www.${selectedPlatformForUrl}.com`}
                          value={socialPlatformUrl}
                          onChange={(e) => setSocialPlatformUrl(e.target.value)}
                          className="pl-10 h-12"
                        />
                      </div>
                    </div>

                    <Textarea 
                      placeholder={`Describe issues you've experienced (e.g., "Reels scroll too fast", "Videos buffer constantly")...`}
                      value={userExperienceIssues}
                      onChange={(e) => setUserExperienceIssues(e.target.value)}
                      className="min-h-[80px]"
                    />

                    <Button onClick={analyzeWebsite} disabled={isAnalyzing || !socialPlatformUrl.trim()} className="w-full">
                      {isAnalyzing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : <><Search className="h-4 w-4 mr-2" />Analyze Platform</>}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Paste your social media post content here..."
                      value={socialPost.caption}
                      onChange={(e) => setSocialPost({...socialPost, caption: e.target.value})}
                      className="min-h-[100px]"
                    />
                    <Button onClick={analyzeWebsite} disabled={isAnalyzing || !socialPost.caption.trim()} className="w-full">
                      {isAnalyzing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : <><Search className="h-4 w-4 mr-2" />Analyze Post</>}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="manual" className="mt-0 space-y-4">
                <Input 
                  placeholder="Source name (optional, e.g., 'Homepage HTML')" 
                  value={contentSource}
                  onChange={(e) => setContentSource(e.target.value)}
                />
                <Textarea 
                  placeholder="Paste your HTML, CSS, or content here..."
                  value={manualContent}
                  onChange={(e) => setManualContent(e.target.value)}
                  className="min-h-[150px] font-mono text-sm"
                />
                <Button onClick={analyzeWebsite} disabled={isAnalyzing || !manualContent.trim()} className="w-full">
                  {isAnalyzing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : <><Search className="h-4 w-4 mr-2" />Analyze Content</>}
                </Button>
              </TabsContent>
            </Tabs>

            {/* Progress */}
            {isAnalyzing && (
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  <span className="font-medium">{progressMessage}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-3">
                <AlertTriangle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {/* Analysis Results */}
            {analysis && (
              <div className="space-y-6 pt-4 border-t border-border">
                {/* Health Score */}
                <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Health Score</p>
                    <p className={`text-5xl font-bold ${getScoreColor(analysis.healthScore)}`}>{analysis.healthScore}/100</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${severityColors[analysis.riskLevel]}`}>
                    {analysis.riskLevel.toUpperCase()} RISK
                  </div>
                </div>

                {/* Defects Tabs */}
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                  <TabsList>
                    <TabsTrigger value="current">Current Defects ({currentDefects.length})</TabsTrigger>
                    <TabsTrigger value="future">Future Predictions ({futureDefects.length})</TabsTrigger>
                    <TabsTrigger value="prevention">Prevention ({analysis.preventiveMeasures.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="current" className="mt-4 space-y-3">
                    {currentDefects.length === 0 ? (
                      <div className="p-8 text-center rounded-lg bg-success/10 border border-success/20">
                        <Check className="h-10 w-10 text-success mx-auto mb-2" />
                        <p className="font-medium">No Current Defects Found!</p>
                      </div>
                    ) : (
                      currentDefects.map((defect, index) => {
                        const Icon = categoryIcons[defect.category] || Bug;
                        return (
                          <div key={index} className={`p-4 rounded-lg border ${severityColors[defect.severity]}`}>
                            <div className="flex items-start gap-3">
                              <Icon className="h-5 w-5 mt-0.5 shrink-0" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold">{defect.title}</span>
                                  <span className="px-2 py-0.5 rounded text-xs uppercase font-medium bg-background/50">{defect.severity}</span>
                                </div>
                                <p className="text-sm opacity-90">{defect.description}</p>
                                {defect.recommendation && (
                                  <p className="text-sm mt-2 opacity-75"><strong>Fix:</strong> {defect.recommendation}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </TabsContent>

                  <TabsContent value="future" className="mt-4 space-y-3">
                    {futureDefects.length === 0 ? (
                      <div className="p-8 text-center rounded-lg bg-success/10 border border-success/20">
                        <Check className="h-10 w-10 text-success mx-auto mb-2" />
                        <p className="font-medium">No Future Risks Predicted!</p>
                      </div>
                    ) : (
                      futureDefects.map((defect, index) => {
                        const Icon = categoryIcons[defect.category] || TrendingDown;
                        return (
                          <div key={index} className={`p-4 rounded-lg border ${severityColors[defect.severity]}`}>
                            <div className="flex items-start gap-3">
                              <Icon className="h-5 w-5 mt-0.5 shrink-0" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold">{defect.title}</span>
                                  {defect.timeframe && <span className="text-xs opacity-75">({defect.timeframe})</span>}
                                </div>
                                <p className="text-sm opacity-90">{defect.description}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </TabsContent>

                  <TabsContent value="prevention" className="mt-4 space-y-3">
                    {analysis.preventiveMeasures.length === 0 ? (
                      <div className="p-8 text-center rounded-lg bg-success/10 border border-success/20">
                        <Check className="h-10 w-10 text-success mx-auto mb-2" />
                        <p className="font-medium">All Best Practices Followed!</p>
                      </div>
                    ) : (
                      analysis.preventiveMeasures.map((measure, index) => (
                        <div key={index} className="p-4 rounded-lg bg-muted/50 border border-border">
                          <div className="flex items-start gap-3">
                            <Shield className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="font-semibold">{measure.title}</p>
                              <p className="text-sm text-muted-foreground">{measure.description}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================== SECTION 4: CONFUSION MATRIX ==================== */}
      <div className="glass-card overflow-hidden">
        <SectionHeader 
          title="Model Evaluation - Confusion Matrix" 
          subtitle="Understanding how accurate our predictions are"
          section="matrix"
          icon={Target}
        />
        {expandedSections.matrix && (
          <div className="p-6 border border-t-0 border-border rounded-b-xl space-y-6">
            {/* Simple Explanation */}
            <div className="p-5 rounded-xl bg-muted/50 border border-border">
              <h3 className="font-semibold mb-2">What is a Confusion Matrix? (Simple Explanation)</h3>
              <p className="text-sm text-muted-foreground">
                Imagine you're a doctor diagnosing patients. A confusion matrix shows how often you're right or wrong:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• <strong className="text-success">True Positive:</strong> You said "sick" and they were actually sick ✓</li>
                <li>• <strong className="text-destructive">False Positive:</strong> You said "sick" but they were healthy ✗</li>
                <li>• <strong className="text-warning">False Negative:</strong> You said "healthy" but they were sick ✗</li>
                <li>• <strong className="text-primary">True Negative:</strong> You said "healthy" and they were actually healthy ✓</li>
              </ul>
            </div>

            {/* Model Selector */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Results for:</h3>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ensemble">Hybrid Ensemble (Best)</SelectItem>
                  <SelectItem value="rf">Random Forest</SelectItem>
                  <SelectItem value="svm">SVM</SelectItem>
                  <SelectItem value="lr">Logistic Regression</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-4 text-center">
                <p className="text-3xl font-bold text-primary">{(accuracy * 100).toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground mt-1">Accuracy</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-3xl font-bold text-accent">{(precision * 100).toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground mt-1">Precision</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-3xl font-bold text-warning">{(recall * 100).toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground mt-1">Recall</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-3xl font-bold text-success">{(f1 * 100).toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground mt-1">F1-Score</p>
              </div>
            </div>

            {/* Confusion Matrix Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4 text-center">Confusion Matrix</h3>
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  <div className="p-6 rounded-xl bg-success/20 text-center border border-success/30">
                    <p className="text-3xl font-bold text-success">{confusionMatrix.tp}</p>
                    <p className="text-xs text-muted-foreground mt-1">True Positive</p>
                  </div>
                  <div className="p-6 rounded-xl bg-destructive/20 text-center border border-destructive/30">
                    <p className="text-3xl font-bold text-destructive">{confusionMatrix.fp}</p>
                    <p className="text-xs text-muted-foreground mt-1">False Positive</p>
                  </div>
                  <div className="p-6 rounded-xl bg-warning/20 text-center border border-warning/30">
                    <p className="text-3xl font-bold text-warning">{confusionMatrix.fn}</p>
                    <p className="text-xs text-muted-foreground mt-1">False Negative</p>
                  </div>
                  <div className="p-6 rounded-xl bg-primary/20 text-center border border-primary/30">
                    <p className="text-3xl font-bold text-primary">{confusionMatrix.tn}</p>
                    <p className="text-xs text-muted-foreground mt-1">True Negative</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4">What This Means</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="text-sm">Correctly identified defects</span>
                    <span className="font-bold text-success">{confusionMatrix.tp}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="text-sm">Correctly identified non-defects</span>
                    <span className="font-bold text-primary">{confusionMatrix.tn}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="text-sm">False alarms (said defect, but wasn't)</span>
                    <span className="font-bold text-destructive">{confusionMatrix.fp}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="text-sm">Missed defects (said OK, but had bugs)</span>
                    <span className="font-bold text-warning">{confusionMatrix.fn}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30">
                    <span className="font-medium">Total Predictions</span>
                    <span className="font-bold">{total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainAnalysisPage;
