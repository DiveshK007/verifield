import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Edit,
  Mail,
  MapPin,
  Calendar,
  Globe,
  Github,
  Twitter,
  Linkedin,
  Save,
  Database,
  Star,
  Download
} from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Data scientist and machine learning researcher passionate about creating high-quality datasets for the AI community.',
    location: 'San Francisco, CA',
    joinDate: 'January 2023',
    website: 'https://johndoe.dev',
    github: 'johndoe',
    twitter: 'johndoe_ai',
    linkedin: 'johndoe'
  });

  const stats = {
    datasetsUploaded: 47,
    totalDownloads: 15420,
    totalStars: 892,
    creditsEarned: 15420,
    followers: 1284,
    following: 156
  };

  const recentDatasets = [
    {
      id: '1',
      title: 'E-commerce Customer Behavior Dataset',
      downloads: 1245,
      stars: 89,
      lastUpdated: '2 days ago'
    },
    {
      id: '2',
      title: 'Climate Change Sentiment Analysis',
      downloads: 892,
      stars: 156,
      lastUpdated: '5 days ago'
    },
    {
      id: '3',
      title: 'Financial Market Indicators',
      downloads: 3421,
      stars: 234,
      lastUpdated: '1 week ago'
    }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your profile and account settings
          </p>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="shadow-glow hover:shadow-elevated transition-all duration-300"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="bg-surface border-border/50 lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              {isEditing ? (
                <div className="w-full space-y-3">
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="text-center font-semibold"
                  />
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="text-center text-sm resize-none"
                    rows={3}
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-foreground mb-2">{profile.name}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{profile.bio}</p>
                </>
              )}

              <div className="flex items-center gap-4 mb-4">
                <Badge variant="default" className="gap-1">
                  <Database className="h-3 w-3" />
                  {stats.datasetsUploaded} datasets
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3" />
                  {stats.totalStars} stars
                </Badge>
              </div>

              <div className="w-full space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {isEditing ? (
                    <Input
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="text-sm h-8"
                    />
                  ) : (
                    <span>{profile.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {isEditing ? (
                    <Input
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      className="text-sm h-8"
                    />
                  ) : (
                    <span>{profile.location}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {profile.joinDate}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="w-full mt-4 pt-4 border-t border-border/30">
                <div className="flex items-center justify-center gap-3">
                  {isEditing ? (
                    <div className="w-full space-y-2">
                      <Input
                        placeholder="Website"
                        value={profile.website}
                        onChange={(e) => setProfile({...profile, website: e.target.value})}
                        className="text-sm h-8"
                      />
                      <Input
                        placeholder="GitHub username"
                        value={profile.github}
                        onChange={(e) => setProfile({...profile, github: e.target.value})}
                        className="text-sm h-8"
                      />
                    </div>
                  ) : (
                    <>
                      {profile.website && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Globe className="h-4 w-4" />
                        </Button>
                      )}
                      {profile.github && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Github className="h-4 w-4" />
                        </Button>
                      )}
                      {profile.twitter && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Twitter className="h-4 w-4" />
                        </Button>
                      )}
                      {profile.linkedin && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats and Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-surface border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{stats.totalDownloads.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Downloads</p>
              </CardContent>
            </Card>
            <Card className="bg-surface border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">${stats.creditsEarned.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Credits Earned</p>
              </CardContent>
            </Card>
            <Card className="bg-surface border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{stats.followers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </CardContent>
            </Card>
            <Card className="bg-surface border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{stats.following}</p>
                <p className="text-xs text-muted-foreground">Following</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Datasets */}
          <Card className="bg-surface border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Recent Datasets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDatasets.map((dataset) => (
                  <div
                    key={dataset.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated border border-border/30 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{dataset.title}</h4>
                      <p className="text-sm text-muted-foreground">Updated {dataset.lastUpdated}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        <span>{dataset.downloads}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>{dataset.stars}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;