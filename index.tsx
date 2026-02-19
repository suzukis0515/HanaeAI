import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  LayoutDashboard,
  Users,
  Search,
  Trello,
  Bell,
  User,
  Plus,
  Filter,
  MoreHorizontal,
  Mail,
  Briefcase,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Sparkles,
  X,
  ArrowUpRight,
  Calendar,
  Settings,
  ChevronDown,
  Paperclip,
  Send,
  Bot,
  Link,
  CheckSquare,
  MessageCircle,
  MoreVertical
} from "lucide-react";

// --- Mock Data ---

const MOCK_PROJECTS = [
  { id: 1, name: "SaaS営業支援システム開発", client: "株式会社アルファ", price: "800万円", status: "商談中", date: "2023-10-25", skills: ["React", "Node.js"] },
  { id: 2, name: "ECサイトリニューアル", client: "ベータ商事", price: "1,200万円", status: "提案中", date: "2023-10-24", skills: ["Shopify", "Design"] },
  { id: 3, name: "社内DX基盤構築", client: "ガンマ工業", price: "2,500万円", status: "成約", date: "2023-10-20", skills: ["AWS", "Python"] },
  { id: 4, name: "AIチャットボット導入", client: "デルタ銀行", price: "500万円", status: "アプローチ", date: "2023-10-26", skills: ["OpenAI", "Python"] },
  { id: 5, name: "物流管理アプリ改修", client: "イプシロン運送", price: "900万円", status: "駆け引き", date: "2023-10-22", skills: ["Flutter", "Firebase"] },
];

const MOCK_TALENTS = [
  { id: 1, name: "佐藤 健一", type: "フリーランス", skillSummary: "フロントエンド全般, リーダー経験あり", price: "90万円/月", status: "緊急度低い 重要度高い", date: "2023-10-25", skills: ["React", "TypeScript", "Next.js"] },
  { id: 2, name: "鈴木 花子", type: "BP", skillSummary: "サーバーサイド強み, AWS設計", price: "100万円/月", status: "緊急度高い 重要度低い", date: "2023-10-24", skills: ["Go", "AWS", "Docker"] },
  { id: 3, name: "高橋 誠", type: "プロパー", skillSummary: "PM経験10年, 大規模開発", price: "140万円/月", status: "緊急度高い 重要度高い", date: "2023-10-20", skills: ["PMBOK", "JIRA"] },
];

const MOCK_TASKS = [
  { id: 1, title: "アルファ社へ見積書送付", deadline: "今日", status: "未完了", type: "project", linkId: 1, priority: "high" },
  { id: 2, title: "佐藤さん面談日程調整", deadline: "明日", status: "未完了", type: "talent", linkId: 1, priority: "medium" },
  { id: 3, title: "ベータ商事 提案資料修正", deadline: "2023-10-28", status: "進行中", type: "project", linkId: 2, priority: "high" },
  { id: 4, title: "10月度請求書作成", deadline: "2023-10-31", status: "未完了", type: "other", linkId: null, priority: "low" },
];

const MOCK_EMAILS = [
  { id: 1, subject: "Re: 見積もりについてのご相談", sender: "田中 (株式会社アルファ)", date: "10:30", taskId: 1, isNew: true, body: "お世話になっております。頂いた見積もりの件ですが..." },
  { id: 2, subject: "面談希望日時のご連絡", sender: "佐藤 健一", date: "昨日", taskId: 2, isNew: false, body: "お疲れ様です。面談の件、以下の日程で..." },
  { id: 3, subject: "【重要】仕様変更の件", sender: "山田 (ベータ商事)", date: "10/24", taskId: 3, isNew: true, body: "先日の打ち合わせに基づき、仕様を変更しました..." },
  { id: 4, subject: "ご挨拶", sender: "新規顧客", date: "10/22", taskId: null, isNew: false, body: "はじめまして..." },
];

// --- Components ---

const Badge = ({ children, color = "gray" }: { children?: React.ReactNode, color?: string }) => {
  const colors: Record<string, string> = {
    gray: "bg-gray-100 text-gray-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
    purple: "bg-purple-100 text-purple-800",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.gray}`}>{children}</span>;
};

const Card = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>{children}</div>
);

const Button = ({ children, variant = "primary", className = "", onClick, icon: Icon, size="md" }: any) => {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizes: Record<string, string> = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
  };
  const variants: Record<string, string> = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} onClick={onClick}>
      {Icon && <Icon className={`mr-2 ${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}`} />}
      {children}
    </button>
  );
};

// --- Task Detail Modal ---

const TaskDetailModal = ({ task, onClose }: { task: any, onClose: () => void }) => {
  // Mock data for the modal
  const mockComments = [
    { id: 1, user: "山田 太郎", avatar: "山", text: "先方から資料届きました。確認お願いします。", time: "2時間前" },
    { id: 2, user: "佐藤 健一", avatar: "佐", text: "確認しました。修正箇所をまとめました。", time: "1時間前" },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start bg-white shrink-0">
          <div className="flex items-center gap-3">
             <button className="p-1.5 hover:bg-green-50 text-green-600 rounded-full border border-green-200 transition">
                <CheckCircle2 className="w-5 h-5" />
             </button>
             <div>
                <span className="text-xs text-gray-500 font-mono">TASK-{task.id}</span>
                <h2 className="text-xl font-bold text-gray-900 leading-tight">{task.title}</h2>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition"><Link className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition"><MoreHorizontal className="w-5 h-5" /></button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content (Left) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
             
             {/* Meta Info Grid (Mobile friendly) */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-gray-100">
                <div>
                   <label className="text-xs font-medium text-gray-500 block mb-1">担当者</label>
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                        {task.assignee ? task.assignee[0] : '未'}
                      </div>
                      <span className="text-sm text-gray-700">{task.assignee || '未設定'}</span>
                   </div>
                </div>
                <div>
                   <label className="text-xs font-medium text-gray-500 block mb-1">期限</label>
                   <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className={task.deadline === '今日' ? 'text-red-600 font-bold' : ''}>{task.deadline || task.date || '未設定'}</span>
                   </div>
                </div>
                 <div>
                   <label className="text-xs font-medium text-gray-500 block mb-1">ステータス</label>
                   <Badge color="blue">{task.status}</Badge>
                </div>
                <div>
                   <label className="text-xs font-medium text-gray-500 block mb-1">優先度</label>
                   <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : 'bg-blue-400'}`} />
                      <span className="text-sm text-gray-700 capitalize">{task.priority || 'Normal'}</span>
                   </div>
                </div>
             </div>

             {/* Description */}
             <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                   <FileText className="w-4 h-4 text-gray-400" />
                   説明
                </h3>
                <div className="min-h-[80px] text-gray-600 text-sm leading-relaxed p-3 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 transition cursor-text">
                   クライアントへの提案資料作成と、社内レビューの実施をお願いします。<br/>
                   前回のフィードバックを反映させること。
                </div>
             </div>

             {/* Hanae-san AI Section */}
             <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition">
                  <Sparkles className="w-12 h-12 text-indigo-100" />
                </div>
                <div className="flex items-center gap-2 mb-3 relative z-10">
                   <div className="bg-white p-1.5 rounded-lg shadow-sm">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                   </div>
                   <span className="font-bold text-indigo-900 text-sm">はなえさんAIのアシスタント</span>
                </div>
                <p className="text-xs text-indigo-800 mb-4 relative z-10">
                   このタスクの進捗はいかがですか？次のアクションを提案できます。
                </p>
                <div className="flex flex-wrap gap-2 relative z-10">
                   <button className="bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-2 rounded-lg border border-indigo-200 shadow-sm transition flex items-center">
                      <MessageSquare className="w-3 h-3 mr-1.5" />
                      メール文案を作成
                   </button>
                   <button className="bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-2 rounded-lg border border-indigo-200 shadow-sm transition flex items-center">
                      <CheckSquare className="w-3 h-3 mr-1.5" />
                      ネクストアクション提案
                   </button>
                   <button className="bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-2 rounded-lg border border-indigo-200 shadow-sm transition flex items-center">
                      <LayoutDashboard className="w-3 h-3 mr-1.5" />
                      状況を整理
                   </button>
                </div>
             </div>

             {/* Activity / Chat */}
             <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                   <MessageCircle className="w-4 h-4 text-gray-400" />
                   アクティビティ
                </h3>
                
                <div className="space-y-4 mb-4">
                   {mockComments.map(comment => (
                      <div key={comment.id} className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                            {comment.avatar}
                         </div>
                         <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                               <span className="text-sm font-bold text-gray-900">{comment.user}</span>
                               <span className="text-xs text-gray-400">{comment.time}</span>
                            </div>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-r-lg rounded-bl-lg">
                               {comment.text}
                            </p>
                         </div>
                      </div>
                   ))}
                </div>
                
                <div className="flex gap-3 items-start">
                   <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      私
                   </div>
                   <div className="flex-1 relative">
                      <textarea 
                         className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none h-20 transition"
                         placeholder="コメントを入力..."
                      />
                      <div className="absolute bottom-2 right-2 flex gap-2">
                         <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"><Paperclip className="w-4 h-4" /></button>
                         <button className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700 transition"><Send className="w-3 h-3" /></button>
                      </div>
                   </div>
                </div>
             </div>

          </div>

          {/* Sidebar (Right) */}
          <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 space-y-6 overflow-y-auto hidden md:block">
             {/* Linked Items */}
             <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">関連付け</h4>
                <div className="space-y-2">
                   {/* Project Link */}
                   {(task.type === 'project' || task.client) && (
                      <div className="bg-white p-3 rounded border border-gray-200 shadow-sm flex items-start gap-2 hover:border-blue-300 transition cursor-pointer group">
                         <Briefcase className="w-4 h-4 text-blue-500 mt-0.5" />
                         <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">SaaS営業支援システム開発</p>
                            <p className="text-xs text-gray-500">案件</p>
                         </div>
                         <ArrowUpRight className="w-3 h-3 text-gray-300 group-hover:text-blue-500" />
                      </div>
                   )}
                   {/* Talent Link */}
                   {task.type === 'talent' && (
                       <div className="bg-white p-3 rounded border border-gray-200 shadow-sm flex items-start gap-2 hover:border-blue-300 transition cursor-pointer group">
                         <Users className="w-4 h-4 text-green-500 mt-0.5" />
                         <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">佐藤 健一</p>
                            <p className="text-xs text-gray-500">人材</p>
                         </div>
                         <ArrowUpRight className="w-3 h-3 text-gray-300 group-hover:text-blue-500" />
                      </div>
                   )}
                   
                   {/* Email (Mock) */}
                   <div className="bg-white p-3 rounded border border-gray-200 shadow-sm flex items-start gap-2 hover:border-blue-300 transition cursor-pointer group">
                      <Mail className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div className="flex-1 min-w-0">
                         <p className="text-sm font-medium text-gray-900 truncate">Re: 見積もりについてのご相談</p>
                         <p className="text-xs text-gray-500">メール • 昨日 10:30</p>
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-gray-300 group-hover:text-blue-500" />
                   </div>

                   <button className="w-full py-2 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition flex items-center justify-center gap-1">
                      <Plus className="w-3 h-3" />
                      関連情報を追加
                   </button>
                </div>
             </div>

             {/* Subtasks */}
             <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">サブタスク</h4>
                <div className="space-y-1">
                   <div className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded group cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">資料の下書き作成</span>
                   </div>
                   <div className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded group cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" defaultChecked />
                      <span className="text-sm text-gray-500 line-through">要件の再確認</span>
                   </div>
                   <button className="text-xs text-blue-600 hover:underline ml-6 mt-1">+ サブタスクを追加</button>
                </div>
             </div>
             
             {/* Tags */}
             <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">タグ</h4>
                <div className="flex flex-wrap gap-2">
                   <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">重要</span>
                   <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">今週中</span>
                   <button className="text-xs text-gray-400 hover:text-gray-600 px-1 border border-transparent hover:border-gray-300 rounded-full w-5 h-5 flex items-center justify-center transition">+</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sections ---

const Dashboard = ({ onChangeView, onTaskClick }: { onChangeView: (view: string) => void, onTaskClick: (task: any) => void }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "進行中案件", value: "12", sub: "前月比 +2", color: "text-blue-600", icon: Briefcase },
          { label: "稼働可能人材", value: "8", sub: "新規登録 3名", color: "text-green-600", icon: Users },
          { label: "今週の期限タスク", value: "5", sub: "要対応 2件", color: "text-red-600", icon: AlertCircle },
          { label: "商談中案件", value: "4", sub: "見込み 3,200万円", color: "text-purple-600", icon: MessageSquare },
        ].map((stat, i) => (
          <Card key={i} className="p-4 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
            </div>
            <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* To-Do List */}
        <Card className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-primary-600" />
              要対応タスク
            </h3>
            <span className="text-xs text-gray-500 hover:underline cursor-pointer" onClick={() => onChangeView('progress')}>すべて見る</span>
          </div>
          <div className="divide-y divide-gray-100 flex-1 overflow-auto max-h-[320px]">
            {MOCK_TASKS.slice(0, 5).map(task => (
              <div key={task.id} onClick={() => onTaskClick(task)} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-3 cursor-pointer group">
                <div className={`mt-1 w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : 'bg-gray-300'}`} />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900 group-hover:text-primary-700 transition">{task.title}</span>
                    <span className={`text-xs ${task.deadline === '今日' ? 'text-red-600 font-bold' : 'text-gray-500'}`}>{task.deadline}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge color={task.type === 'project' ? 'blue' : task.type === 'talent' ? 'green' : 'gray'}>
                      {task.type === 'project' ? '案件' : task.type === 'talent' ? '人材' : 'その他'}
                    </Badge>
                    {task.linkId && <span className="text-xs text-gray-400">ID: {task.linkId}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Linked Emails */}
        <Card className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-primary-600" />
              タスク関連の新着メール
            </h3>
            <span className="text-xs text-gray-500 hover:underline cursor-pointer" onClick={() => onChangeView('search')}>メール一覧へ</span>
          </div>
          <div className="divide-y divide-gray-100 flex-1 overflow-auto max-h-[320px]">
            {MOCK_EMAILS.filter(e => e.taskId).map(email => (
              <div key={email.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    {email.isNew && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded">NEW</span>}
                    <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{email.subject}</span>
                  </div>
                  <span className="text-xs text-gray-400">{email.date}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{email.sender}</p>
                <div className="flex items-center justify-between">
                  <div 
                    onClick={() => onTaskClick(MOCK_TASKS.find(t => t.id === email.taskId) || {id: email.taskId, title: "関連タスク", status: "未完了"})}
                    className="flex items-center text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded cursor-pointer hover:bg-primary-100 transition"
                  >
                    <Trello className="w-3 h-3 mr-1" />
                    <span>関連タスクを開く</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Simple Status Chart Mock */}
        <Card className="md:col-span-2 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">ステータス別案件数</h3>
          <div className="space-y-3">
            {[
              { label: "アプローチ", count: 8, total: 30, color: "bg-gray-400" },
              { label: "駆け引き", count: 5, total: 30, color: "bg-blue-400" },
              { label: "商談中", count: 4, total: 30, color: "bg-purple-500" },
              { label: "成約", count: 12, total: 30, color: "bg-green-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="w-20 text-sm text-gray-600">{item.label}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${(item.count / item.total) * 100}%` }}></div>
                </div>
                <span className="w-8 text-right text-sm font-bold text-gray-700">{item.count}件</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card className="p-5 h-full flex flex-col justify-center gap-3">
            <h3 className="font-semibold text-gray-800 mb-2">クイックアクション</h3>
            <Button variant="secondary" className="w-full justify-start" icon={Briefcase} onClick={() => onChangeView('projects')}>案件を登録</Button>
            <Button variant="secondary" className="w-full justify-start" icon={Users} onClick={() => onChangeView('talents')}>人材を登録</Button>
            <Button variant="secondary" className="w-full justify-start" icon={Mail} onClick={() => onChangeView('search')}>メールを探す</Button>
            <Button variant="secondary" className="w-full justify-start" icon={Plus} onClick={() => onChangeView('progress')}>タスクを作る</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Register = ({ type }: { type: 'project' | 'talent' }) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [matchingQuery, setMatchingQuery] = useState("");
  const [relatedProjects, setRelatedProjects] = useState<any[]>([]);
  const [activeTalentTab, setActiveTalentTab] = useState("プロパー");

  useEffect(() => {
    setSelectedItem(null);
    setSearchQuery("");
    setMatchingQuery("");
    setRelatedProjects([]);
    setActiveTalentTab("プロパー");
  }, [type]);

  useEffect(() => {
    setRelatedProjects([]);
  }, [selectedItem]);

  // Filter items based on search query
  let items: any[] = type === 'project' ? MOCK_PROJECTS : MOCK_TALENTS;

  if (type === 'talent') {
    items = items.filter((item: any) => item.type === activeTalentTab);
  }

  const filteredItems = items.filter((item: any) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.client && item.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.skills && item.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Filter for the MATCHING PROJECTS (Right column in Talent view)
  const matchingProjects = MOCK_PROJECTS.filter((p: any) => 
    p.name.toLowerCase().includes(matchingQuery.toLowerCase()) || 
    p.client.toLowerCase().includes(matchingQuery.toLowerCase()) ||
    p.skills.some((s:string) => s.toLowerCase().includes(matchingQuery.toLowerCase()))
  );

  const renderDetailForm = () => {
    if (!selectedItem) return null;

    if (type === 'project') {
      return (
        <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedItem.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{selectedItem.client}</p>
            </div>
            <Badge color="purple">{selectedItem.status}</Badge>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">単価</label>
                <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" defaultValue={selectedItem.price} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">勤務地</label>
                <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" defaultValue="東京都内 (リモート可)" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">必須スキル</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedItem.skills.map((s: string) => <Badge key={s} color="blue">{s}</Badge>)}
                <button className="text-xs text-primary-600 hover:underline">+ 追加</button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Slack参照リンク</label>
              <div className="flex gap-2">
                <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" placeholder="https://slack.com/archives/..." />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-3">関連アクション</h4>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" icon={Plus}>タスク作成</Button>
              <Button size="sm" variant="secondary" icon={Mail}>メール紐づけ</Button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedItem.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{selectedItem.skillSummary}</p>
            </div>
            <Badge color="green">{selectedItem.status}</Badge>
          </div>

          <div className="space-y-4">
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-3">
              <h5 className="text-xs font-bold text-primary-800 mb-2 flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                AI取り込み・解析
              </h5>
              <div className="flex gap-2">
                <Button variant="secondary" className="text-xs py-1 h-8 bg-white">スキルシート読込</Button>
                <Button variant="primary" className="text-xs py-1 h-8">AIで解釈</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">希望単価</label>
                <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" defaultValue={selectedItem.price} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">経験年数</label>
                <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" defaultValue="8年" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">スキルシートURL</label>
              <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-blue-600 underline" defaultValue="https://drive.google.com/..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">スキル</label>
              <div className="flex flex-wrap gap-2">
                {selectedItem.skills.map((s: string) => <Badge key={s} color="green">{s}</Badge>)}
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-3">関連アイテム</h4>
            
            <div className="space-y-2 mb-4">
                {relatedProjects.length > 0 ? relatedProjects.map(p => (
                   <div key={p.id} className="flex items-center justify-between bg-blue-50 p-2 rounded border border-blue-100 animate-in fade-in slide-in-from-right-4">
                      <div className="flex items-center gap-2 overflow-hidden">
                         <Briefcase className="w-3 h-3 text-blue-600 shrink-0" />
                         <span className="text-sm text-gray-700 truncate">{p.name}</span>
                      </div>
                      <button onClick={() => setRelatedProjects(relatedProjects.filter(rp => rp.id !== p.id))} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition"><X className="w-3 h-3"/></button>
                   </div>
                )) : (
                  <p className="text-xs text-gray-400 py-2">関連付けられた案件はありません。<br/>右側の検索から追加してください。</p>
                )}
             </div>

          </div>
        </div>
      );
    }
  };

  // --- Layout Selection based on Type ---

  // PROJECT VIEW: Original Layout [Filter Col] [List Col] [Detail Col]
  if (type === 'project') {
    return (
      <div className="flex h-[calc(100vh-140px)] gap-4">
        {/* Search Column */}
        <Card className="w-60 flex flex-col bg-white shrink-0">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4" /> 絞り込み
            </h3>
          </div>
          <div className="p-4 space-y-6 overflow-y-auto flex-1">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500">キーワード</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="検索..." 
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500">ステータス</label>
              <div className="space-y-1.5">
                {["商談中", "提案中", "成約", "アプローチ"].map(status => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{status}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <button 
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                onClick={() => setSearchQuery("")}
              >
                <X className="w-3 h-3"/> 条件をクリア
              </button>
            </div>
          </div>
        </Card>

        {/* List Column */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white rounded-t-lg shrink-0">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-600" />
              案件リスト
            </h2>
            <Button variant="primary" className="py-1.5 px-3 text-xs h-8">
              <Plus className="w-3 h-3 mr-1" />
              新規登録
            </Button>
          </div>
          <div className="flex-1 overflow-auto bg-white p-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item: any) => (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedItem(item)}
                    className={`cursor-pointer hover:bg-blue-50 transition-colors ${selectedItem?.id === item.id ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.client || item.price}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {item.skills.slice(0, 2).map((s: string) => <span key={s} className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">{s}</span>)}
                        {item.skills.length > 2 && <span className="text-xs text-gray-400">...</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge color={item.status === '成約' || item.status === '稼働中' ? 'green' : 'blue'}>{item.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Detail Column */}
        <Card className="w-[400px] flex flex-col overflow-auto bg-white border-l border-gray-200 shadow-xl">
           {selectedItem ? renderDetailForm() : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                 <Briefcase className="w-8 h-8 mb-4 bg-gray-100 p-1.5 rounded-full" />
                 <p>リストから項目を選択して詳細を表示</p>
              </div>
           )}
        </Card>
      </div>
    );
  }

  // TALENT VIEW: New Layout [List Col] [Detail Col] [Matching Col]
  return (
    <div className="flex h-[calc(100vh-140px)] gap-4">
       {/* 1. List Column (Left) - Fixed width */}
       <Card className="w-80 flex flex-col bg-white shrink-0">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
             <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" /> 人材リスト
             </h2>
             <Button variant="primary" className="py-1 px-2 text-xs h-7"><Plus className="w-3 h-3"/> 登録</Button>
          </div>
          
          <div className="flex border-b border-gray-200">
             {["プロパー", "BP", "フリーランス"].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTalentTab(tab)}
                  className={`flex-1 py-2 text-xs font-medium text-center transition-colors border-b-2 ${activeTalentTab === tab ? 'border-green-500 text-green-700 bg-green-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                  {tab}
                </button>
             ))}
          </div>

          <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
             <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="名前、スキルで検索..." 
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
             {filteredItems.map((item: any) => (
                <div key={item.id} onClick={() => setSelectedItem(item)} className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-green-50 transition ${selectedItem?.id === item.id ? 'bg-green-50 border-l-4 border-l-green-500' : 'border-l-4 border-l-transparent'}`}>
                   <div className="flex justify-between">
                      <span className="font-bold text-gray-800 text-sm">{item.name}</span>
                      <Badge color={item.status === '稼働可能' ? 'green' : 'gray'}>{item.status}</Badge>
                   </div>
                   <div className="text-xs text-gray-500 mt-1 truncate">{item.skillSummary}</div>
                </div>
             ))}
          </div>
       </Card>

       {/* 2. Detail Column (Middle) - Flexible */}
       <Card className="flex-1 flex flex-col overflow-auto bg-white shadow-sm relative">
          {selectedItem ? (
             renderDetailForm()
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Users className="w-12 h-12 mb-4 text-gray-200" />
                <p>人材を選択して詳細を表示</p>
             </div>
          )}
       </Card>

       {/* 3. Matching Projects Col (Right) - Fixed width */}
       <Card className="w-80 flex flex-col bg-white shrink-0 border-l border-gray-200">
          <div className="p-4 border-b border-gray-100 bg-blue-50/50">
             <h3 className="font-bold text-blue-900 flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4" /> 適合案件サーチ
             </h3>
             <p className="text-xs text-blue-700 mt-1">選択中の人材にマッチする案件を探す</p>
          </div>
          
          <div className="p-4 border-b border-gray-100 space-y-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="案件名、スキルで検索..." 
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={matchingQuery}
                  onChange={(e) => setMatchingQuery(e.target.value)}
                />
             </div>
             <div className="flex gap-2">
                <label className="flex items-center text-xs text-gray-600 gap-1 cursor-pointer">
                   <input type="checkbox" defaultChecked className="rounded text-blue-600"/> スキル一致
                </label>
                 <label className="flex items-center text-xs text-gray-600 gap-1 cursor-pointer">
                   <input type="checkbox" className="rounded text-blue-600"/> 単価範囲
                </label>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50 p-2 space-y-2">
             {selectedItem ? (
                matchingProjects.map((p: any) => (
                   <div key={p.id} className="bg-white p-3 rounded border border-gray-200 shadow-sm hover:border-blue-400 cursor-pointer transition group relative">
                      <div className="flex justify-between mb-1">
                         <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded truncate max-w-[120px]">{p.client}</span>
                         <span className="text-xs text-gray-500">{p.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-800 mb-1 leading-snug group-hover:text-blue-700">{p.name}</h4>
                      <div className="flex flex-wrap gap-1 mb-2">
                         {p.skills.slice(0,3).map((s:any) => <span key={s} className="text-[10px] bg-gray-100 text-gray-600 px-1 rounded">{s}</span>)}
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                         <span className="text-xs font-bold text-gray-700">{p.price}</span>
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             if (!relatedProjects.find(rp => rp.id === p.id)) {
                                 setRelatedProjects([...relatedProjects, p]);
                             }
                           }}
                           className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
                         >
                            <Plus className="w-3 h-3" /> 追加
                         </button>
                      </div>
                   </div>
                ))
             ) : (
                <div className="text-center py-8 text-gray-400 text-xs">
                   人材を選択すると<br/>おすすめ案件が表示されます
                </div>
             )}
          </div>
       </Card>
    </div>
  );
};

const SearchSection = () => {
  const [query, setQuery] = useState("");
  const [showAi, setShowAi] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6">
      {/* List Column */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="メール、案件、人材を検索..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
             {["すべて", "案件", "人材" ].map(f => (
               <button key={f} className="whitespace-nowrap px-3 py-1 rounded-full text-xs border border-gray-200 bg-white hover:bg-gray-50 text-gray-600">
                 {f}
               </button>
             ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="divide-y divide-gray-100">
            {MOCK_EMAILS.map(email => (
              <div 
                key={email.id} 
                onClick={() => setSelectedEmail(email)}
                className={`p-4 bg-white hover:bg-gray-50 cursor-pointer ${selectedEmail?.id === email.id ? 'border-l-4 border-primary-500 bg-blue-50' : 'border-l-4 border-transparent'}`}
              >
                <div className="flex justify-between mb-1">
                  <span className={`text-sm ${email.isNew ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{email.sender}</span>
                  <span className="text-xs text-gray-400">{email.date}</span>
                </div>
                <h4 className={`text-sm mb-1 ${email.isNew ? 'font-bold text-gray-900' : 'text-gray-800'}`}>{email.subject}</h4>
                <p className="text-xs text-gray-500 truncate">{email.body}</p>
                <div className="mt-2 flex gap-2">
                  {!email.taskId && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">未タスク化</span>}
                  {email.taskId && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700"><CheckCircle2 className="w-3 h-3 mr-1"/>タスク済</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Preview Column */}
      <Card className="flex-1 flex flex-col bg-white overflow-hidden relative">
        {selectedEmail ? (
          <>
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedEmail.subject}</h2>
                <div className="flex gap-2">
                   <Button size="sm" variant="secondary" icon={Trello}>タスク化</Button>
                   <Button size="sm" variant="ghost"><MoreHorizontal className="w-4 h-4"/></Button>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                  {selectedEmail.sender[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{selectedEmail.sender}</p>
                  <p className="text-xs text-gray-500">to me • {selectedEmail.date}</p>
                </div>
              </div>
              <div className="prose prose-sm text-gray-700 max-w-none">
                <p>佐藤様</p>
                <p>{selectedEmail.body}...</p>
                <p>ご検討のほどよろしくお願いいたします。</p>
              </div>
            </div>
            
            {/* AI Suggestion Area in Email Preview */}
            <div className="p-4 bg-primary-50 m-4 rounded-lg border border-primary-100">
               <div className="flex items-center gap-2 mb-2">
                 <Bot className="w-4 h-4 text-primary-600" />
                 <span className="text-sm font-bold text-primary-800">はなえさんAIの提案</span>
               </div>
               <p className="text-xs text-gray-700 mb-3">このメールの内容から、以下のタスクを作成することをお勧めします。</p>
               <div className="bg-white p-3 rounded border border-gray-200 shadow-sm">
                 <div className="flex items-center justify-between mb-1">
                   <span className="text-sm font-semibold">見積書の修正案作成</span>
                   <span className="text-xs text-red-500">期限: 明日</span>
                 </div>
                 <p className="text-xs text-gray-500">関連: 株式会社アルファ</p>
               </div>
               <div className="mt-3 flex gap-2">
                 <button className="text-xs bg-primary-600 text-white px-3 py-1.5 rounded hover:bg-primary-700 transition">この内容でタスク作成</button>
                 <button className="text-xs bg-white text-gray-600 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 transition">返信文案を作成</button>
               </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
             <Mail className="w-12 h-12 mb-4 text-gray-200" />
             <p>メールを選択してプレビューを表示</p>
          </div>
        )}

        {/* Floating AI Chat Trigger */}
        <div className="absolute bottom-4 right-4">
           <button 
             onClick={() => setShowAi(!showAi)}
             className="bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2"
           >
             <Bot className="w-5 h-5" />
             <span className="text-sm font-medium pr-1">AI検索</span>
           </button>
        </div>

        {/* AI Chat Panel */}
        {showAi && (
          <div className="absolute bottom-16 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="bg-gray-900 text-white p-3 flex justify-between items-center">
              <span className="font-bold text-sm flex items-center"><Sparkles className="w-3 h-3 mr-2 text-yellow-400"/>はなえさんAI</span>
              <X className="w-4 h-4 cursor-pointer" onClick={() => setShowAi(false)}/>
            </div>
            <div className="h-64 p-4 bg-gray-50 overflow-y-auto space-y-3">
              <div className="flex gap-2">
                 <div className="w-6 h-6 rounded-full bg-gray-900 flex-shrink-0 mt-1"></div>
                 <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-xs text-gray-700">
                   こんにちは。お探しものですか？<br/>「Reactが得意な人を探して」「案件Aに合う人」のように聞いてください。
                 </div>
              </div>
              <div className="flex gap-2 flex-row-reverse">
                 <div className="bg-primary-600 text-white p-2 rounded-lg rounded-tr-none shadow-sm text-xs">
                   株式会社アルファの案件に合う人材は？
                 </div>
              </div>
              <div className="flex gap-2">
                 <div className="w-6 h-6 rounded-full bg-gray-900 flex-shrink-0 mt-1"></div>
                 <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-xs text-gray-700 space-y-2">
                   <div>アルファ社の案件（React/Node.js）には、以下の人材がマッチしそうです。</div>
                   <div className="border border-gray-100 rounded p-2 bg-gray-50 hover:bg-blue-50 cursor-pointer transition">
                      <div className="font-bold text-primary-700">佐藤 健一</div>
                      <div className="text-[10px] text-gray-500">React, TypeScript, Next.js</div>
                      <div className="text-[10px] mt-1 text-green-600">稼働可能・単価範囲内</div>
                   </div>
                 </div>
              </div>
            </div>
            <div className="p-2 border-t border-gray-100 flex gap-2 bg-white">
              <input type="text" placeholder="メッセージを入力..." className="flex-1 text-xs border-none focus:ring-0 bg-transparent" />
              <button className="text-primary-600 hover:bg-primary-50 p-1.5 rounded"><Send className="w-4 h-4"/></button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onChangeView={setCurrentView} onTaskClick={setSelectedTask} />;
      case "projects":
        return <Register type="project" />;
      case "talents":
        return <Register type="talent" />;
      case "search":
        return <SearchSection />;
      case "progress":
        return <Dashboard onChangeView={setCurrentView} onTaskClick={setSelectedTask} />; 
      default:
        return <Dashboard onChangeView={setCurrentView} onTaskClick={setSelectedTask} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 transition-all duration-300">
        <div className="p-6 flex items-center gap-3 text-white">
          <div className="bg-indigo-500 p-2 rounded-lg">
             <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Hanae <span className="text-indigo-400">AI</span></span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
           <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Main</p>
           <button onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'dashboard' || currentView === 'progress' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}>
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium text-sm">ダッシュボード</span>
           </button>
           <button onClick={() => setCurrentView('projects')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'projects' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}>
              <Briefcase className="w-5 h-5" />
              <span className="font-medium text-sm">案件</span>
           </button>
           <button onClick={() => setCurrentView('talents')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'talents' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}>
              <Users className="w-5 h-5" />
              <span className="font-medium text-sm">人材</span>
           </button>
           <button onClick={() => setCurrentView('search')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'search' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}>
              <Search className="w-5 h-5" />
              <span className="font-medium text-sm">メール一覧</span>
           </button>

           <div className="pt-6 mt-6 border-t border-slate-800">
             <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Workspace</p>
             <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors text-slate-400">
                <Settings className="w-5 h-5" />
                <span className="font-medium text-sm">設定</span>
             </button>
           </div>
        </nav>

        <div className="p-4 bg-slate-950/50">
           <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                 JD
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-medium text-white truncate">John Doe</p>
                 <p className="text-xs text-slate-500 truncate">john@example.com</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
           <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-800 capitalize">
                {currentView === 'dashboard' ? 'ダッシュボード' : 
                 currentView === 'projects' ? '案件' : 
                 currentView === 'talents' ? '人材' : 'メール一覧'}
              </h1>
              {currentView === 'projects' && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">5件の新着</span>}
           </div>
           <div className="flex items-center gap-4">
              <div className="relative">
                 <Bell className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer transition" />
                 <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
              <Button variant="ghost" size="sm" className="text-gray-500">ヘルプ</Button>
           </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-auto p-6 relative">
           {renderContent()}
        </div>
      </main>

      {/* Modals */}
      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);