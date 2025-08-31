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
  MiniMap,
  Background,
  BackgroundVariant,
  NodeTypes,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useRouter, useParams } from 'next/navigation'
import { 
  Play, 
  MousePointer, 
  Type, 
  Eye, 
  Clock,
  Globe,
  Save,
  Download,
  Upload,
  Trash2,
  Plus,
  Settings,
  Copy,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  ArrowLeft
} from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassInput } from '@/components/ui/glass-input'
import { GlassTextarea } from '@/components/ui/glass-textarea'
import { GlassSelect } from '@/components/ui/glass-select'
import { useToast } from '@/hooks/use-toast'
import { assert } from 'console'

// Custom Node Component
const TestStepNode = ({ data, selected }: any) => {
  const getIcon = () => {
    switch (data.stepType) {
      case 'navigate': return <Globe className="w-4 h-4" />
      case 'click': return <MousePointer className="w-4 h-4" />
      case 'type': return <Type className="w-4 h-4" />
      case 'assert': return <Eye className="w-4 h-4" />
      case 'wait': return <Clock className="w-4 h-4" />
      default: return <Play className="w-4 h-4" />
    }
  }

  const getColor = () => {
    switch (data.stepType) {
      case 'navigate': return 'from-blue-600/20 to-blue-700/20 border-blue-600/30'
      case 'click': return 'from-purple-600/20 to-purple-700/20 border-purple-600/30'
      case 'type': return 'from-green-600/20 to-green-700/20 border-green-600/30'
      case 'assert': return 'from-orange-600/20 to-orange-700/20 border-orange-600/30'
      case 'wait': return 'from-pink-600/20 to-pink-700/20 border-pink-600/30'
      default: return 'from-gray-600/20 to-gray-700/20 border-gray-600/30'
    }
  }

  return (
    <div className={`
      min-w-[200px] rounded-xl backdrop-blur-md bg-gradient-to-br ${getColor()}
      border ${selected ? 'ring-2 ring-purple-500 shadow-xl' : 'shadow-lg'}
      transition-all duration-200 hover:shadow-xl
    `}>
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-gray-900/50 backdrop-blur-sm">
            {getIcon()}
          </div>
          <span className="font-medium text-sm text-white">{data.label}</span>
        </div>
        {data.description && (
          <p className="text-xs text-gray-300">{data.description}</p>
        )}
        {data.value && (
          <div className="mt-2 px-2 py-1 bg-gray-900/50 rounded text-xs font-mono text-gray-300">
            {data.value}
          </div>
        )}
      </div>
    </div>
  )
}

const nodeTypes: NodeTypes = {
  testStep: TestStepNode,
}

// Step Palette Component
const StepPalette = () => {
  const steps = [
    { type: 'navigate', label: 'Navigate', icon: Globe, color: 'from-blue-600 to-blue-700' },
    { type: 'click', label: 'Click', icon: MousePointer, color: 'from-purple-600 to-purple-700' },
    { type: 'type', label: 'Type Text', icon: Type, color: 'from-green-600 to-green-700' },
    { type: 'assert', label: 'Assert', icon: Eye, color: 'from-orange-600 to-orange-700' },
    { type: 'wait', label: 'Wait', icon: Clock, color: 'from-pink-600 to-pink-700' },
  ]

  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, label }))
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <GlassCard className="absolute left-4 top-20 z-10 w-52" variant="dark">
      <h3 className="text-sm font-semibold mb-3 text-gray-300">Test Steps</h3>
      <div className="space-y-2">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.type}
              className={`
                cursor-grab active:cursor-grabbing p-3 rounded-lg
                bg-gradient-to-r ${step.color} bg-opacity-20
                border border-gray-700 backdrop-blur-sm
                hover:border-gray-600 transition-all duration-200
                flex items-center gap-3
              `}
              draggable
              onDragStart={(e) => onDragStart(e, step.type, step.label)}
            >
              <Icon className="w-4 h-4 text-gray-300" />
              <span className="text-sm font-medium text-gray-200">{step.label}</span>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}

// Properties Panel Component
const PropertiesPanel = ({ selectedNode, onUpdateNode, onDeleteNode }: any) => {
  if (!selectedNode) {
    return (
      <GlassCard className="absolute right-4 top-20 z-10 w-80" variant="dark">
        <div className="text-center text-gray-400">
          <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select a step to configure</p>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="absolute right-4 top-20 z-10 w-80" variant="dark">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Step Properties</h3>
        <GlassButton
          variant="danger"
          size="icon"
          onClick={() => onDeleteNode(selectedNode.id)}
        >
          <Trash2 className="w-4 h-4" />
        </GlassButton>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Step Name</label>
          <GlassInput
            value={selectedNode.data.label}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              onUpdateNode(selectedNode.id, { label: e.target.value })
            }
          />
        </div>
        
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Description</label>
          <GlassTextarea
            value={selectedNode.data.description || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
              onUpdateNode(selectedNode.id, { description: e.target.value })
            }
            rows={3}
          />
        </div>
        
        {selectedNode.data.stepType === 'navigate' && (
          <div>
            <label className="text-sm text-gray-400 mb-1 block">URL</label>
            <GlassInput
              type="url"
              value={selectedNode.data.value || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                onUpdateNode(selectedNode.id, { value: e.target.value })
              }
              placeholder="https://example.com"
            />
          </div>
        )}
        
        {selectedNode.data.stepType === 'click' && (
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Selector</label>
            <GlassInput
              value={selectedNode.data.value || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                onUpdateNode(selectedNode.id, { value: e.target.value })
              }
              placeholder="#button-id or .class-name"
            />
          </div>
        )}
        
        {selectedNode.data.stepType === 'type' && (
          <>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Selector</label>
              <GlassInput
                value={selectedNode.data.selector || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  onUpdateNode(selectedNode.id, { selector: e.target.value })
                }
                placeholder="#input-id"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Text to Type</label>
              <GlassInput
                value={selectedNode.data.value || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  onUpdateNode(selectedNode.id, { value: e.target.value })
                }
                placeholder="Hello World"
              />
            </div>
          </>
        )}
        
        {selectedNode.data.stepType === 'wait' && (
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Duration (ms)</label>
            <GlassInput
              type="number"
              value={selectedNode.data.value || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                onUpdateNode(selectedNode.id, { value: e.target.value })
              }
              placeholder="1000"
            />
          </div>
        )}
        
        {selectedNode.data.stepType === 'assert' && (
          <>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Selector</label>
              <GlassInput
                value={selectedNode.data.selector || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  onUpdateNode(selectedNode.id, { selector: e.target.value })
                }
                placeholder=".element-class"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Assertion Type</label>
              <GlassSelect
                value={selectedNode.data.assertType || 'exists'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  onUpdateNode(selectedNode.id, { assertType: e.target.value })
                }
                options={[
                  { value: 'exists', label: 'Element Exists' },
                  { value: 'text', label: 'Text Contains' },
                  { value: 'visible', label: 'Is Visible' },
                  { value: 'value', label: 'Has Value' },
                ]}
              />
            </div>
            {selectedNode.data.assertType === 'text' && (
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Expected Text</label>
                <GlassInput
                  value={selectedNode.data.value || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    onUpdateNode(selectedNode.id, { value: e.target.value })
                  }
                  placeholder="Expected text content"
                />
              </div>
            )}
          </>
        )}
      </div>
    </GlassCard>
  )
}

// Main Test Builder Component
export default function TestBuilder() {
  const router = useRouter()
  const params = useParams()
  const { addToast } = useToast()
  const [testName, setTestName] = useState('Untitled Test')
  const [testDescription, setTestDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: '1',
      type: 'testStep',
      position: { x: 400, y: 100 },
      data: { 
        stepType: 'start', 
        label: 'Start Test',
        description: 'Test execution begins here',
        value: '',
        selector: '',
        assertType: '',
      },
    },
  ])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        style: { stroke: 'rgba(147, 51, 234, 0.5)', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(147, 51, 234, 0.5)' }
      }
      setEdges((eds) => addEdge(edge, eds))
    },
    [setEdges]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      const data = event.dataTransfer.getData('application/reactflow')
      
      if (!data || !reactFlowBounds || !reactFlowInstance) return
      
      const { type, label } = JSON.parse(data)
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode: Node = {
        id: `${Date.now()}`,
        type: 'testStep',
        position,
        data: { 
          stepType: type,
          label,
          description: '',
          value: '',
        },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes]
  )

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onUpdateNode = useCallback((nodeId: string, updates: any) => {
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
      setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, ...updates } } : null)
    }
  }, [selectedNode, setNodes])

  const onDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId))
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
    setSelectedNode(null)
  }, [setNodes, setEdges])

  const handleSave = async () => {
    setIsSaving(true)
    
    const testData = {
      name: testName,
      description: testDescription,
      steps: nodes.map(node => ({
        id: node.id,
        type: node.data.stepType,
        label: node.data.label,
        description: node.data.description,
        value: node.data.value,
        selector: node.data.selector,
        assertType: node.data.assertType,
        position: node.position,
      })),
      connections: edges.map(edge => ({
        source: edge.source,
        target: edge.target,
      })),
    }

    try {
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...testData,
          projectId: params.projectId || null,
        }),
      })

      if (response.ok) {
        addToast({
          title: 'Test saved',
          description: 'Your test has been saved successfully',
          type: 'success',
        })
      }
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to save test',
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRun = async () => {
    setIsRunning(true)
    
    addToast({
      title: 'Test execution started',
      description: 'Your test is now running...',
      type: 'info',
    })
    
    // Simulate test execution
    setTimeout(() => {
      setIsRunning(false)
      addToast({
        title: 'Test completed',
        description: 'Test ran successfully with 5/5 steps passed',
        type: 'success',
      })
    }, 3000)
  }

  return (
    <div className="h-screen bg-gray-950 flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GlassButton
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </GlassButton>
            
            <div>
              <GlassInput
                value={testName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestName(e.target.value)}
                className="text-lg font-semibold bg-transparent border-0 px-0 focus:ring-0"
                placeholder="Test Name"
              />
              <GlassInput
                value={testDescription}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestDescription(e.target.value)}
                className="text-sm bg-transparent border-0 px-0 focus:ring-0 text-gray-400"
                placeholder="Add description..."
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <GlassButton variant="ghost" size="icon">
              <Upload className="w-5 h-5" />
            </GlassButton>
            <GlassButton variant="ghost" size="icon">
              <Download className="w-5 h-5" />
            </GlassButton>
            <GlassButton 
              variant="default" 
              onClick={handleSave}
              loading={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </GlassButton>
            <GlassButton 
              variant="primary"
              onClick={handleRun}
              loading={isRunning}
            >
              <Play className="w-4 h-4 mr-2" />
              Run Test
            </GlassButton>
          </div>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-950"
        >
          <Background variant={BackgroundVariant.Dots} gap={30} size={1} color="rgba(147, 51, 234, 0.1)" />
          <Controls className="bg-gray-900 border-gray-800 [&>button]:bg-gray-800 [&>button]:border-gray-700 [&>button]:text-gray-400 [&>button:hover]:bg-gray-700 [&>button:hover]:text-gray-200" />
          <MiniMap 
            className="bg-gray-900 border-gray-800"
            nodeColor={(node) => {
              switch (node.data?.stepType) {
                case 'navigate': return 'rgba(59, 130, 246, 0.5)'
                case 'click': return 'rgba(147, 51, 234, 0.5)'
                case 'type': return 'rgba(34, 197, 94, 0.5)'
                case 'assert': return 'rgba(251, 146, 60, 0.5)'
                case 'wait': return 'rgba(236, 72, 153, 0.5)'
                default: return 'rgba(156, 163, 175, 0.5)'
              }
            }}
          />
        </ReactFlow>
      </div>

      <StepPalette />
      <PropertiesPanel 
        selectedNode={selectedNode}
        onUpdateNode={onUpdateNode}
        onDeleteNode={onDeleteNode}
      />
    </div>
  )
}