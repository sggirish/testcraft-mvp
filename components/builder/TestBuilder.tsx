// components/builder/TestBuilder.tsx
'use client'

import { useCallback, useRef, useState, useMemo, useEffect } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  NodeTypes,
  Handle,
  Position,
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
  useKeyPress,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import {
  Play,
  MousePointer,
  Type,
  Eye,
  Clock,
  Globe,
  Save,
  Trash2,
  Plus,
  Settings,
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Layers,
  MoreVertical,
  Zap,
  Copy,
  Download,
  Upload,
  Undo,
  Redo,
  FileText,
} from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassInput } from '@/components/ui/glass-input'
import { GlassTextarea } from '@/components/ui/glass-textarea'
import { GlassBadge } from '@/components/ui/glass-badge'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// History for undo/redo
interface HistoryState {
  nodes: Node[]
  edges: Edge[]
}

// Sleek Compact Node Component
const TestStepNode = ({ data, selected }: any) => {
  const getStepConfig = () => {
    const configs: any = {
      start: {
        icon: Play,
        color: 'bg-green-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
      },
      navigate: {
        icon: Globe,
        color: 'bg-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
      },
      click: {
        icon: MousePointer,
        color: 'bg-purple-500',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
      },
      type: {
        icon: Type,
        color: 'bg-emerald-500',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
      },
      assert: {
        icon: CheckCircle,
        color: 'bg-orange-500',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30',
      },
      wait: {
        icon: Clock,
        color: 'bg-pink-500',
        bgColor: 'bg-pink-500/10',
        borderColor: 'border-pink-500/30',
      },
      end: {
        icon: CheckCircle,
        color: 'bg-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
      },
    }
    return configs[data.stepType] || configs.click
  }

  const config = getStepConfig()
  const Icon = config.icon
  const isStartOrEnd = data.stepType === 'start' || data.stepType === 'end'

  return (
    <div className={cn('relative group', isStartOrEnd ? 'w-32' : 'w-56')}>
      {data.stepType !== 'start' && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-2 !h-2 !bg-gray-600 !border-gray-500"
          style={{ top: -4 }}
        />
      )}

      <div
        className={cn(
          'px-3 py-2 rounded-lg border backdrop-blur-sm transition-all duration-200',
          config.bgColor,
          config.borderColor,
          selected ? 'ring-2 ring-purple-500 shadow-lg' : 'hover:shadow-md',
          'bg-gray-900/80'
        )}
      >
        <div className="flex items-center gap-2">
          <div className={cn('p-1.5 rounded-md', config.color, 'bg-opacity-20')}>
            <Icon className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-200 truncate">{data.label}</div>
            {data.value && !isStartOrEnd && (
              <div className="text-[10px] text-gray-400 truncate mt-0.5">{data.value}</div>
            )}
          </div>
          {!isStartOrEnd && (
            <ChevronRight className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </div>

      {data.stepType !== 'end' && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-2 !h-2 !bg-gray-600 !border-gray-500"
          style={{ bottom: -4 }}
        />
      )}
    </div>
  )
}

const nodeTypes: NodeTypes = {
  testStep: TestStepNode,
}

// Test Toolbar Component
const TestToolbar = ({ onAddStep }: any) => {
  const steps = [
    { type: 'navigate', label: 'Navigate', icon: Globe, description: 'Go to URL' },
    { type: 'click', label: 'Click', icon: MousePointer, description: 'Click element' },
    { type: 'type', label: 'Type', icon: Type, description: 'Enter text' },
    { type: 'assert', label: 'Assert', icon: CheckCircle, description: 'Verify element' },
    { type: 'wait', label: 'Wait', icon: Clock, description: 'Pause execution' },
  ]

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
      <GlassCard className="px-2 py-2" variant="dark">
        <div className="flex items-center gap-1">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <button
                key={step.type}
                onClick={() => onAddStep(step.type, step.label)}
                className="group px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-all flex items-center gap-2"
                title={step.description}
              >
                <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">
                  {step.label}
                </span>
              </button>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}

// Properties Panel Component
const PropertiesPanel = ({ selectedNode, onUpdateNode, onDeleteNode }: any) => {
  if (!selectedNode) return null
  if (selectedNode.data.stepType === 'start' || selectedNode.data.stepType === 'end') {
    return null
  }

  const renderStepFields = () => {
    switch (selectedNode.data.stepType) {
      case 'navigate':
        return (
          <div>
            <label className="text-xs text-gray-400 mb-1 block">URL</label>
            <GlassInput
              value={selectedNode.data.value || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onUpdateNode(selectedNode.id, { value: e.target.value })
              }
              placeholder="https://example.com"
              className="text-sm"
            />
          </div>
        )

      case 'click':
        return (
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Element Selector</label>
            <GlassInput
              value={selectedNode.data.value || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onUpdateNode(selectedNode.id, { value: e.target.value })
              }
              placeholder="button#submit or .btn-primary"
              className="text-sm"
            />
          </div>
        )

      case 'type':
        return (
          <>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Target Element</label>
              <GlassInput
                value={selectedNode.data.selector || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onUpdateNode(selectedNode.id, { selector: e.target.value })
                }
                placeholder="input#email"
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Text to Type</label>
              <GlassInput
                value={selectedNode.data.value || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onUpdateNode(selectedNode.id, { value: e.target.value })
                }
                placeholder="user@example.com"
                className="text-sm"
              />
            </div>
          </>
        )

      case 'assert':
        return (
          <>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Element to Check</label>
              <GlassInput
                value={selectedNode.data.selector || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onUpdateNode(selectedNode.id, { selector: e.target.value })
                }
                placeholder=".success-message"
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Expected Text</label>
              <GlassInput
                value={selectedNode.data.value || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onUpdateNode(selectedNode.id, { value: e.target.value })
                }
                placeholder="Success!"
                className="text-sm"
              />
            </div>
          </>
        )

      case 'wait':
        return (
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Duration (seconds)</label>
            <GlassInput
              type="number"
              value={selectedNode.data.value || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onUpdateNode(selectedNode.id, { value: e.target.value })
              }
              placeholder="2"
              className="text-sm"
              min="0.5"
              max="30"
              step="0.5"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="absolute right-4 top-4 z-10 w-80">
      <GlassCard className="p-4" variant="dark">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Step Configuration</h3>
          <div className="flex gap-1">
            <GlassButton
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDeleteNode(selectedNode.id)}
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </GlassButton>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Step Name</label>
            <GlassInput
              value={selectedNode.data.label}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onUpdateNode(selectedNode.id, { label: e.target.value })
              }
              className="text-sm"
            />
          </div>

          {renderStepFields()}
        </div>
      </GlassCard>
    </div>
  )
}

// Main Test Builder Component
function TestBuilderContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { addToast } = useToast()
  const reactFlowInstance = useReactFlow()

  const testId = params?.id as string
  const projectId = searchParams?.get('projectId')

  const [testName, setTestName] = useState('New Test Flow')
  const [testDescription, setTestDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Initialize with start and end nodes
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: 'start',
      type: 'testStep',
      position: { x: 400, y: 50 },
      data: {
        stepType: 'start',
        label: 'Start',
        value: '',
        selector: '',
      },
    },
    {
      id: 'end',
      type: 'testStep',
      position: { x: 400, y: 400 },
      data: {
        stepType: 'end',
        label: 'End',
        value: '',
        selector: '',
      },
    },
  ])

  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  // Load test if editing
  useEffect(() => {
    if (testId && testId !== 'new') {
      loadTest(testId)
    }
  }, [testId])

  // Load test data
  const loadTest = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/tests/${id}`)
      if (response.ok) {
        const test = await response.json()
        setTestName(test.name)
        setTestDescription(test.description || '')

        // Parse and set nodes/edges from test.steps
        if (test.steps && Array.isArray(test.steps)) {
          const loadedNodes = test.steps.map((step: any) => ({
            id: step.id,
            type: 'testStep',
            position: step.position || { x: 400, y: 100 * test.steps.indexOf(step) },
            data: {
              stepType: step.type,
              label: step.label,
              value: step.value || '',
              selector: step.selector || '',
            },
          }))

          // Ensure start and end nodes exist
          const hasStart = loadedNodes.some((n: Node) => n.data.stepType === 'start')
          const hasEnd = loadedNodes.some((n: Node) => n.data.stepType === 'end')

          if (!hasStart) {
            loadedNodes.unshift({
              id: 'start',
              type: 'testStep',
              position: { x: 400, y: 50 },
              data: { stepType: 'start', label: 'Start' },
            })
          }

          if (!hasEnd) {
            loadedNodes.push({
              id: 'end',
              type: 'testStep',
              position: { x: 400, y: 100 * (loadedNodes.length + 1) },
              data: { stepType: 'end', label: 'End' },
            })
          }

          setNodes(loadedNodes)

          // Create edges based on step order
          const loadedEdges: Edge[] = []
          for (let i = 0; i < loadedNodes.length - 1; i++) {
            loadedEdges.push({
              id: `e${loadedNodes[i].id}-${loadedNodes[i + 1].id}`,
              source: loadedNodes[i].id,
              target: loadedNodes[i + 1].id,
              type: 'smoothstep',
              animated: true,
            })
          }
          setEdges(loadedEdges)
        }
      }
    } catch (error) {
      console.error('Error loading test:', error)
      addToast({
        title: 'Error',
        description: 'Failed to load test',
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Save to history for undo/redo
  const saveToHistory = useCallback(() => {
    const newState: HistoryState = { nodes: [...nodes], edges: [...edges] }
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [nodes, edges, history, historyIndex])

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      setNodes(prevState.nodes)
      setEdges(prevState.edges)
      setHistoryIndex(historyIndex - 1)
    }
  }, [history, historyIndex, setNodes, setEdges])

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      setNodes(nextState.nodes)
      setEdges(nextState.edges)
      setHistoryIndex(historyIndex + 1)
    }
  }, [history, historyIndex, setNodes, setEdges])

  const zPressed = useKeyPress('z')
  const yPressed = useKeyPress('y')

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = window.navigator.platform.includes('Mac')
      if (event.key.toLowerCase() === 'z' && (isMac ? event.metaKey : event.ctrlKey)) {
        undo()
      }
      if (event.key.toLowerCase() === 'y' && (isMac ? event.metaKey : event.ctrlKey)) {
        redo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  // Handle connections
  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: '#6b7280',
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#6b7280',
          width: 20,
          height: 20,
        },
      }
      setEdges((eds) => addEdge(edge, eds))
      saveToHistory()
    },
    [setEdges, saveToHistory]
  )

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  // Handle clicking on empty canvas
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  // Add new step
  const onAddStep = useCallback(
    (stepType: string, label: string) => {
      const newNode: Node = {
        id: `${stepType}_${Date.now()}`,
        type: 'testStep',
        position: {
          x: 400 + Math.random() * 100 - 50,
          y: 200 + Math.random() * 100 - 50,
        },
        data: {
          stepType,
          label,
          value: '',
          selector: '',
        },
      }
      setNodes((nds) => nds.concat(newNode))
      saveToHistory()
    },
    [setNodes, saveToHistory]
  )

  // Update node data
  const onUpdateNode = useCallback(
    (nodeId: string, updates: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: { ...node.data, ...updates },
            }
          }
          return node
        })
      )
      if (selectedNode?.id === nodeId) {
        setSelectedNode((prev) => (prev ? { ...prev, data: { ...prev.data, ...updates } } : null))
      }
    },
    [selectedNode, setNodes]
  )

  // Delete node
  const onDeleteNode = useCallback(
    (nodeId: string) => {
      // Don't allow deleting start/end nodes
      const node = nodes.find((n) => n.id === nodeId)
      if (node?.data.stepType === 'start' || node?.data.stepType === 'end') {
        return
      }

      setNodes((nds) => nds.filter((node) => node.id !== nodeId))
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
      setSelectedNode(null)
      saveToHistory()
    },
    [nodes, setNodes, setEdges, saveToHistory]
  )

  // Validate test flow
  const validateFlow = (): boolean => {
    // Check if start is connected
    const startConnected = edges.some((e) => e.source === 'start')
    if (!startConnected) {
      addToast({
        title: 'Invalid flow',
        description: 'Start node must be connected',
        type: 'error',
      })
      return false
    }

    // Check if end is connected
    const endConnected = edges.some((e) => e.target === 'end')
    if (!endConnected) {
      addToast({
        title: 'Invalid flow',
        description: 'End node must be connected',
        type: 'error',
      })
      return false
    }

    // Check if all steps have required fields
    for (const node of nodes) {
      if (node.data.stepType === 'start' || node.data.stepType === 'end') continue

      if (!node.data.label) {
        addToast({
          title: 'Invalid step',
          description: `Step "${node.id}" needs a name`,
          type: 'error',
        })
        return false
      }

      // Validate specific step types
      if (node.data.stepType === 'navigate' && !node.data.value) {
        addToast({
          title: 'Invalid step',
          description: `Navigate step "${node.data.label}" needs a URL`,
          type: 'error',
        })
        return false
      }

      if (node.data.stepType === 'click' && !node.data.value) {
        addToast({
          title: 'Invalid step',
          description: `Click step "${node.data.label}" needs a selector`,
          type: 'error',
        })
        return false
      }
    }

    return true
  }

  // Save test
  const handleSave = async () => {
    if (!validateFlow()) return

    setIsSaving(true)

    const testData = {
      name: testName,
      description: testDescription,
      projectId: projectId || undefined,
      steps: nodes.map((node) => ({
        id: node.id,
        type: node.data.stepType,
        label: node.data.label,
        value: node.data.value || '',
        selector: node.data.selector || '',
        position: node.position,
      })),
    }

    try {
      const url = testId && testId !== 'new' ? `/api/tests/${testId}` : '/api/tests'

      const method = testId && testId !== 'new' ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      })

      if (response.ok) {
        const savedTest = await response.json()
        addToast({
          title: 'Test saved',
          description: 'Your test has been saved successfully',
          type: 'success',
        })

        // If it was a new test, redirect to edit mode
        if (!testId || testId === 'new') {
          router.push(`/builder/${savedTest.id}`)
        }
      } else {
        throw new Error('Failed to save test')
      }
    } catch (error) {
      console.error('Error saving test:', error)
      addToast({
        title: 'Error',
        description: 'Failed to save test',
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Run test
  const handleRun = async () => {
    if (!validateFlow()) return

    setIsRunning(true)

    addToast({
      title: 'Test started',
      description: 'Running test flow...',
      type: 'info',
    })

    // TODO: Implement actual test execution
    setTimeout(() => {
      setIsRunning(false)
      addToast({
        title: 'Test completed',
        description: `${nodes.length - 2} steps executed successfully`,
        type: 'success',
      })
    }, 3000)
  }

  // Export test
  const handleExport = () => {
    const exportData = {
      name: testName,
      description: testDescription,
      steps: nodes.map((node) => ({
        id: node.id,
        type: node.data.stepType,
        label: node.data.label,
        value: node.data.value,
        selector: node.data.selector,
        position: node.position,
      })),
      edges: edges.map((edge) => ({
        source: edge.source,
        target: edge.target,
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${testName.replace(/\s+/g, '-').toLowerCase()}-test.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading test...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-950 flex flex-col">
      {/* Compact Header */}
      <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GlassButton
              variant="ghost"
              size="icon"
              onClick={() => router.push('/tests')}
              className="h-8 w-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </GlassButton>

            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <input
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none"
                placeholder="Test Name"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <GlassBadge variant="info">
              {nodes.filter((n) => n.data.stepType !== 'start' && n.data.stepType !== 'end').length}{' '}
              steps
            </GlassBadge>

            <div className="flex gap-1">
              <GlassButton
                variant="ghost"
                size="icon"
                onClick={undo}
                disabled={historyIndex <= 0}
                className="h-8 w-8"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </GlassButton>

              <GlassButton
                variant="ghost"
                size="icon"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="h-8 w-8"
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </GlassButton>

              <GlassButton
                variant="ghost"
                size="icon"
                onClick={handleExport}
                className="h-8 w-8"
                title="Export Test"
              >
                <Download className="w-4 h-4" />
              </GlassButton>
            </div>

            <GlassButton variant="default" onClick={handleSave} loading={isSaving} size="sm">
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Save
            </GlassButton>

            <GlassButton variant="primary" onClick={handleRun} loading={isRunning} size="sm">
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Run
            </GlassButton>
          </div>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-950"
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
          }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#374151" />
          <Controls className="bg-gray-900 border-gray-800 [&>button]:bg-gray-800 [&>button]:border-gray-700 [&>button]:text-gray-400 [&>button:hover]:bg-gray-700" />
        </ReactFlow>
      </div>

      {/* Add Step Toolbar */}
      <TestToolbar onAddStep={onAddStep} />

      {/* Properties Panel */}
      <PropertiesPanel
        selectedNode={selectedNode}
        onUpdateNode={onUpdateNode}
        onDeleteNode={onDeleteNode}
      />
    </div>
  )
}

// Wrap with ReactFlowProvider
export default function TestBuilder() {
  return (
    <ReactFlowProvider>
      <TestBuilderContent />
    </ReactFlowProvider>
  )
}
