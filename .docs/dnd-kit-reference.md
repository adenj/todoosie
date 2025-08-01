# @dnd-kit Documentation Reference

This document contains key code snippets and examples from the official @dnd-kit library documentation.

## Installation

```shell
npm install @dnd-kit/core
npm install @dnd-kit/sortable
npm install @dnd-kit/modifiers
```

## Basic Setup

### Core DndContext Setup
```tsx
import { DndContext } from '@dnd-kit/core'

function App() {
  return (
    <DndContext
      onDragEnd={handleDragEnd}
    >
      {/* Your draggable/droppable components */}
    </DndContext>
  )
}
```

### Basic Draggable Component
```tsx
import { useDraggable } from '@dnd-kit/core'

function Draggable(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform
  } = useDraggable({ id: props.id })

  return (
    <div ref={setNodeRef}>
      Draggable element
      <button
        {...listeners}
        {...attributes}
        ref={setActivatorNodeRef}
      >
        :: Drag Handle
      </button>
    </div>
  )
}
```

### Basic Droppable Component
```tsx
import { useDroppable } from '@dnd-kit/core'

function Droppable() {
  const { setNodeRef } = useDroppable({
    id: 'droppable',
    data: {
      accepts: ['type1', 'type2'],
    },
  })

  return <div ref={setNodeRef}>Drop Zone</div>
}
```

## Sortable Implementation

### SortableContext Setup
```tsx
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

function SortableList({ items }) {
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map(id => (
          <SortableItem key={id} id={id} />
        ))}
      </SortableContext>
    </DndContext>
  )
}
```

### Sortable Item Component
```tsx
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/* Item content */}
    </div>
  )
}
```

## Advanced Features

### Custom Data and Event Handling
```tsx
function App() {
  return (
    <DndContext
      onDragEnd={({active, over}) => {
        if (over?.data.current.accepts.includes(active.data.current.type)) {
          // Handle drop logic
        }
      }}
    >
      {/* Components */}
    </DndContext>
  )
}
```

### Sensors Configuration
```tsx
import { useSensors, useSensor, PointerSensor, TouchSensor, MouseSensor } from '@dnd-kit/core'

const sensors = useSensors(
  useSensor(MouseSensor, {
    activationConstraint: {
      distance: { y: 10 },
    },
  }),
  useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: { y: 15, x: 5 },
    },
  }),
)
```

### Modifiers
```tsx
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'

function App() {
  return (
    <DndContext modifiers={[restrictToVerticalAxis]}>
      {/* ... */}
      <DragOverlay modifiers={[restrictToWindowEdges]}>
        {/* ... */}
      </DragOverlay>
    </DndContext>
  )
}
```

### Auto-scroll Configuration
```tsx
<DndContext
  autoScroll={{
    thresholds: {
      x: 0.1, // Left and right 10% of container
      y: 0.25, // Top and bottom 25% of container
    },
    acceleration: 5,
    interval: 10,
    layoutShiftCompensation: { x: false, y: true }
  }}
>
```

### Monitoring Drag Events
```tsx
import { useDndMonitor } from '@dnd-kit/core'

function Component() {
  useDndMonitor({
    onDragStart(event) {},
    onDragMove(event) {},
    onDragOver(event) {},
    onDragEnd(event) {},
    onDragCancel(event) {},
  })
}
```

### Real-time Array Reordering
```tsx
import { arrayMove } from '@dnd-kit/sortable'

function handleDragEnd(event) {
  const { active, over } = event

  if (active.id !== over.id) {
    setItems((items) => {
      const oldIndex = items.indexOf(active.id)
      const newIndex = items.indexOf(over.id)

      return arrayMove(items, oldIndex, newIndex)
    })
  }
}
```

## TypeScript Types

### UniqueIdentifier
```typescript
import type { UniqueIdentifier } from '@dnd-kit/core'

const [items, setItems] = useState<UniqueIdentifier[]>(['A', 'B', 'C'])
```

### Disabled Configuration
```typescript
interface Disabled {
  draggable?: boolean
  droppable?: boolean
}
```

### Distance Measurement
```typescript
type DistanceMeasurement =
  | number
  | {x: number}
  | {y: number}
  | {x: number, y: number}
```

## Collision Detection

### Built-in Strategies
- `rectIntersection` - Default collision detection
- `closestCenter` - Closest to center point
- `closestCorners` - Closest to corner coordinates
- `pointerWithin` - Pointer must be within droppable bounds

### Custom Collision Detection
```tsx
function customCollisionDetection(args) {
  // Return array of Collision objects
  return [{ id: 'droppable-1' }]
}

<DndContext collisionDetection={customCollisionDetection}>
```

## Best Practices

1. **Use unique IDs** - Each draggable/droppable needs a unique identifier
2. **Handle drag handles** - Use `setActivatorNodeRef` for better UX
3. **Optimize with sensors** - Configure activation constraints to prevent accidental drags
4. **Add visual feedback** - Use `DragOverlay` for consistent drag previews
5. **Type everything** - Use TypeScript interfaces for better developer experience

## Common Patterns

### Array Reordering with Position Persistence
```tsx
function handleDragEnd(event) {
  const { active, over } = event

  if (active.id !== over.id) {
    const oldIndex = items.findIndex(item => item.id === active.id)
    const newIndex = items.findIndex(item => item.id === over.id)
    const newItems = arrayMove(items, oldIndex, newIndex)
    
    // Update positions in database
    updateItemPositions(newItems)
    setItems(newItems)
  }
}
```

### Conditional Drop Zones
```tsx
function handleDragEnd({ active, over }) {
  if (over?.data.current.accepts?.includes(active.data.current.type)) {
    // Valid drop
  } else {
    // Invalid drop - show error or revert
  }
}
```