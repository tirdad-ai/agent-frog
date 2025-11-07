# @repo/ui

shadcn/ui component library for Tirdad Turbo monorepo with consistent design system, Tailwind CSS, and TypeScript support.

## 📋 Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [Components](#components)
- [Theming](#theming)
- [Usage Examples](#usage-examples)
- [Customization](#customization)
- [Best Practices](#best-practices)

## 🎯 Overview

This package provides a comprehensive UI component library featuring:

- **shadcn/ui components** - High-quality, accessible React components
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI primitives** - Unstyled, accessible components
- **TypeScript support** - Full type safety and IntelliSense
- **Dark mode** - Built-in theme switching
- **Customizable** - Easy to extend and modify components

## 📦 Installation

This package is automatically installed as a workspace dependency. To add it to a new app:

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  }
}
```

### Required Dependencies

The following peer dependencies are required in your app:

```json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.0.0"
  }
}
```

## ⚙️ Configuration

### Tailwind CSS Setup

Add the ui package to your Tailwind config:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Include ui package components
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("@repo/ui/tailwind")],
  theme: {
    extend: {
      // Your custom theme extensions
    },
  },
};
```

### CSS Imports

Import the base styles in your app:

```css
/* globals.css or similar */
@import "@repo/ui/globals.css";

/* Or import individual stylesheets */
@import "@repo/ui/components.css";
@import "@repo/ui/base.css";
```

### Theme Provider Setup

Wrap your app with the theme provider for dark mode support:

```tsx
// app/layout.tsx or _app.tsx
import { ThemeProvider } from "@repo/ui/theme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## 🧩 Components

### Form Components

```tsx
import {
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
} from "@repo/ui/components";

// Usage example
<div className="space-y-4">
  <div>
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" placeholder="Enter your email" />
  </div>

  <div>
    <Label htmlFor="message">Message</Label>
    <Textarea id="message" placeholder="Your message..." />
  </div>

  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Select option" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="option1">Option 1</SelectItem>
      <SelectItem value="option2">Option 2</SelectItem>
    </SelectContent>
  </Select>

  <Button type="submit">Submit</Button>
</div>;
```

### Layout Components

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Container,
} from "@repo/ui/components";

<Container>
  <Card>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <CardDescription>Card description goes here</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Card content...</p>
    </CardContent>
    <Separator />
    <CardFooter>
      <Button>Action</Button>
    </CardFooter>
  </Card>
</Container>;
```

### Navigation Components

```tsx
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/ui/components'

// Navigation Menu
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid gap-3 p-6 md:w-[400px]">
          <NavigationMenuLink href="/product-1">
            Product 1
          </NavigationMenuLink>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>

// Breadcrumb
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Feedback Components

```tsx
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Progress,
  Skeleton,
  Spinner,
  Toast,
  useToast,
} from '@repo/ui/components'

// Alert
<Alert>
  <AlertTitle>Heads up!</Alert>
  <AlertDescription>
    You can add components to your app using the CLI.
  </AlertDescription>
</Alert>

// Toast usage
function Component() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Success!",
          description: "Your action was completed.",
        })
      }}
    >
      Show toast
    </Button>
  )
}

// Loading states
<div className="space-y-2">
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[200px]" />
</div>

<Progress value={33} className="w-[60%]" />
```

### Dialog & Overlay Components

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/ui/components'

// Dialog
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Continue</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Tooltip
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      <p>Tooltip content</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Data Display Components

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components'

// Table
<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>

// Tabs
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account content</TabsContent>
  <TabsContent value="password">Password content</TabsContent>
</Tabs>
```

## 🎨 Theming

### Color System

The UI library uses a semantic color system with CSS variables:

```css
/* Light theme */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;

  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;

  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;

  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;

  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;

  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
}

/* Dark theme */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... other dark theme variables */
}
```

### Custom Colors

Extend the color palette in your Tailwind config:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
      },
    },
  },
};
```

### Theme Toggle

Use the built-in theme toggle component:

```tsx
import { ThemeToggle } from "@repo/ui/components";

// Renders a button that toggles between light/dark/system
<ThemeToggle />;
```

## 🚀 Usage Examples

### Complete Form Example

```tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from "@repo/ui/components";

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  role: z.string(),
});

export function UserForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      role: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Success!",
      description: "User created successfully.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create User</Button>
      </form>
    </Form>
  );
}
```

### Dashboard Layout Example

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Separator,
  Badge,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components";

export function Dashboard() {
  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back!</p>
        </div>
        <Button>New Project</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Badge variant="secondary">+20.1%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user interactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/user1.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">
                  Completed a task
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
```

## 🔧 Customization

### Component Variants

Most components support multiple variants through the `cva` (class-variance-authority) system:

```tsx
import { Button } from '@repo/ui/components'

// Different variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Different sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">👍</Button>
```

### Custom Components

Create custom components that inherit the design system:

```tsx
// components/custom-card.tsx
import { cn } from "@repo/ui/utils";
import { Card, CardProps } from "@repo/ui/components";

interface CustomCardProps extends CardProps {
  highlight?: boolean;
}

export function CustomCard({
  className,
  highlight,
  ...props
}: CustomCardProps) {
  return (
    <Card
      className={cn("relative", highlight && "ring-2 ring-primary", className)}
      {...props}
    />
  );
}
```

### Adding New Components

To add a new shadcn/ui component:

1. **Copy the component** from [shadcn/ui](https://ui.shadcn.com/docs/components/):

```bash
# From packages/ui directory
npx shadcn-ui@latest add button
```

2. **Export the component**:

```tsx
// packages/ui/src/components/index.ts
export { Button } from "./button";
export type { ButtonProps } from "./button";
```

3. **Add to package exports**:

```json
// packages/ui/package.json
{
  "exports": {
    "./components": "./src/components/index.ts",
    "./components/*": "./src/components/*.ts"
  }
}
```

## 🎯 Best Practices

### 1. Consistent Spacing

Use the spacing scale consistently:

```tsx
// ✅ Good - Use consistent spacing classes
<div className="space-y-4">
  <div className="p-6">
    <h2 className="mb-2">Title</h2>
    <p className="mb-4">Description</p>
  </div>
</div>

// ❌ Bad - Inconsistent spacing
<div style={{ marginBottom: '15px' }}>
  <div style={{ padding: '25px' }}>
```

### 2. Semantic Color Usage

Use semantic color variables instead of specific colors:

```tsx
// ✅ Good - Semantic colors
<Button className="bg-destructive text-destructive-foreground">
  Delete
</Button>

// ❌ Bad - Hardcoded colors
<Button className="bg-red-500 text-white">
  Delete
</Button>
```

### 3. Responsive Design

Components are mobile-first by default:

```tsx
// ✅ Good - Mobile-first responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>

// ✅ Good - Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive Heading
</h1>
```

### 4. Accessibility

Components include accessibility features by default:

```tsx
// ✅ Good - Proper labeling
<div>
  <Label htmlFor="email">Email Address</Label>
  <Input
    id="email"
    type="email"
    placeholder="Enter your email"
    aria-describedby="email-description"
  />
  <p id="email-description" className="text-sm text-muted-foreground">
    We'll never share your email
  </p>
</div>
```

### 5. Form Validation

Use proper form validation with react-hook-form:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Good - Proper validation
const form = useForm({
  resolver: zodResolver(schema),
  mode: "onBlur", // Validate on blur for better UX
});
```

## 🧪 Testing

Test components using the provided utilities:

```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "@repo/ui/components";

test("button renders correctly", () => {
  render(<Button>Click me</Button>);

  const button = screen.getByRole("button", { name: /click me/i });
  expect(button).toBeInTheDocument();
});
```

## 🔄 Updates

To update to the latest shadcn/ui components:

```bash
cd packages/ui
npx shadcn-ui@latest add --all --overwrite
```

## 🐛 Troubleshooting

### Common Issues

1. **Styles not loading**
   - Check Tailwind config includes ui package path
   - Verify CSS imports are correct
   - Ensure all peer dependencies are installed

2. **TypeScript errors**
   - Run `pnpm build` in ui package
   - Restart TypeScript server
   - Check component imports

3. **Dark mode not working**
   - Verify ThemeProvider is wrapping your app
   - Check `suppressHydrationWarning` on html tag
   - Ensure Tailwind darkMode is set to 'class'

### Performance

For optimal performance:

- Import only the components you need
- Use `dynamic` imports for heavy components
- Implement proper memoization for complex forms

## 📚 Learn More

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)

---

**Need help?** Check the monorepo's main README or open an issue in the repository.
