import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import StatsCard from './StatsCard';
import PerformanceMonitor from './PerformanceMonitor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, HardDrive, Zap, Activity } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const { user } = useAuth();

  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${user?.discriminator ? parseInt(user.discriminator) % 5 : 0}.png`;

  return (
    <div className="flex h-screen bg-background grid-background overflow-hidden">
      {/* Scan line effect */}
      <div className="scan-line" />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-6 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-glow mb-2">
                {activeTab === 'home' && 'Welcome to Paragon'}
                {activeTab === 'performance' && 'Performance Monitor'}
                {activeTab === 'settings' && 'Settings'}
                {activeTab === 'profile' && 'User Profile'}
              </h1>
              <p className="text-muted-foreground">
                Performance, Optimization, and Control
              </p>
            </div>

            {/* User Badge */}
            <div className="flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-lg holographic">
              <img
                src={avatarUrl}
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-primary glow-red"
              />
              <div>
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'home' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="CPU Performance"
                  value="87%"
                  subtitle="Optimized"
                  icon={Cpu}
                  trend="up"
                />
                <StatsCard
                  title="Memory Usage"
                  value="4.2 GB"
                  subtitle="of 16 GB"
                  icon={HardDrive}
                />
                <StatsCard
                  title="Power Mode"
                  value="High"
                  subtitle="Performance"
                  icon={Zap}
                  trend="up"
                />
                <StatsCard
                  title="Active Processes"
                  value="247"
                  subtitle="Running"
                  icon={Activity}
                />
              </div>

              {/* Performance Monitor and Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PerformanceMonitor />

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <button className="w-full px-4 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-left transition-all group">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            Optimize System
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Run system optimization
                          </p>
                        </div>
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                    </button>

                    <button className="w-full px-4 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-left transition-all group">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            Clean Registry
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Remove unnecessary entries
                          </p>
                        </div>
                        <HardDrive className="w-5 h-5 text-primary" />
                      </div>
                    </button>

                    <button className="w-full px-4 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-left transition-all group">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            Update Drivers
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Check for driver updates
                          </p>
                        </div>
                        <Cpu className="w-5 h-5 text-primary" />
                      </div>
                    </button>
                  </CardContent>
                </Card>
              </div>

              {/* System Info */}
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Operating System</p>
                      <p className="font-medium">Windows 11 Pro</p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Processor</p>
                      <p className="font-medium">Intel Core i7-12700K</p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Graphics</p>
                      <p className="font-medium">NVIDIA RTX 4080</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <PerformanceMonitor />
              <Card>
                <CardHeader>
                  <CardTitle>Performance Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Advanced performance monitoring and optimization tools will appear here.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Application settings and preferences will appear here.
                </p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-6">
                  <img
                    src={avatarUrl}
                    alt="User avatar"
                    className="w-24 h-24 rounded-full border-4 border-primary glow-red-strong"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-glow mb-1">
                      {user?.username}
                    </h2>
                    {user?.email && (
                      <p className="text-muted-foreground">{user.email}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">
                      User ID: {user?.id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
