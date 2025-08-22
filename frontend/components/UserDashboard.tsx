'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { readRecentTokenIds, readDataset } from '@/lib/contracts';
import VerificationBadge from './VerificationBadge';

interface ActivityDay {
  date: string;
  uploads: number;
  downloads: number;
  sales: number;
  credits: number;
}

interface DatasetStats {
  id: bigint;
  meta: any;
  uploadDate: string;
  downloads: number;
  sales: number;
  revenue: number;
  lastActivity: string;
  status: 'active' | 'inactive' | 'trending';
}

export default function UserDashboard() {
  const { address } = useAccount();
  const [selectedView, setSelectedView] = useState<'repositories' | 'activity' | 'analytics'>('repositories');
  const [activityData, setActivityData] = useState<ActivityDay[]>([]);
  const [userDatasets, setUserDatasets] = useState<DatasetStats[]>([]);

  // Get all datasets to find user's datasets
  const allDatasetsQ = useQuery({
    queryKey: ['allDatasetsForDashboard'],
    queryFn: async () => {
      const ids = await readRecentTokenIds(100);
      const datasets = await Promise.all(
        ids.map(async (id) => {
          try {
            return await readDataset(id);
          } catch {
            return null;
          }
        })
      );
      return datasets.filter(Boolean);
    },
  });

  // Generate mock activity data
  useEffect(() => {
    if (!address) return;

    // Generate last 30 days of activity
    const generateActivityData = (): ActivityDay[] => {
      const days: ActivityDay[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        days.push({
          date: date.toLocaleDateString(),
          uploads: Math.floor(Math.random() * 3),
          downloads: Math.floor(Math.random() * 20) + 5,
          sales: Math.floor(Math.random() * 2),
          credits: Math.floor(Math.random() * 50) + 10,
        });
      }
      return days;
    };

    setActivityData(generateActivityData());
  }, [address]);

  // Process user datasets
  useEffect(() => {
    if (!allDatasetsQ.data || !address) return;

    const userDatasetsData = allDatasetsQ.data
      .filter((dataset: any) => dataset.owner.toLowerCase() === address.toLowerCase())
      .map((dataset: any, index: number) => {
        const uploadDate = new Date();
        uploadDate.setDate(uploadDate.getDate() - Math.floor(Math.random() * 30));
        
        const downloads = Math.floor(Math.random() * 100) + 10;
        const sales = Math.floor(Math.random() * 10);
        const revenue = sales * (Math.floor(Math.random() * 50) + 20);
        
        let status: 'active' | 'inactive' | 'trending' = 'active';
        if (downloads > 80) status = 'trending';
        if (downloads < 20) status = 'inactive';
        
        return {
          id: BigInt(index + 1),
          meta: dataset,
          uploadDate: uploadDate.toLocaleDateString(),
          downloads,
          sales,
          revenue,
          lastActivity: new Date().toLocaleDateString(),
          status,
        };
      });

    setUserDatasets(userDatasetsData);
  }, [allDatasetsQ.data, address]);

  if (!address) {
    return (
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6 text-center">
        <div className="text-lg mb-2">🔒</div>
        <div>Connect your wallet to view dashboard</div>
      </div>
    );
  }

  if (allDatasetsQ.isPending) {
    return (
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-800 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-neutral-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalDatasets = userDatasets.length;
  const totalDownloads = userDatasets.reduce((sum, ds) => sum + ds.downloads, 0);
  const totalRevenue = userDatasets.reduce((sum, ds) => sum + ds.revenue, 0);
  const activeDays = activityData.filter(day => day.uploads > 0 || day.downloads > 0).length;

  return (
    <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-neutral-400">Manage your research datasets and track performance</p>
        </div>
        <div className="text-sm text-neutral-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
          <div className="text-sm text-neutral-400 mb-1">Repositories</div>
          <div className="text-2xl font-bold text-emerald-400">{totalDatasets}</div>
        </div>
        
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
          <div className="text-sm text-neutral-400 mb-1">Total Downloads</div>
          <div className="text-2xl font-bold text-blue-400">{totalDownloads}</div>
        </div>
        
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
          <div className="text-sm text-neutral-400 mb-1">Revenue</div>
          <div className="text-2xl font-bold text-purple-400">${totalRevenue}</div>
        </div>
        
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
          <div className="text-sm text-neutral-400 mb-1">Active Days</div>
          <div className="text-2xl font-bold text-orange-400">{activeDays}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-700 mb-6">
        {[
          { key: 'repositories', label: 'Repositories', icon: '📁' },
          { key: 'activity', label: 'Activity', icon: '📊' },
          { key: 'analytics', label: 'Analytics', icon: '📈' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedView(tab.key as any)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              selectedView === tab.key
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-300'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content based on selected view */}
      {selectedView === 'repositories' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Datasets</h3>
            <div className="text-sm text-neutral-400">
              {userDatasets.length} repository{userDatasets.length !== 1 ? 'ies' : 'y'}
            </div>
          </div>
          
          {userDatasets.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <div className="text-4xl mb-4">📁</div>
              <div className="text-lg mb-2">No repositories yet</div>
              <div className="text-sm opacity-70">Upload your first dataset to get started</div>
            </div>
          ) : (
            <div className="space-y-3">
              {userDatasets.map((dataset) => (
                <div
                  key={dataset.id.toString()}
                  className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-800/70 transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/dataset/${dataset.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center text-sm font-bold text-black">
                        📊
                      </div>
                      <div>
                        <div className="font-medium">Data #{dataset.id}</div>
                        <div className="text-sm text-neutral-400">
                          {dataset.meta.domain || 'Research'} • {dataset.meta.tags?.slice(0, 2).join(', ') || 'No tags'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <VerificationBadge verified={dataset.meta.verified} size="sm" />
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        dataset.status === 'trending' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                        dataset.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        'bg-neutral-500/20 text-neutral-400 border border-neutral-500/40'
                      }`}>
                        {dataset.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-neutral-400">Uploaded</div>
                      <div className="font-medium">{dataset.uploadDate}</div>
                    </div>
                    <div>
                      <div className="text-neutral-400">Downloads</div>
                      <div className="font-medium text-blue-400">{dataset.downloads}</div>
                    </div>
                    <div>
                      <div className="text-neutral-400">Sales</div>
                      <div className="font-medium text-purple-400">{dataset.sales}</div>
                    </div>
                    <div>
                      <div className="text-neutral-400">Revenue</div>
                      <div className="font-medium text-emerald-400">${dataset.revenue}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedView === 'activity' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Chart */}
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
              <div className="text-sm text-neutral-400 mb-3">Last 30 Days Activity</div>
              <div className="space-y-2">
                {activityData.slice(-7).map((day, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-16 text-xs text-neutral-400">{day.date}</div>
                    <div className="flex-1 bg-neutral-700 rounded-full h-2">
                      <div 
                        className="bg-emerald-400 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((day.uploads + day.downloads) / 30 * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-neutral-400 w-16 text-right">
                      {day.uploads + day.downloads} actions
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Activity Summary */}
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
              <div className="text-sm text-neutral-400 mb-3">Activity Summary</div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Uploads</span>
                  <span className="text-emerald-400">{activityData.reduce((sum, day) => sum + day.uploads, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Downloads</span>
                  <span className="text-blue-400">{activityData.reduce((sum, day) => sum + day.downloads, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Sales</span>
                  <span className="text-purple-400">{activityData.reduce((sum, day) => sum + day.sales, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Credits</span>
                  <span className="text-orange-400">{activityData.reduce((sum, day) => sum + day.credits, 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'analytics' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Performance Analytics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
              <div className="text-sm text-neutral-400 mb-3">Performance Metrics</div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Avg Downloads/Repo</span>
                  <span className="text-blue-400">
                    {totalDatasets > 0 ? Math.round(totalDownloads / totalDatasets) : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Conversion Rate</span>
                  <span className="text-emerald-400">
                    {totalDownloads > 0 ? Math.round((userDatasets.filter(ds => ds.sales > 0).length / totalDatasets) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue per Download</span>
                  <span className="text-purple-400">
                    ${totalDownloads > 0 ? Math.round(totalRevenue / totalDownloads * 100) / 100 : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Active Repositories</span>
                  <span className="text-orange-400">
                    {userDatasets.filter(ds => ds.status === 'active' || ds.status === 'trending').length}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Top Performers */}
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
              <div className="text-sm text-neutral-400 mb-3">Top Performers</div>
              <div className="space-y-2">
                {userDatasets
                  .sort((a, b) => b.downloads - a.downloads)
                  .slice(0, 3)
                  .map((dataset, index) => (
                    <div key={dataset.id.toString()} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-neutral-400 text-black' :
                          'bg-orange-600 text-white'
                        }`}>
                          {index + 1}
                        </span>
                        <span>Data #{dataset.id}</span>
                      </div>
                      <span className="text-emerald-400">{dataset.downloads} downloads</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
