# shadcn/ui Architecture ✅

## 🎨 Philosophy: Libraries Over Custom Components

**Use battle-tested libraries, don't reinvent the wheel.**

- ✅ **shadcn/ui** as the foundation for ALL base components
- ✅ **Radix UI** primitives (powering shadcn)
- ✅ **shadcn plugins** for specialized components
- ❌ **NO custom base components** (button, input, dialog, etc.)

---

## 📦 Component Library Structure

### packages/ui/

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── base/                    # shadcn/ui components
│   │   │   ├── button.tsx          # From: npx shadcn add button
│   │   │   ├── input.tsx           # From: npx shadcn add input
│   │   │   ├── select.tsx          # From: npx shadcn add select
│   │   │   ├── dialog.tsx          # From: npx shadcn add dialog
│   │   │   ├── card.tsx            # From: npx shadcn add card
│   │   │   ├── table.tsx           # From: npx shadcn add table
│   │   │   ├── form.tsx            # From: npx shadcn add form
│   │   │   ├── label.tsx           # From: npx shadcn add label
│   │   │   ├── alert.tsx           # From: npx shadcn add alert
│   │   │   ├── badge.tsx           # From: npx shadcn add badge
│   │   │   ├── avatar.tsx          # From: npx shadcn add avatar
│   │   │   ├── skeleton.tsx        # From: npx shadcn add skeleton
│   │   │   ├── dropdown-menu.tsx   # From: npx shadcn add dropdown-menu
│   │   │   ├── popover.tsx         # From: npx shadcn add popover
│   │   │   ├── tooltip.tsx         # From: npx shadcn add tooltip
│   │   │   └── ...                 # 50+ components available
│   │   │
│   │   └── custom/                  # Your custom compositions
│   │       ├── data-table/          # Built on shadcn Table
│   │       │   ├── data-table.tsx
│   │       │   ├── data-table.test.tsx
│   │       │   └── index.ts
│   │       ├── form-field/          # Built on shadcn Input + Label
│   │       │   ├── form-field.tsx
│   │       │   └── index.ts
│   │       ├── page-header/         # Custom layout component
│   │       │   ├── page-header.tsx
│   │       │   └── index.ts
│   │       ├── user-dialog/         # Built on shadcn Dialog + Form
│   │       │   ├── user-dialog.tsx
│   │       │   └── index.ts
│   │       └── index.ts
│   │
│   ├── index.ts                     # Export base + custom
│   └── lib/
│       └── utils.ts                 # cn() helper from shadcn
│
├── components.json                  # shadcn config
├── tailwind.config.ts               # Tailwind with shadcn theme
└── package.json
```

---

## 🚀 Setup Guide

### 1. Initialize shadcn/ui

```bash
cd packages/ui
npx shadcn@latest init

# Follow prompts:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
# - Tailwind config: tailwind.config.ts
# - Components: src/components/base
# - Utils: src/lib/utils.ts
# - React Server Components: Yes
```

### 2. Install Base Components

```bash
# Forms
npx shadcn@latest add button input select textarea
npx shadcn@latest add form label checkbox radio-group switch

# Data Display
npx shadcn@latest add table card badge avatar separator skeleton

# Feedback
npx shadcn@latest add alert dialog toast sheet

# Navigation
npx shadcn@latest add dropdown-menu tabs breadcrumb pagination

# Overlays
npx shadcn@latest add popover tooltip hover-card
```

### 3. Package Structure

```json
// packages/ui/package.json
{
  "name": "@repo/ui",
  "dependencies": {
    "@radix-ui/react-slot": "^1.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.0"
  }
}
```

---

## 📝 Usage Patterns

### ✅ CORRECT: Use shadcn Base Components

```typescript
// apps/web/src/app/[locale]/dashboard/page.tsx
import { Button } from '@repo/ui/base/button';
import { Input } from '@repo/ui/base/input';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/base/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui/base/dialog';

export default function DashboardPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Search..." />
          <Button>Search</Button>
        </CardContent>
      </Card>

      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          {/* Content */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

### ✅ CORRECT: Compose Custom Components

```typescript
// packages/ui/src/components/custom/user-dialog/user-dialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../base/dialog';
import { Button } from '../../base/button';
import { Input } from '../../base/input';
import { Label } from '../../base/label';
import { useState } from 'react';

interface UserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: User) => void;
}

export function UserDialog({ user, open, onOpenChange, onSave }: UserDialogProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSave = () => {
    onSave({ ...user, name, email });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### ❌ WRONG: Creating Custom Base Components

```typescript
// ❌ DON'T DO THIS
export function MyButton() {
  return <button className="custom-button">Click</button>;
}

// ❌ DON'T DO THIS
export function MyInput() {
  return <input className="custom-input" />;
}

// ❌ DON'T DO THIS - Modifying shadcn base
// packages/ui/src/components/base/button.tsx
export const Button = () => {
  // Don't modify shadcn files!
};
```

---

## 🧩 Available shadcn Components

### Forms (10 components)
- Button, Input, Select, Textarea, Checkbox, RadioGroup, Switch, Slider, Label, Form

### Data Display (10 components)
- Table, Card, Badge, Avatar, Separator, Skeleton, Progress, Calendar, Accordion, Collapsible

### Feedback (7 components)
- Alert, AlertDialog, Toast, Dialog, Sheet, Popover, Tooltip

### Navigation (5 components)
- DropdownMenu, NavigationMenu, Tabs, Breadcrumb, Pagination

### Overlays (6 components)
- Dialog, Sheet, Popover, HoverCard, Tooltip, ContextMenu, Command

### Layout (4 components)
- AspectRatio, ScrollArea, Resizable, Separator

**Total: 50+ production-ready components**

---

## 🔌 shadcn Plugins & Extensions

Use these on top of shadcn for specialized needs:

### Data Tables
- `@tanstack/react-table` + shadcn Table
- `shadcn-table` - Pre-built table compositions

### Charts
- `recharts` + shadcn Card
- `shadcn-charts` - Pre-styled chart components

### Date/Time
- `react-day-picker` + shadcn Popover
- `shadcn-calendar` - Calendar with date range

### File Upload
- `react-dropzone` + shadcn Card
- `shadcn-uploader` - File upload with progress

### Rich Text
- `tiptap` + shadcn Dialog
- `plate` + shadcn Toolbar

---

## ✅ Quality Checklist

Before marking frontend work complete:

### Base Components
- [ ] Using shadcn/ui from `base/` folder
- [ ] NO custom base components created
- [ ] NO modifications to shadcn base files
- [ ] All shadcn components installed via CLI

### Custom Components
- [ ] Custom compositions in `custom/` folder
- [ ] Built using shadcn base components
- [ ] Have tests (`*.test.tsx`)
- [ ] Exported from `custom/index.ts`

### Usage
- [ ] Importing from `@repo/ui/base/{component}`
- [ ] Using shadcn variants correctly
- [ ] Applying custom styles with `cn()` helper
- [ ] Following Tailwind conventions

### Integration
- [ ] Works with Formik (for forms)
- [ ] Works with React Query (for data)
- [ ] Works with next-intl (for i18n)
- [ ] Matches UX design exactly

---

## 🎯 Benefits

### For Developers
- **No boilerplate** - 50+ components ready to use
- **Consistent API** - All components follow same patterns
- **Accessible** - Built on Radix UI (WCAG compliant)
- **Customizable** - Tailwind for styling
- **Type-safe** - Full TypeScript support

### For Maintainers
- **No custom code** - Less to maintain
- **Community support** - Active ecosystem
- **Easy updates** - `npx shadcn@latest diff`
- **Well documented** - Official docs + examples

### For Users
- **Professional UI** - Battle-tested components
- **Accessible** - Keyboard navigation, screen readers
- **Consistent** - Same patterns across all apps
- **Fast** - Optimized for performance

---

## 🚫 What NOT to Do

❌ Don't create custom button, input, select, etc.
❌ Don't modify shadcn base component files
❌ Don't use other UI libraries (MUI, Ant Design, Chakra)
❌ Don't reinvent components shadcn provides
❌ Don't skip accessibility (shadcn handles it)

---

## 📚 Resources

- **shadcn/ui**: https://ui.shadcn.com
- **Radix UI**: https://radix-ui.com
- **Components**: https://ui.shadcn.com/docs/components
- **Examples**: https://ui.shadcn.com/examples
- **Themes**: https://ui.shadcn.com/themes

---

**See `.agent-prompts/senior-frontend-agent-prompt.md` for complete patterns**
