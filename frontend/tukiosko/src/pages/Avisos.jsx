"use client"

import * as React from "react"
import { useState } from "react"
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  ChevronDownIcon,
} from "lucide-react"

// ============================================================================
// Utility: cn (Reemplazo simple de clsx + twMerge)
// ============================================================================
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Card Components
// ============================================================================
function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "bg-white text-slate-950 flex flex-col gap-6 rounded-xl border border-slate-200 py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }) {
  return (
    <div
      className={cn("leading-none font-semibold text-slate-900", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }) {
  return (
    <div className={cn("px-6", className)} {...props} />
  )
}

// ============================================================================
// Avatar Components (Implementación Nativa)
// ============================================================================
function Avatar({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function AvatarImage({ className, src, alt, ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-slate-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Button Component (Sin Slot)
// ============================================================================
function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  const variantClasses = {
    default: "bg-[#1c2d47] text-white hover:bg-[#2a3f5f]",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-slate-200 bg-white hover:bg-slate-50",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "hover:bg-slate-100",
    link: "text-blue-600 underline-offset-4 hover:underline",
  }

  const sizeClasses = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "size-9",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}

// ============================================================================
// Input & Textarea Components
// ============================================================================
function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1c2d47] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "flex min-h-15 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1c2d47] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

// ============================================================================
// Select Component (Implementación Nativa Estilizada)
// ============================================================================
function Select({ value, onValueChange, children, className }) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn(
          "h-9 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-1 pr-10 text-sm shadow-sm outline-none focus:ring-1 focus:ring-[#1c2d47]",
          className
        )}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-2.5 size-4 opacity-50" />
    </div>
  )
}

// ============================================================================
// NoticesManager - Main Component
// ============================================================================
const initialNotices = [
  {
    id: 1,
    title: "System Maintenance",
    content: "The server will be down for 2 hours on Saturday for scheduled maintenance. Please save your work.",
    priority: "high",
    date: "Oct 12",
    isRead: false,
    author: "Admin",
  },
  {
    id: 2,
    title: "New Feature: Reports",
    content: "You can now export sales data to PDF. Check out the Reports section in your dashboard.",
    priority: "medium",
    date: "Oct 10",
    isRead: true,
    author: "Product",
  },
  {
    id: 3,
    title: "Team Meeting Reminder",
    content: "Don't forget the weekly sync meeting tomorrow at 10 AM. Agenda has been shared via email.",
    priority: "low",
    date: "Oct 8",
    isRead: true,
    author: "HR",
  },
  {
    id: 4,
    title: "Security Update Required",
    content: "Please update your password as part of our quarterly security protocol. Deadline is Oct 15.",
    priority: "high",
    date: "Oct 5",
    isRead: false,
    author: "Security",
  },
]

const priorityConfig = {
  high: {
    label: "!!!",
    className: "bg-red-100 text-red-700 border-red-200",
    icon: AlertTriangle,
  },
  medium: {
    label: "!!",
    className: "bg-orange-100 text-orange-700 border-orange-200",
    icon: AlertTriangle,
  },
  low: {
    label: "!",
    className: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Bell,
  },
}

function NoticeCard({ notice, onToggleRead, index }) {
  const priorityInfo = priorityConfig[notice.priority]
  const PriorityIcon = priorityInfo.icon

  return (
    <Card
      className={cn(
        "border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md",
        !notice.isRead && "border-l-4 border-l-[#1c2d47]"
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 shrink-0 border-2 border-gray-100">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${notice.author}&backgroundColor=1c2d47`}
                alt={notice.author}
              />
              <AvatarFallback className="bg-[#1c2d47] text-xs text-white">
                {notice.author.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                    priorityInfo.className
                  )}
                >
                  <PriorityIcon className="h-3 w-3" />
                  {priorityInfo.label}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-gray-600">
                {notice.content}
              </p>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {notice.date}
                </span>
                <span className="text-gray-300">•</span>
                <span>Posted by {notice.author}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onToggleRead}
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
              notice.isRead
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "border border-gray-200 bg-white text-gray-500 hover:border-green-300 hover:bg-green-50 hover:text-green-600"
            )}
          >
            <CheckCircle2
              className={cn(
                "h-4 w-4",
                notice.isRead ? "fill-green-500 text-green-700" : ""
              )}
            />
            {notice.isRead ? "Read" : "Mark Read"}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Avisos() {
  const [notices, setNotices] = useState(initialNotices)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [priority, setPriority] = useState("medium")

  const handlePostNotice = () => {
    if (!title.trim() || !content.trim()) return

    const newNotice = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      priority,
      isRead: false,
      author: "Admin",
    }

    setNotices([newNotice, ...notices])
    setTitle("")
    setContent("")
    setPriority("medium")
  }

  const toggleReadStatus = (id) => {
    setNotices(
      notices.map((notice) =>
        notice.id === id ? { ...notice, isRead: !notice.isRead } : notice
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1c2d47]">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notices Manager</h1>
            <p className="text-sm text-gray-500">
              Post and manage company announcements
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
          <Card className="h-fit border-gray-100 bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Send className="h-4 w-4 text-[#1c2d47]" />
                Post New Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <Input
                  placeholder="Enter notice title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Content</label>
                <Textarea
                  placeholder="Write your notice content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="resize-none border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Priority</label>
                <Select value={priority} onValueChange={setPriority}>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </Select>
              </div>
              <Button
                onClick={handlePostNotice}
                disabled={!title.trim() || !content.trim()}
                className="w-full"
              >
                Post Notice
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">All Notices</h2>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                {notices.length} notices
              </span>
            </div>

            <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-2">
              {notices.map((notice, index) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  onToggleRead={() => toggleReadStatus(notice.id)}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}