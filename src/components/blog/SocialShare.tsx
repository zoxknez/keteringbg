'use client'

import { Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react'
import { useState } from 'react'

interface SocialShareProps {
    url: string
    title: string
    description?: string
}

export default function SocialShare({ url, title, description }: SocialShareProps) {
    const [copied, setCopied] = useState(false)

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const handleShare = (platform: keyof typeof shareLinks) => {
        window.open(shareLinks[platform], '_blank', 'width=600,height=400')
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-neutral-400 font-semibold uppercase tracking-wider">Share:</span>

            <button
                onClick={() => handleShare('facebook')}
                className="group flex items-center gap-2 px-4 py-2 glass-card rounded-full hover:bg-[var(--facebook-blue)]/20 hover:border-[var(--facebook-blue)]/50 transition-all"
                aria-label="Share on Facebook"
            >
                <Facebook className="h-4 w-4 text-neutral-400 group-hover:text-[var(--facebook-blue)] transition-colors" />
                <span className="text-xs text-neutral-400 group-hover:text-white transition-colors">Facebook</span>
            </button>

            <button
                onClick={() => handleShare('twitter')}
                className="group flex items-center gap-2 px-4 py-2 glass-card rounded-full hover:bg-sky-500/20 hover:border-sky-500/50 transition-all"
                aria-label="Share on Twitter"
            >
                <Twitter className="h-4 w-4 text-neutral-400 group-hover:text-sky-500 transition-colors" />
                <span className="text-xs text-neutral-400 group-hover:text-white transition-colors">Twitter</span>
            </button>

            <button
                onClick={() => handleShare('linkedin')}
                className="group flex items-center gap-2 px-4 py-2 glass-card rounded-full hover:bg-blue-600/20 hover:border-blue-600/50 transition-all"
                aria-label="Share on LinkedIn"
            >
                <Linkedin className="h-4 w-4 text-neutral-400 group-hover:text-blue-600 transition-colors" />
                <span className="text-xs text-neutral-400 group-hover:text-white transition-colors">LinkedIn</span>
            </button>

            <button
                onClick={handleCopyLink}
                className="group flex items-center gap-2 px-4 py-2 glass-card rounded-full hover:bg-amber-500/20 hover:border-amber-500/50 transition-all"
                aria-label="Copy link"
            >
                {copied ? (
                    <>
                        <Check className="h-4 w-4 text-amber-500" />
                        <span className="text-xs text-amber-500">Copied!</span>
                    </>
                ) : (
                    <>
                        <LinkIcon className="h-4 w-4 text-neutral-400 group-hover:text-amber-500 transition-colors" />
                        <span className="text-xs text-neutral-400 group-hover:text-white transition-colors">Copy Link</span>
                    </>
                )}
            </button>
        </div>
    )
}
