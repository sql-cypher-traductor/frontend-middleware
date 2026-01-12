'use client'

import Editor from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { useEffect, useRef } from 'react'

interface SQLEditorProps {
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
  height?: string
  placeholder?: string
}

export function SQLEditor({
  value,
  onChange,
  readOnly = false,
  height = '400px',
  placeholder = 'Escribe tu consulta SQL aquí...',
}: SQLEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  function handleEditorDidMount(editorInstance: editor.IStandaloneCodeEditor) {
    editorRef.current = editorInstance

    // Si está vacío, mostrar placeholder
    if (!value && placeholder) {
      editorInstance.setValue(`-- ${placeholder}`)
      editorInstance.setSelection({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: placeholder.length + 4,
      })
    }
  }

  function handleEditorChange(newValue: string | undefined) {
    // Sanitizar básicamente: remover caracteres null
    const sanitized = (newValue || '').replace(/\0/g, '')
    onChange(sanitized)
  }

  useEffect(() => {
    if (readOnly && editorRef.current) {
      editorRef.current.updateOptions({ readOnly: true })
    }
  }, [readOnly])

  return (
    <div className="rounded-lg border border-gray-700 overflow-hidden bg-gray-900">
      <Editor
        height={height}
        defaultLanguage="sql"
        theme="vs-dark"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          suggestOnTriggerCharacters: true,
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false,
          },
          parameterHints: {
            enabled: true,
          },
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  )
}
