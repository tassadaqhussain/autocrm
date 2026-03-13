import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Heading1,
    Heading2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const MenuButton = ({
    onClick,
    isActive,
    disabled,
    children,
    title,
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={cn(
            "p-2 rounded-lg transition-all duration-200",
            isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-100",
            disabled && "opacity-50 cursor-not-allowed"
        )}
    >
        {children}
    </button>
);

export default function RichTextEditor({
    value,
    onChange,
    placeholder,
    className,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
            Underline.configure(),
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Fix: Update editor content when value prop changes (e.g. when opening a different review)
    useEffect(() => {
        if (!editor || editor.isDestroyed) return;

        const currentHTML = editor.getHTML();
        if (value !== currentHTML) {
            // Avoid unnecessary resets if both are effectively empty
            if (!value && (currentHTML === '' || currentHTML === '<p></p>')) {
                return;
            }
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className={cn(
            "w-full border border-slate-200 rounded-2xl bg-white overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500 shadow-sm transition-all",
            className
        )}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50/50 border-b border-slate-100">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="Underline"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </MenuButton>

                <div className="w-px h-6 bg-slate-200 mx-1" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    title="Heading 1"
                >
                    <Heading1 className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 className="w-4 h-4" />
                </MenuButton>

                <div className="w-px h-6 bg-slate-200 mx-1" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Ordered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="Blockquote"
                >
                    <Quote className="w-4 h-4" />
                </MenuButton>

                <div className="ml-auto flex gap-1">
                    <MenuButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo"
                    >
                        <Undo className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo"
                    >
                        <Redo className="w-4 h-4" />
                    </MenuButton>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative">
                <EditorContent
                    editor={editor}
                    className="prose prose-sm max-w-none p-4 min-h-[150px] focus:outline-none text-[14px] font-semibold text-slate-700"
                />
                {editor.isEmpty && placeholder && (
                    <div className="absolute top-4 left-4 text-slate-400 text-sm font-medium pointer-events-none italic">
                        {placeholder}
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .ProseMirror {
                    outline: none !important;
                }
                .ProseMirror p {
                    margin-bottom: 0.5rem;
                }
                .ProseMirror ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin-bottom: 0.5rem;
                }
                .ProseMirror ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                    margin-bottom: 0.5rem;
                }
                .ProseMirror blockquote {
                    border-left: 4px solid #e2e8f0;
                    padding-left: 1rem;
                    color: #64748b;
                    font-style: italic;
                    margin-bottom: 0.5rem;
                }
            ` }} />
        </div>
    );
}
