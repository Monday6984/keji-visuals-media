import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

// Renders Payload rich text (FAQ answers, About bio) with the site's prose styles.
export function RichText({ data, className = '' }: { data: unknown; className?: string }) {
  if (!data || typeof data !== 'object') return null
  return (
    <LexicalRichText
      data={data as SerializedEditorState}
      className={`[&_a]:text-olive-deep [&_a]:underline [&_li]:mb-1.5 [&_ol]:pl-5 [&_p]:m-0 [&_p+p]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 ${className}`}
    />
  )
}
