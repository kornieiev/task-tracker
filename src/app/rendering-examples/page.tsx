import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckSquare, 
  ArrowRight, 
  Monitor, 
  Server, 
  Zap,
  Clock,
  Search,
  Users,
  ArrowLeft,
  HelpCircle,
  FileText
} from 'lucide-react'
import Link from 'next/link'

const renderingStrategies = [
  {
    id: 'ssg',
    name: 'SSG',
    fullName: 'Static Site Generation',
    description: 'Pre-rendered at build time with static data',
    color: 'green',
    icon: Zap,
    href: '/rendering-examples/ssg',
    advantages: [
      'Fastest loading times',
      'Excellent SEO',
      'CDN cacheable',
      'Low server load'
    ],
    disadvantages: [
      'Static data only',
      'Requires rebuild',
      'Not for dynamic content'
    ],
    useCases: [
      'Landing pages',
      'Documentation', 
      'Blogs',
      'Marketing sites'
    ],
    performance: '🟢 Excellent',
    seo: '🟢 Excellent',
    interactivity: '🟡 Limited'
  },
  {
    id: 'ssr',
    name: 'SSR', 
    fullName: 'Server-Side Rendering',
    description: 'Rendered on server for each request with fresh data',
    color: 'blue',
    icon: Server,
    href: '/rendering-examples/ssr',
    advantages: [
      'Always fresh data',
      'Great SEO',
      'No loading states',
      'Works without JS'
    ],
    disadvantages: [
      'Slower than SSG',
      'Higher server load',
      'Not CDN cacheable',
      'Requires server'
    ],
    useCases: [
      'Personalized content',
      'User dashboards',
      'E-commerce',
      'News sites'
    ],
    performance: '🟡 Good',
    seo: '🟢 Excellent', 
    interactivity: '🟡 Limited'
  },
  {
    id: 'csr',
    name: 'CSR',
    fullName: 'Client-Side Rendering', 
    description: 'Rendered in browser after page load with dynamic data',
    color: 'orange',
    icon: Monitor,
    href: '/rendering-examples/csr',
    advantages: [
      'Highly interactive',
      'Smooth UX',
      'Real-time updates',
      'Reduced server load'
    ],
    disadvantages: [
      'Slower initial load',
      'SEO challenges',
      'Loading states needed',
      'Requires JavaScript'
    ],
    useCases: [
      'SPAs',
      'Admin dashboards',
      'Real-time apps',
      'Interactive tools'
    ],
    performance: '🟡 Good (after load)',
    seo: '🔴 Poor',
    interactivity: '🟢 Excellent'
  }
]

const colorClasses = {
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    badge: 'bg-green-100 text-green-700',
    button: 'bg-green-600 hover:bg-green-700'
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200', 
    text: 'text-blue-800',
    badge: 'bg-blue-100 text-blue-700',
    button: 'bg-blue-600 hover:bg-blue-700'
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800', 
    badge: 'bg-orange-100 text-orange-700',
    button: 'bg-orange-600 hover:bg-orange-700'
  }
}

export default function RenderingExamplesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-4">
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-purple-600">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
            </div>
            <CheckSquare className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 px-2">
              Next.js Rendering Strategies Demo
            </h1>
            <p className="text-lg sm:text-xl text-purple-100 mb-6 px-4">
              Explore different rendering approaches and understand when to use each strategy
            </p>
            <div className="bg-purple-800 rounded-lg p-3 sm:p-4 text-sm text-left">
              <p className="mb-2">
                <strong>📚 Educational Demo:</strong> Each example shows the same task list 
                using different rendering strategies to demonstrate their unique characteristics.
              </p>
              <p>
                Click on each strategy below to see it in action and compare the differences 
                in performance, SEO, and user experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Strategy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {renderingStrategies.map((strategy) => {
            const Icon = strategy.icon
            const colors = colorClasses[strategy.color as keyof typeof colorClasses]
            
            return (
              <Card 
                key={strategy.id} 
                className={`${colors.border} ${colors.bg} hover:shadow-lg transition-all duration-300`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-white ${colors.border}`}>
                      <Icon className={`h-8 w-8 ${colors.text}`} />
                    </div>
                    <Badge className={colors.badge}>
                      {strategy.name}
                    </Badge>
                  </div>
                  <CardTitle className={`text-2xl ${colors.text}`}>
                    {strategy.fullName}
                  </CardTitle>
                  <CardDescription className={colors.text}>
                    {strategy.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Performance Metrics */}
                  <div>
                    <h4 className={`font-semibold ${colors.text} mb-2`}>Performance Metrics</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Loading Speed:</span>
                        <span>{strategy.performance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SEO Friendly:</span>
                        <span>{strategy.seo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interactivity:</span>
                        <span>{strategy.interactivity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Advantages */}
                  <div>
                    <h4 className={`font-semibold ${colors.text} mb-2 flex items-center`}>
                      ✅ Advantages
                    </h4>
                    <ul className="text-sm space-y-1">
                      {strategy.advantages.map((advantage, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {advantage}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Disadvantages */}
                  <div>
                    <h4 className={`font-semibold ${colors.text} mb-2 flex items-center`}>
                      ⚠️ Considerations
                    </h4>
                    <ul className="text-sm space-y-1">
                      {strategy.disadvantages.map((disadvantage, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-500 mr-2">•</span>
                          {disadvantage}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Use Cases */}
                  <div>
                    <h4 className={`font-semibold ${colors.text} mb-2 flex items-center`}>
                      🎯 Best For
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {strategy.useCases.map((useCase, index) => (
                        <span 
                          key={index}
                          className="text-xs px-2 py-1 bg-white rounded-full border"
                        >
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button asChild className={`w-full text-white ${colors.button}`}>
                    <Link href={strategy.href}>
                      View {strategy.name} Demo
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Comparison Table */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center">
              <Search className="h-6 w-6 mr-2" />
              Quick Comparison
            </CardTitle>
            <CardDescription className="text-center">
              At a glance comparison of all rendering strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Strategy</th>
                    <th className="text-left p-3">When to Use</th>
                    <th className="text-left p-3">Loading Speed</th>
                    <th className="text-left p-3">SEO</th>
                    <th className="text-left p-3">Interactivity</th>
                    <th className="text-left p-3">Data Freshness</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-green-50">
                    <td className="p-3 font-medium text-green-700">SSG</td>
                    <td className="p-3">Static content, blogs, marketing</td>
                    <td className="p-3">🟢 Fastest</td>
                    <td className="p-3">🟢 Excellent</td>
                    <td className="p-3">🟡 Limited</td>
                    <td className="p-3">🔴 Build-time</td>
                  </tr>
                  <tr className="border-b hover:bg-blue-50">
                    <td className="p-3 font-medium text-blue-700">SSR</td>
                    <td className="p-3">Personalized, dynamic content</td>
                    <td className="p-3">🟡 Good</td>
                    <td className="p-3">🟢 Excellent</td>
                    <td className="p-3">🟡 Limited</td>
                    <td className="p-3">🟢 Fresh</td>
                  </tr>
                  <tr className="border-b hover:bg-orange-50">
                    <td className="p-3 font-medium text-orange-700">CSR</td>
                    <td className="p-3">Interactive apps, dashboards</td>
                    <td className="p-3">🟡 After load</td>
                    <td className="p-3">🔴 Poor</td>
                    <td className="p-3">🟢 Excellent</td>
                    <td className="p-3">🟢 Real-time</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Decision Guide */}
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-800 flex items-center justify-center">
              <Users className="h-6 w-6 mr-2" />
              Decision Guide
            </CardTitle>
            <CardDescription className="text-purple-700 text-center">
              Choose the right rendering strategy for your use case
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <div className="text-center">
                <div className="bg-green-100 p-3 lg:p-4 rounded-lg mb-3 lg:mb-4">
                  <Zap className="h-6 w-6 lg:h-8 lg:w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-green-800 text-sm lg:text-base">Choose SSG when:</h3>
                </div>
                <ul className="text-xs lg:text-sm space-y-1 lg:space-y-2 text-green-700">
                  <li>• Content rarely changes</li>
                  <li>• SEO is critical</li>
                  <li>• Performance is priority</li>
                  <li>• Global audience (CDN)</li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 p-3 lg:p-4 rounded-lg mb-3 lg:mb-4">
                  <Server className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-800 text-sm lg:text-base">Choose SSR when:</h3>
                </div>
                <ul className="text-xs lg:text-sm space-y-1 lg:space-y-2 text-blue-700">
                  <li>• Data changes frequently</li>
                  <li>• SEO + fresh data needed</li>
                  <li>• Personalized content</li>
                  <li>• Server-side logic required</li>
                </ul>
              </div>
              
              <div className="text-center sm:col-span-2 lg:col-span-1">
                <div className="bg-orange-100 p-3 lg:p-4 rounded-lg mb-3 lg:mb-4">
                  <Monitor className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-orange-800 text-sm lg:text-base">Choose CSR when:</h3>
                </div>
                <ul className="text-xs lg:text-sm space-y-1 lg:space-y-2 text-orange-700">
                  <li>• High interactivity needed</li>
                  <li>• Real-time updates</li>
                  <li>• Admin dashboards</li>
                  <li>• SEO not important</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Examples */}
        <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-center text-indigo-700 flex items-center justify-center">
              <HelpCircle className="h-6 w-6 mr-2" />
              More Examples
            </CardTitle>
            <CardDescription className="text-center text-indigo-600">
              Explore additional pages demonstrating different rendering strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col space-y-2 border-green-200 hover:bg-green-50">
                <Link href="/faq">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5 text-green-600" />
                    <Badge className="bg-green-100 text-green-700">SSG</Badge>
                  </div>
                  <span className="font-medium">FAQ Page</span>
                  <span className="text-xs text-gray-600 text-center">
                    Static FAQ pre-rendered at build time
                  </span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col space-y-2 border-blue-200 hover:bg-blue-50">
                <Link href="/terms-of-service">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <Badge className="bg-blue-100 text-blue-700">SSR</Badge>
                  </div>
                  <span className="font-medium">Terms of Service</span>
                  <span className="text-xs text-gray-600 text-center">
                    Server-rendered with latest content
                  </span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-4 flex flex-col space-y-2 border-orange-200 hover:bg-orange-50">
                <Link href="/tasks">
                  <div className="flex items-center space-x-2">
                    <CheckSquare className="h-5 w-5 text-orange-600" />
                    <Badge className="bg-orange-100 text-orange-700">CSR</Badge>
                  </div>
                  <span className="font-medium">Task List</span>
                  <span className="text-xs text-gray-600 text-center">
                    Client-rendered with real-time updates
                  </span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <Clock className="h-5 w-5 inline mr-2" />
          <span className="text-sm">
            This demo was created to showcase Next.js rendering strategies in a practical context.
            Try each example to see the differences in action!
          </span>
        </div>
      </div>
    </div>
  )
}
