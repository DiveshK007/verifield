import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Coins, 
  TrendingUp, 
  Download, 
  Calendar,
  CreditCard,
  ArrowUpRight,
  DollarSign,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAccount, useWriteContract } from 'wagmi';
import MarketplaceAbi from '@/lib/abis/Marketplace';
import { hardhat } from '@/lib/wagmi';
import { getContracts } from '@/lib/utils';

const transactionData = [
  {
    id: '1',
    dataset: 'E-commerce Customer Behavior Dataset',
    buyer: 'TechCorp AI',
    amount: 299,
    date: '2024-01-15',
    status: 'completed'
  },
  {
    id: '2',
    dataset: 'Financial Market Indicators',
    buyer: 'Hedge Fund Analytics',
    amount: 899,
    date: '2024-01-14',
    status: 'completed'
  },
  {
    id: '3',
    dataset: 'Social Media Sentiment Analysis',
    buyer: 'Marketing Insights LLC',
    amount: 199,
    date: '2024-01-12',
    status: 'pending'
  }
];

const Earnings = () => {
  const [totalEarnings] = useState(15420);
  const [pendingEarnings] = useState(1250);
  const [monthlyGrowth] = useState(23);
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()

  const handleWithdraw = async () => {
    if (!isConnected || !address) { toast({ title: 'Connect wallet', description: 'Please connect your wallet', variant: 'destructive' }); return }
    try {
      await writeContractAsync({
        abi: MarketplaceAbi as unknown,
        address: getContracts().marketplace as `0x${string}`,
        chain: hardhat,
        account: address,
        functionName: 'withdrawCredits',
        args: []
      })
      toast({ title: 'Withdrawal sent', description: 'Your credits withdrawal transaction has been submitted.' })
    } catch (err: unknown) {
      const e = err as Error
      toast({ title: 'Withdraw failed', description: e.message || 'Transaction failed', variant: 'destructive' })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Earnings</h1>
          <p className="text-muted-foreground mt-1">
            Track your revenue and manage payouts
          </p>
        </div>
        <Button className="shadow-glow hover:shadow-elevated transition-all duration-300" onClick={handleWithdraw} disabled={isPending}>
          <CreditCard className="h-4 w-4 mr-2" />
          {isPending ? 'Withdrawing...' : 'Withdraw Funds'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-surface border-border/50 hover:border-primary/20 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-3xl font-bold text-foreground animate-counter">
                  ${totalEarnings.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Coins className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+{monthlyGrowth}%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border/50 hover:border-primary/20 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-foreground">
                  ${pendingEarnings.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Processing within 3-5 business days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border/50 hover:border-primary/20 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold text-foreground">
                  $2,840
                </p>
              </div>
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              12 transactions completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card className="bg-surface border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-surface-elevated">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-4">
                {transactionData.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-surface-elevated border border-border/30 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{transaction.dataset}</h4>
                      <p className="text-sm text-muted-foreground">Purchased by {transaction.buyer}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${transaction.amount}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                      <Badge 
                        variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <div className="space-y-4">
                {transactionData.filter(t => t.status === 'completed').map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-surface-elevated border border-border/30"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{transaction.dataset}</h4>
                      <p className="text-sm text-muted-foreground">Purchased by {transaction.buyer}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${transaction.amount}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                      <Badge variant="default" className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <div className="space-y-4">
                {transactionData.filter(t => t.status === 'pending').map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-surface-elevated border border-border/30"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{transaction.dataset}</h4>
                      <p className="text-sm text-muted-foreground">Purchased by {transaction.buyer}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${transaction.amount}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Earnings;