import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import AISuggestionBox from '@/components/AISuggestionBox';
import { useToast } from '@/hooks/use-toast';
import {
  Upload as UploadIcon,
  FileText,
  Shield,
  Tags,
  Hash,
  Globe,
  Info,
  Zap
} from 'lucide-react';

interface DatasetForm {
  title: string;
  description: string;
  cid: string;
  sha256: string;
  licenseUrl: string;
  tags: string[];
  verified: boolean;
  price: string;
}

const Upload = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<DatasetForm>({
    title: '',
    description: '',
    cid: '',
    sha256: '',
    licenseUrl: '',
    tags: [],
    verified: false,
    price: '0'
  });
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setForm({ ...form, tags: form.tags.filter(tag => tag !== tagToRemove) });
  };

  const validateForm = () => {
    if (!form.title || !form.description || !form.cid || !form.sha256 || !form.licenseUrl) {
      return false;
    }
    
    // Validate CID format (simplified)
    if (!form.cid.startsWith('bafy') && !form.cid.startsWith('ipfs://')) {
      return false;
    }
    
    // Validate SHA-256 format (64 hex characters)
    if (!/^[a-fA-F0-9]{64}$/.test(form.sha256)) {
      return false;
    }
    
    // Validate URL format
    if (!form.licenseUrl.startsWith('http')) {
      return false;
    }
    
    return true;
  };

  const handleMint = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields correctly",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    // Mock minting process
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Dataset Minted Successfully!",
        description: `Dataset "${form.title}" has been minted as NFT #${Math.floor(Math.random() * 1000)}`,
      });
      
      // Reset form
      setForm({
        title: '',
        description: '',
        cid: '',
        sha256: '',
        licenseUrl: '',
        tags: [],
        verified: false,
        price: '0'
      });
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "There was an error minting your dataset",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const applySuggestions = (suggestions: any) => {
    setForm({
      ...form,
      tags: suggestions.tags || form.tags,
      description: suggestions.description || form.description
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <UploadIcon className="h-8 w-8 text-primary" />
          Upload Dataset
        </h1>
        <p className="text-muted-foreground mt-1">
          Mint your dataset as an NFT on the blockchain
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-surface border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Dataset Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter dataset title"
                  className="bg-background border-border/50"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your dataset..."
                  rows={4}
                  className="bg-background border-border/50"
                />
              </div>

              <div>
                <Label htmlFor="price">Price (Credits)</Label>
                <Input
                  id="price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0 for free dataset"
                  className="bg-background border-border/50"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary" />
                Blockchain Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cid">IPFS CID *</Label>
                <Input
                  id="cid"
                  value={form.cid}
                  onChange={(e) => setForm({ ...form, cid: e.target.value })}
                  placeholder="bafy... or ipfs://..."
                  className="bg-background border-border/50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Content Identifier for your dataset on IPFS
                </p>
              </div>

              <div>
                <Label htmlFor="sha256">SHA-256 Hash *</Label>
                <Input
                  id="sha256"
                  value={form.sha256}
                  onChange={(e) => setForm({ ...form, sha256: e.target.value })}
                  placeholder="64-character hexadecimal hash"
                  className="bg-background border-border/50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Cryptographic hash for data integrity verification
                </p>
              </div>

              <div>
                <Label htmlFor="license">License URL *</Label>
                <Input
                  id="license"
                  value={form.licenseUrl}
                  onChange={(e) => setForm({ ...form, licenseUrl: e.target.value })}
                  placeholder="https://..."
                  className="bg-background border-border/50"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tags className="h-5 w-5 text-primary" />
                Tags & Classification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Add Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Enter tag and press Add"
                    className="bg-background border-border/50"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="verified"
                  checked={form.verified}
                  onCheckedChange={(checked) => setForm({ ...form, verified: checked })}
                />
                <Label htmlFor="verified" className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Request Verification
                </Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline">
              Save Draft
            </Button>
            <Button 
              onClick={handleMint}
              disabled={isUploading || !validateForm()}
              className="shadow-glow hover:shadow-elevated transition-all duration-300"
            >
              {isUploading ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Minting...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Mint Dataset NFT
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AISuggestionBox onApplySuggestions={applySuggestions} />
          
          <Card className="bg-surface border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Minting Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network:</span>
                <span className="text-foreground">Hardhat (31337)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gas Fee:</span>
                <span className="text-foreground">~0.001 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Fee:</span>
                <span className="text-foreground">2.5%</span>
              </div>
              <div className="border-t border-border/50 pt-2">
                <div className="flex justify-between font-medium">
                  <span>Total Cost:</span>
                  <span className="text-primary">~0.001 ETH</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border/50">
            <CardContent className="p-4">
              <h4 className="font-medium text-foreground mb-2">Tips for Success</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Use descriptive titles and tags</li>
                <li>• Verify data integrity with SHA-256</li>
                <li>• Include proper licensing information</li>
                <li>• Consider verification for premium datasets</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upload;