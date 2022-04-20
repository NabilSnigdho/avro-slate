import { Text, BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type ParagraphElement = { type: 'paragraph'; children: Text[] }

type AvroSlateElement = ParagraphElement

export type AvroSlateEditor = BaseEditor & ReactEditor & HistoryEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: AvroSlateEditor
    Element: AvroSlateElement
  }
}
